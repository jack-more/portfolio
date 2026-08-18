#!/usr/bin/env python3
"""
Fetch 3D atomic coordinates for the SKO catalog.

Two sources, in order of preference:
  1. PubChem's own computed 3D conformer, when it has one.
  2. PubChem's SMILES fed to the NCI CACTUS resolver, which generates a
     conformer. SMILES carries stereochemistry, so this path handles the
     D-amino acids, Aib residues and cyclic lactams that sequence-based
     folding tools (ESMFold/AlphaFold) model incorrectly or not at all.

Nothing here invents geometry. Anything that fails both paths is reported as
MISSING rather than approximated, and every success records which source it
came from so the viewer can cite it.

Usage:  python3 scripts/fetch-peptide-structures.py [--out public/peptides]
"""

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

PUBCHEM = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound"
CACTUS = "https://cactus.nci.nih.gov/chemical/structure"

# slug -> (display name, PubChem search names to try in order)
# Multiple names because vendor names and IUPAC/registry names often differ.
TARGETS = [
    # Resolved by CID, not name, where the plain name is ambiguous in PubChem.
    # "KPV" as a name returns 5-Phenyl-2-keto-valeric acid — a keto acid with no
    # nitrogen — not the Lys-Pro-Val tripeptide. CID 125672 is the real one.
    ("kpv",          "KPV",               ["cid:125672"]),
    ("ghk",          "GHK",               ["cid:73587"]),
    ("glutathione",  "Glutathione",       ["cid:124886", "glutathione"]),
    ("nad",          "NAD+",              ["cid:5892"]),
    ("slupp332",     "SLU-PP-332",        ["cid:5338394", "SLU-PP-332"]),
    ("bpc157",       "BPC-157",           ["BPC-157", "BPC 157"]),
    ("tb500",        "TB-500",            ["TB-500", "Thymosin beta 4 (1-4)", "TB4 fragment"]),
    ("semax",        "Semax",             ["Semax"]),
    ("selank",       "Selank",            ["Selank"]),
    ("dsip",         "DSIP",              ["DSIP", "delta sleep-inducing peptide"]),
    ("kisspeptin10", "Kisspeptin-10",     ["Kisspeptin-10", "kisspeptin 112-121"]),
    ("motsc",        "MOTS-c",            ["MOTS-c"]),
    ("ara290",       "ARA-290",           ["ARA-290", "cibinetide"]),
    ("aod9604",      "AOD-9604",          ["AOD-9604"]),
    ("sermorelin",   "Sermorelin",        ["Sermorelin"]),
    ("tesamorelin",  "Tesamorelin",       ["Tesamorelin"]),
    ("thymosina1",   "Thymosin Alpha-1",  ["Thymalfasin", "Thymosin alpha-1"]),
    ("ipamorelin",   "Ipamorelin",        ["Ipamorelin"]),
    # CJC-1295 no DAC (Mod GRF 1-29) has NO PubChem record. Two wrong matches
    # have already been caught here, both of which rendered convincingly:
    #   "Sermorelin"  -> CID 16132413, GRF(1-29), MW 3357.9 — a different peptide
    #   "CJC-1295"    -> CID 91971820, the DAC version,  MW 3647.3 — wrong variant
    # Leave it unresolved until a structure for the actual no-DAC product exists.
    ("cjc1295",      "CJC-1295 no DAC",   ["CJC-1295 without DAC", "Modified GRF (1-29)"]),
    ("pt141",        "PT-141",            ["Bremelanotide", "PT-141"]),
    ("mt2",          "MT-2",              ["Melanotan II", "Melanotan-2"]),
    ("mt1",          "MT-1",              ["Afamelanotide", "Melanotan I"]),
    ("ss31",         "SS-31",             ["Elamipretide", "SS-31"]),
    ("tirzepatide",  "Tirzepatide",       ["Tirzepatide"]),
    ("retatrutide",  "Retatrutide",       ["Retatrutide", "LY3437943"]),
    ("cagrilintide", "Cagrilintide",      ["Cagrilintide"]),
    ("amino1mq",     "5-Amino-1MQ",       ["5-amino-1-methylquinolinium", "5-Amino-1MQ"]),
    ("igf1lr3",      "IGF1-LR3",          ["IGF-I LR3", "Long R3 IGF-1"]),
]


def get(url, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": "sko-structure-fetch/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def first_cid(names):
    """
    Resolve the first identifier PubChem recognises. An entry of the form
    "cid:12345" pins an exact record, for compounds whose common name resolves
    to something else entirely.
    """
    for name in names:
        if name.startswith("cid:"):
            return name[4:], name
        try:
            txt = get(f"{PUBCHEM}/name/{urllib.parse.quote(name)}/cids/TXT", timeout=30)
            cid = txt.strip().splitlines()[0].strip()
            if cid.isdigit():
                return cid, name
        except Exception:
            continue
    return None, None


def pubchem_3d(cid):
    try:
        sdf = get(f"{PUBCHEM}/cid/{cid}/SDF?record_type=3d")
        return sdf if sdf.lstrip().startswith(cid) or "V2000" in sdf else None
    except Exception:
        return None


def pubchem_smiles(cid):
    for prop in ("CanonicalSMILES", "IsomericSMILES", "ConnectivitySMILES", "SMILES"):
        try:
            s = get(f"{PUBCHEM}/cid/{cid}/property/{prop}/TXT", timeout=30).strip()
            if s and not s.startswith("Status:"):
                return s.splitlines()[0].strip()
        except Exception:
            continue
    return None


def cactus_3d(smiles):
    url = f"{CACTUS}/{urllib.parse.quote(smiles, safe='')}/file?format=sdf&get3d=true"
    try:
        sdf = get(url, timeout=180)
        return sdf if "V2000" in sdf else None
    except Exception:
        return None


def atom_count(sdf):
    try:
        return int(sdf.splitlines()[3][0:3])
    except Exception:
        return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="public/peptides")
    args = ap.parse_args()

    results = []
    for slug, display, names in TARGETS:
        cid, matched = first_cid(names)
        if not cid:
            print(f"{display:22s} MISSING  (no PubChem record for {names})", flush=True)
            results.append({"slug": slug, "name": display, "status": "missing"})
            continue

        sdf = pubchem_3d(cid)
        source = f"PubChem CID {cid} · computed 3D conformer"

        if not sdf:
            smiles = pubchem_smiles(cid)
            if smiles:
                sdf = cactus_3d(smiles)
                source = f"PubChem CID {cid} SMILES · NCI CACTUS 3D conformer"

        if not sdf:
            print(f"{display:22s} MISSING  (cid {cid}, no 3D from either source)", flush=True)
            results.append({"slug": slug, "name": display, "cid": cid, "status": "missing"})
            continue

        n = atom_count(sdf)
        with open(f"{args.out}/{slug}.sdf", "w") as fh:
            fh.write(sdf)
        print(f"{display:22s} OK  {n:4d} atoms  cid={cid} via={'pubchem' if 'computed' in source else 'cactus'}", flush=True)
        results.append({
            "slug": slug, "name": display, "cid": cid, "matchedName": matched,
            "atoms": n, "source": source, "status": "ok",
        })
        time.sleep(0.35)  # be polite to both services

    with open(f"{args.out}/_manifest.json", "w") as fh:
        json.dump(results, fh, indent=2)

    ok = sum(1 for r in results if r["status"] == "ok")
    print(f"\n{ok}/{len(results)} resolved", file=sys.stderr)


if __name__ == "__main__":
    main()

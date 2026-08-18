#!/usr/bin/env python3
"""
Verify every shipped structure against its PubChem record.

This exists because a name lookup silently returned the wrong compound: the
name "KPV" resolves in PubChem to 5-Phenyl-2-keto-valeric acid (C11H12O3, no
nitrogen), not the Lys-Pro-Val tripeptide. It was shipped under the KPV SKU and
looked perfectly plausible on screen.

A structure on a product page is a factual claim. Run this before deploying.

  python3 scripts/verify-peptide-structures.py

Exit code is non-zero if any structure fails, so it can gate a build.
"""

import collections
import glob
import json
import os
import sys
import urllib.request

MASS = {
    'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999, 'S': 32.06,
    'P': 30.974, 'CU': 63.546, 'SE': 78.971, 'NA': 22.99, 'CL': 35.45,
}

OUT = 'public/peptides'


def bond_geometry(P, E, bonds):
    """
    Heavy-atom covalent bonds are 1.2-1.8 A. Anything outside that is not a
    molecule.

    This check exists because the NCI CACTUS resolver returns SDFs that are
    formula-correct but geometrically meaningless — every heavy-atom bond
    exactly 1.00 A (unit-normalised topology, not a conformer), sometimes with
    stray 7.3 A "bonds". Formula verification cannot see this, because formula
    depends only on the atom list. The render still looks like a molecule.
    """
    import math
    lens = [
        math.dist(P[a], P[b])
        for a, b in bonds
        if E[a] != 'H' and E[b] != 'H'
    ]
    if not lens:
        return None, 'no heavy-atom bonds'
    lens.sort()
    med = lens[len(lens) // 2]
    if not (1.2 <= med <= 1.8):
        return med, f'median heavy-atom bond {med:.2f} A (expected 1.2-1.8)'
    if lens[-1] > 2.5:
        return med, f'longest heavy-atom bond {lens[-1]:.2f} A'
    return med, None


def parse_sdf(path):
    lines = open(path).read().splitlines()
    if len(lines) < 4:
        raise ValueError('too short')
    na = int(lines[3][0:3])
    nb = int(lines[3][3:6])
    els = [lines[4 + i][31:34].strip() for i in range(na)]
    if len(els) != na or any(not e for e in els):
        raise ValueError('atom block truncated')
    pts = [
        (float(lines[4 + i][0:10]), float(lines[4 + i][10:20]), float(lines[4 + i][20:30]))
        for i in range(na)
    ]
    bonds = []
    for i in range(nb):
        l = lines[4 + na + i]
        a, b = int(l[0:3]), int(l[3:6])
        if not (1 <= a <= na and 1 <= b <= na):
            raise ValueError(f'bond {i} references atom outside 1..{na}')
        bonds.append((a - 1, b - 1))
    return na, nb, els, pts, bonds


def hill(els):
    t = collections.Counter(e.upper() for e in els)
    rest = sorted(k for k in t if k not in ('C', 'H'))
    order = (['C'] if 'C' in t else []) + (['H'] if 'H' in t else []) + rest
    return ''.join(f"{e.capitalize()}{t[e] if t[e] > 1 else ''}" for e in order)


def pubchem_formula(cid):
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/property/MolecularFormula/TXT"
    try:
        return urllib.request.urlopen(url, timeout=25).read().decode().strip()
    except Exception:
        return None


def main():
    manifest = {r['slug']: r for r in json.load(open(f'{OUT}/_manifest.json'))}
    failures = []

    for path in sorted(glob.glob(f'{OUT}/*.sdf')):
        slug = os.path.basename(path)[:-4]
        row = manifest.get(slug)

        try:
            na, nb, els, pts, bonds = parse_sdf(path)
        except Exception as e:
            print(f'FAIL  {slug:15s} unparseable: {e}')
            failures.append(slug)
            continue

        formula = hill(els)
        mw = sum(MASS.get(e.upper(), 0) for e in els)

        upper = [e.upper() for e in els]
        med, geom_err = bond_geometry(pts, upper, bonds)
        if geom_err:
            print(f'FAIL  {slug:15s} {formula:24s} bad geometry: {geom_err}')
            failures.append(slug)
            continue

        if not row or not row.get('cid'):
            # Unverifiable is a failure, not a pass. This is the exact gap that
            # let the wrong KPV structure through.
            print(f'FAIL  {slug:15s} {formula:24s} no manifest CID to verify against')
            failures.append(slug)
            continue

        ref = pubchem_formula(row['cid'])
        if ref is None:
            print(f'FAIL  {slug:15s} could not reach PubChem for cid {row["cid"]}')
            failures.append(slug)
        elif ref.replace('+', '').replace('-', '') != formula:
            print(f'FAIL  {slug:15s} {formula:24s} != PubChem {ref} (cid {row["cid"]})')
            failures.append(slug)
        else:
            print(f'ok    {slug:15s} {na:4d} atoms {nb:4d} bonds  {formula:24s} MW {mw:8.2f}')

    print()
    if failures:
        print(f'{len(failures)} FAILED: {", ".join(failures)}')
        return 1
    print(f'all {len(glob.glob(f"{OUT}/*.sdf"))} structures verified against PubChem')
    return 0


if __name__ == '__main__':
    sys.exit(main())

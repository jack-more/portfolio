#!/usr/bin/env python3
"""
Generate real 3D conformers with RDKit for structures PubChem has no 3D record for.

Run with the pinned interpreter:  .venv-rdkit/bin/python scripts/generate-conformers.py

Why this replaced the NCI CACTUS path
-------------------------------------
CACTUS returns SDFs that are formula-correct but geometrically meaningless:
every heavy-atom bond exactly 1.00 A (unit-normalised topology, not a
conformer), occasionally with 7.3 A "bonds". They render as convincing
molecules and pass any formula-based check. See
scripts/verify-peptide-structures.py, which now gates on bond geometry.

Stereochemistry
---------------
SMILES are fetched as IsomericSMILES. PubChem's CanonicalSMILES omits stereo
descriptors, which would silently convert the D-amino acids in PT-141, MT-2,
SS-31 and Ipamorelin into their L forms — a different molecule that looks
identical in a render.
"""

import json
import sys
import urllib.parse
import urllib.request

from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem

RDLogger.DisableLog('rdApp.*')

PUBCHEM = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound"
OUT = "public/peptides"


def get(url, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": "sko-conformer/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def smiles_for(cid):
    """Isomeric first — stereochemistry is not optional here."""
    for prop in ("IsomericSMILES", "SMILES", "CanonicalSMILES"):
        try:
            s = get(f"{PUBCHEM}/cid/{cid}/property/{prop}/TXT", timeout=30).strip()
            if s and not s.startswith("Status:"):
                return s.splitlines()[0].strip(), prop
        except Exception:
            continue
    return None, None


def embed(smiles):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None, 'SMILES did not parse'
    mol = Chem.AddHs(mol)

    params = AllChem.ETKDGv3()
    params.randomSeed = 0xF00D          # deterministic output across runs
    params.useSmallRingTorsions = True
    params.maxIterations = 2000

    if AllChem.EmbedMolecule(mol, params) != 0:
        # Large flexible peptides frequently fail clean embedding; random
        # coordinates plus minimisation still converges to valid geometry.
        params.useRandomCoords = True
        if AllChem.EmbedMolecule(mol, params) != 0:
            return None, 'embedding failed'

    try:
        if AllChem.MMFFHasAllMoleculeParams(mol):
            AllChem.MMFFOptimizeMolecule(mol, maxIters=5000)
        else:
            AllChem.UFFOptimizeMolecule(mol, maxIters=5000)
    except Exception as e:
        return None, f'optimisation failed: {e}'

    return mol, None


def heavy_bond_median(mol):
    conf = mol.GetConformer()
    lens = []
    for b in mol.GetBonds():
        a1, a2 = b.GetBeginAtom(), b.GetEndAtom()
        if a1.GetSymbol() == 'H' or a2.GetSymbol() == 'H':
            continue
        p, q = conf.GetAtomPosition(a1.GetIdx()), conf.GetAtomPosition(a2.GetIdx())
        lens.append(((p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2) ** 0.5)
    lens.sort()
    return lens[len(lens) // 2] if lens else 0.0


def main():
    manifest = json.load(open(f'{OUT}/_manifest.json'))
    targets = sys.argv[1:]

    for row in manifest:
        slug = row['slug']
        if targets and slug not in targets:
            continue
        if row.get('status') != 'ok' or not row.get('cid'):
            continue
        # Leave PubChem's own experimental/computed 3D records alone.
        if 'CACTUS' not in (row.get('source') or ''):
            continue

        smiles, prop = smiles_for(row['cid'])
        if not smiles:
            print(f"{row['name']:22s} FAIL  no SMILES", flush=True)
            continue

        mol, err = embed(smiles)
        if err:
            print(f"{row['name']:22s} FAIL  {err}", flush=True)
            continue

        med = heavy_bond_median(mol)
        if not (1.2 <= med <= 1.8):
            print(f"{row['name']:22s} FAIL  median heavy bond {med:.2f} A", flush=True)
            continue

        block = Chem.MolToMolBlock(mol)
        with open(f'{OUT}/{slug}.sdf', 'w') as fh:
            fh.write(block)

        row['source'] = f"PubChem CID {row['cid']} {prop} · RDKit ETKDGv3 conformer"
        row['atoms'] = mol.GetNumAtoms()
        print(f"{row['name']:22s} OK    {mol.GetNumAtoms():4d} atoms  median bond {med:.2f} A  ({prop})", flush=True)

    json.dump(manifest, open(f'{OUT}/_manifest.json', 'w'), indent=2)


if __name__ == '__main__':
    main()

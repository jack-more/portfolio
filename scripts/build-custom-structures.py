#!/usr/bin/env python3
"""
Build structures for compounds PubChem has no usable record for.

Run:  .venv-rdkit/bin/python scripts/build-custom-structures.py

Each structure is assembled from its published sequence and then checked
against its published molecular formula. A formula match is strong evidence the
constitution is right; it says nothing about stereochemistry, so any D-residue
is set explicitly and its CIP code asserted.

Nothing here is written unless both checks pass.
"""

import json
import sys

from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem
from rdkit.Chem.rdMolDescriptors import CalcMolFormula

RDLogger.DisableLog('rdApp.*')

OUT = 'public/peptides'


def amidate_c_terminus(mol):
    """
    Convert the C-terminal carboxyl to a primary amide.

    The last residue of every sequence handled here is Arg, whose side chain
    carries no carboxyl, so the highest-indexed carboxyl carbon is
    unambiguously the C-terminus — Asp/Glu side-chain carboxyls are built
    earlier and therefore have lower atom indices.
    """
    patt = Chem.MolFromSmarts('[CX3](=O)[OX2H1]')
    matches = mol.GetSubstructMatches(patt)
    if not matches:
        raise ValueError('no carboxyl found to amidate')
    cterm = max(matches, key=lambda m: m[0])
    rw = Chem.RWMol(mol)
    rw.GetAtomWithIdx(cterm[2]).SetAtomicNum(7)  # -OH -> -NH2
    out = rw.GetMol()
    Chem.SanitizeMol(out)
    return out


def invert_residue(mol, resnum, expect_from, expect_to):
    """Flip the alpha carbon of one residue, L <-> D, and assert the CIP code."""
    Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
    ca = [
        a.GetIdx() for a in mol.GetAtoms()
        if (ri := a.GetPDBResidueInfo())
        and ri.GetResidueNumber() == resnum
        and ri.GetName().strip() == 'CA'
    ]
    if len(ca) != 1:
        raise ValueError(f'expected one CA for residue {resnum}, found {len(ca)}')
    atom = mol.GetAtomWithIdx(ca[0])

    before = atom.GetPropsAsDict().get('_CIPCode')
    if before != expect_from:
        raise ValueError(f'residue {resnum} CA is {before}, expected {expect_from}')

    tag = atom.GetChiralTag()
    atom.SetChiralTag(
        Chem.ChiralType.CHI_TETRAHEDRAL_CCW
        if tag == Chem.ChiralType.CHI_TETRAHEDRAL_CW
        else Chem.ChiralType.CHI_TETRAHEDRAL_CW
    )
    Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
    after = mol.GetAtomWithIdx(ca[0]).GetPropsAsDict().get('_CIPCode')
    if after != expect_to:
        raise ValueError(f'inversion failed: residue {resnum} CA is {after}, wanted {expect_to}')
    return mol


def embed(mol):
    mol = Chem.AddHs(mol)
    p = AllChem.ETKDGv3()
    p.randomSeed = 0xF00D
    p.useSmallRingTorsions = True
    p.maxIterations = 2000
    if AllChem.EmbedMolecule(mol, p) != 0:
        p.useRandomCoords = True
        if AllChem.EmbedMolecule(mol, p) != 0:
            raise ValueError('embedding failed')
    if AllChem.MMFFHasAllMoleculeParams(mol):
        AllChem.MMFFOptimizeMolecule(mol, maxIters=5000)
    else:
        AllChem.UFFOptimizeMolecule(mol, maxIters=5000)
    return mol


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


def build_modgrf():
    """
    CJC-1295 no DAC / Mod GRF (1-29).

    [D-Ala2, Gln8, Ala15, Leu27]-hGRF(1-29)-NH2. Parent GRF(1-29) is sermorelin,
    YADAIFTNSYRKVLGQLSARKLLQDIMSR-NH2; the four substitutions block DPP-4
    cleavage (D-Ala2), Asn deamidation (Gln8), and Met oxidation (Leu27).

    PubChem has no record: searching "CJC-1295" returns the DAC variant
    (CID 91971820, MW 3647) and "Modified GRF (1-29)" returns nothing.
    """
    seq = 'YADAIFTQSYRKVLAQLSARKLLQDILSR'
    mol = Chem.MolFromFASTA(seq)
    if mol is None:
        raise ValueError('FASTA did not parse')
    mol = amidate_c_terminus(mol)
    mol = invert_residue(mol, 2, 'S', 'R')  # L-Ala (S) -> D-Ala (R)
    return mol, 'C152H252N44O42', 'CJC-1295 no DAC', 'cjc1295'


TARGETS = [build_modgrf]


def main():
    manifest = json.load(open(f'{OUT}/_manifest.json'))
    by_slug = {r['slug']: r for r in manifest}
    failures = 0

    for builder in TARGETS:
        mol, expect_formula, name, slug = builder()

        formula = CalcMolFormula(mol)
        if formula != expect_formula:
            print(f'{name:22s} FAIL  formula {formula} != published {expect_formula}')
            failures += 1
            continue

        mol3d = embed(mol)
        med = heavy_bond_median(mol3d)
        if not (1.2 <= med <= 1.8):
            print(f'{name:22s} FAIL  median heavy bond {med:.2f} A')
            failures += 1
            continue

        with open(f'{OUT}/{slug}.sdf', 'w') as fh:
            fh.write(Chem.MolToMolBlock(mol3d))

        row = by_slug.setdefault(slug, {'slug': slug, 'name': name})
        row.update({
            'name': name,
            'status': 'ok',
            'atoms': mol3d.GetNumAtoms(),
            'source': 'Published sequence · RDKit ETKDGv3 conformer',
            'formulaVerified': expect_formula,
        })
        row.pop('note', None)
        row.pop('cid', None)
        print(f'{name:22s} OK    {mol3d.GetNumAtoms():4d} atoms  {formula}  median bond {med:.2f} A')

    json.dump(list(by_slug.values()), open(f'{OUT}/_manifest.json', 'w'), indent=2)
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())

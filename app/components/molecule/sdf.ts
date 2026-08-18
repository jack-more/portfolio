// Minimal V2000 SDF/MOL parser + element table.
// Coordinates come from PubChem 3D conformers or RDKit ETKDG — never synthesized here.

export interface Atom {
  element: string;
  x: number;
  y: number;
  z: number;
}

export interface Bond {
  a: number;
  b: number;
  order: number;
}

export interface Molecule {
  title: string;
  atoms: Atom[];
  bonds: Bond[];
  /** Radius of the bounding sphere after centering, in angstroms. */
  extent: number;
  /** Longest bounding-box dimension in angstroms — the molecule's true size. */
  span: number;
}

/**
 * Element styling. Carbon reads as dark machined metal; heteroatoms carry the
 * gold so the parts that make a peptide a peptide are the parts that glow.
 */
export interface ElementStyle {
  color: string;
  /** van der Waals radius in angstroms, used for relative ball sizing. */
  radius: number;
  emissive: number;
  metalness: number;
  roughness: number;
}

const DEFAULT_STYLE: ElementStyle = {
  color: '#8a8f98',
  radius: 1.6,
  emissive: 0,
  metalness: 0.85,
  roughness: 0.4,
};

/**
 * Keyed to the SKO Compounds palette: #0a1f5c deep, #1447d6 bright.
 * Carbon is cool graphite so it sits in the navy field; heteroatoms carry the
 * brand blue. Copper stays copper — that one is a fact about the molecule.
 */
export const ELEMENTS: Record<string, ElementStyle> = {
  H: { color: '#aab4c8', radius: 1.1, emissive: 0, metalness: 0.05, roughness: 0.62 },
  C: { color: '#7d8aa6', radius: 1.7, emissive: 0, metalness: 0.05, roughness: 0.44 },
  N: { color: '#5f8bff', radius: 1.55, emissive: 0, metalness: 0.05, roughness: 0.34 },
  O: { color: '#b3d4ff', radius: 1.52, emissive: 0, metalness: 0.05, roughness: 0.3 },
  S: { color: '#5f9bf5', radius: 1.8, emissive: 0, metalness: 0.05, roughness: 0.36 },
  P: { color: '#3a63c8', radius: 1.8, emissive: 0, metalness: 0.05, roughness: 0.36 },
  CU: { color: '#f5954b', radius: 1.4, emissive: 0.05, metalness: 0.3, roughness: 0.26 },
  SE: { color: '#6d9fd4', radius: 1.9, emissive: 0, metalness: 0.05, roughness: 0.38 },
};

export function styleFor(element: string): ElementStyle {
  return ELEMENTS[element.toUpperCase()] ?? DEFAULT_STYLE;
}

/** Elements ranked for the HUD composition readout. */
export const HETERO = ['CU', 'S', 'P', 'N', 'O'];

export function parseSdf(text: string): Molecule {
  const lines = text.split(/\r?\n/);
  if (lines.length < 4) throw new Error('SDF too short to contain a counts line');

  const title = lines[0].trim();
  const counts = lines[3];

  // The counts line is fixed-width (3 chars per field), but PubChem pads with
  // spaces so whitespace splitting is equivalent and more forgiving.
  const atomCount = parseInt(counts.slice(0, 3), 10);
  const bondCount = parseInt(counts.slice(3, 6), 10);
  if (!Number.isFinite(atomCount) || !Number.isFinite(bondCount)) {
    throw new Error(`Unreadable counts line: "${counts}"`);
  }

  const atoms: Atom[] = [];
  for (let i = 0; i < atomCount; i++) {
    const l = lines[4 + i];
    if (!l) throw new Error(`Missing atom line ${i} of ${atomCount}`);
    atoms.push({
      x: parseFloat(l.slice(0, 10)),
      y: parseFloat(l.slice(10, 20)),
      z: parseFloat(l.slice(20, 30)),
      element: l.slice(31, 34).trim(),
    });
  }

  const bonds: Bond[] = [];
  for (let i = 0; i < bondCount; i++) {
    const l = lines[4 + atomCount + i];
    if (!l) throw new Error(`Missing bond line ${i} of ${bondCount}`);
    bonds.push({
      a: parseInt(l.slice(0, 3), 10) - 1, // SDF indices are 1-based
      b: parseInt(l.slice(3, 6), 10) - 1,
      order: parseInt(l.slice(6, 9), 10) || 1,
    });
  }

  // Center on the centroid so rotation happens about the molecule, not the origin.
  const n = atoms.length;
  let cx = 0, cy = 0, cz = 0;
  for (const a of atoms) { cx += a.x; cy += a.y; cz += a.z; }
  cx /= n; cy /= n; cz /= n;

  let extent = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const a of atoms) {
    a.x -= cx; a.y -= cy; a.z -= cz;
    extent = Math.max(extent, Math.hypot(a.x, a.y, a.z));
    if (a.x < minX) minX = a.x; if (a.x > maxX) maxX = a.x;
    if (a.y < minY) minY = a.y; if (a.y > maxY) maxY = a.y;
    if (a.z < minZ) minZ = a.z; if (a.z > maxZ) maxZ = a.z;
  }
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ);

  return { title, atoms, bonds, extent: extent || 1, span: span || 1 };
}

/** Standard atomic weights, enough to cover anything in the catalog. */
const MASS: Record<string, number> = {
  H: 1.008, C: 12.011, N: 14.007, O: 15.999, S: 32.06,
  P: 30.974, CU: 63.546, SE: 78.971, NA: 22.99, CL: 35.45,
};

/** Hill notation: carbon, hydrogen, then everything else alphabetically. */
export function formula(mol: Molecule): string {
  const tally = new Map<string, number>();
  for (const a of mol.atoms) {
    const e = a.element.toUpperCase();
    tally.set(e, (tally.get(e) ?? 0) + 1);
  }
  const rest = [...tally.keys()].filter((e) => e !== 'C' && e !== 'H').sort();
  const order = [...(tally.has('C') ? ['C'] : []), ...(tally.has('H') ? ['H'] : []), ...rest];
  return order
    .map((e) => {
      const n = tally.get(e)!;
      const sym = e.charAt(0) + e.slice(1).toLowerCase();
      return n > 1 ? `${sym}${n}` : sym;
    })
    .join('');
}

export function molecularWeight(mol: Molecule): number {
  return mol.atoms.reduce((sum, a) => sum + (MASS[a.element.toUpperCase()] ?? 0), 0);
}

/** Counts of each heteroatom, for the HUD. Hydrogen and carbon are the boring majority. */
export function composition(mol: Molecule): { element: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const a of mol.atoms) {
    const e = a.element.toUpperCase();
    tally.set(e, (tally.get(e) ?? 0) + 1);
  }
  return [...tally.entries()]
    .map(([element, count]) => ({ element, count }))
    .sort((p, q) => q.count - p.count);
}

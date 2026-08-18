/**
 * Catalog metadata for the structure viewer.
 *
 * The set of *available* structures is whatever `scripts/fetch-peptide-structures.py`
 * managed to resolve — it writes `/peptides/_manifest.json` alongside the SDF
 * files. This module supplies the catalog-facing information the manifest does
 * not know about (SKU, product name, caveats) and joins the two at runtime, so
 * re-running the fetch script is all that's needed to add a structure.
 */

export interface ManifestEntry {
  slug: string;
  name: string;
  cid?: string;
  atoms?: number;
  source?: string;
  status: 'ok' | 'missing';
}

/**
 * Where the Shop CTA points. skocompounds.com renders its catalog client-side
 * and exposes no per-product URLs — /products is the only linkable page — so
 * every compound deep-links to the catalog until product routes exist.
 */
export const SHOP_URL = 'https://skocompounds.com/products';

export interface PeptideEntry {
  /** Catalog SKU prefix this structure backs. */
  sku: string;
  /** Product name as it appears on the catalog. */
  name: string;
  /** File in /public/peptides. */
  file: string;
  /** Where the coordinates came from, shown in the HUD. */
  source: string;
  /** Any difference between the product and the rendered molecule. Shown verbatim. */
  caveat?: string;
}

/** slug -> catalog facts. Order here is the order shown in the panel. */
const CATALOG: { slug: string; sku: string; name: string; caveat?: string }[] = [
  { slug: 'retatrutide', sku: 'SKO-001', name: 'GLP-3 RT (Retatrutide)' },
  { slug: 'tirzepatide', sku: 'SKO-012', name: 'Tirzepatide' },
  { slug: 'cagrilintide', sku: 'SKO-038', name: 'Cagrilintide' },
  { slug: 'bpc157', sku: 'SKO-011', name: 'BPC-157' },
  {
    slug: 'tb500',
    sku: 'SKO-031',
    name: 'TB-500',
    caveat:
      'Acetylated 7-residue active fragment (C38H68N10O14), the form sold as TB-500 — not full 43-residue Thymosin β4.',
  },
  {
    slug: 'ghk',
    sku: 'SKO-006',
    name: 'GHK-Cu',
    caveat:
      'Rendered as the free GHK tripeptide. The Cu(II) complex has no published 3D conformer in PubChem.',
  },
  { slug: 'kpv', sku: 'SKO-016', name: 'KPV' },
  { slug: 'glutathione', sku: 'SKO-025', name: 'Glutathione' },
  { slug: 'nad', sku: 'SKO-017', name: 'NAD+' },
  { slug: 'motsc', sku: 'SKO-009', name: 'MOTS-c' },
  { slug: 'semax', sku: 'SKO-027', name: 'Semax' },
  { slug: 'selank', sku: 'SKO-028', name: 'Selank' },
  { slug: 'dsip', sku: 'SKO-033', name: 'DSIP' },
  { slug: 'kisspeptin10', sku: 'SKO-042', name: 'Kisspeptin-10' },
  { slug: 'ipamorelin', sku: 'SKO-032', name: 'Ipamorelin' },
  { slug: 'sermorelin', sku: 'SKO-035', name: 'Sermorelin' },
  { slug: 'tesamorelin', sku: 'SKO-005', name: 'Tesamorelin' },
  {
    slug: 'cjc1295',
    sku: 'SKO-010',
    name: 'CJC-1295 no DAC',
    caveat:
      'Built from the published sequence — PubChem has no record for Mod GRF (1-29); a search for "CJC-1295" returns the DAC variant. Formula verified against the published C152H252N44O42.',
  },
  { slug: 'thymosina1', sku: 'SKO-039', name: 'Thymosin Alpha-1' },
  { slug: 'ara290', sku: 'SKO-040', name: 'ARA-290' },
  { slug: 'aod9604', sku: 'SKO-041', name: 'AOD-9604' },
  { slug: 'ss31', sku: 'SKO-036', name: 'SS-31' },
  { slug: 'pt141', sku: 'SKO-043', name: 'PT-141' },
  { slug: 'mt1', sku: 'SKO-021', name: 'MT-1' },
  { slug: 'mt2', sku: 'SKO-022', name: 'MT-2' },
  { slug: 'amino1mq', sku: 'SKO-019', name: '5-Amino-1MQ' },
  {
    slug: 'igf1lr3',
    sku: 'SKO-020',
    name: 'IGF1-LR3',
    caveat:
      'Predicted fold (ESMFold v1), not an experimental structure. Confidence is high across the IGF-1 core (pLDDT 0.71) and low across the 13-residue N-terminal extension (0.50), which is expected to be disordered. All three native disulfides were predicted correctly at 1.88–1.99 Å.',
  },
  { slug: 'slupp332', sku: 'SKO-044', name: 'SLU-PP-332' },
];

/**
 * Join the catalog against the manifest. Only structures with real coordinates
 * on disk are returned — a product with no resolved structure is omitted rather
 * than shown with a placeholder.
 */
export function buildLibrary(manifest: ManifestEntry[]): PeptideEntry[] {
  const bySlug = new Map(manifest.filter((m) => m.status === 'ok').map((m) => [m.slug, m]));

  return CATALOG.flatMap((c) => {
    const m = bySlug.get(c.slug);
    if (!m?.source) return []; // no verified coordinates for this product yet
    const source = m.source;
    return [{
      sku: c.sku,
      name: c.name,
      file: `${c.slug}.sdf`,
      source,
      caveat: c.caveat,
    }];
  });
}

/** Shown until the manifest loads, so the viewer is never empty on first paint. */
export const FALLBACK: PeptideEntry[] = buildLibrary([]);

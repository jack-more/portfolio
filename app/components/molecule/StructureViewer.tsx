'use client';

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Molecule, parseSdf, formula, molecularWeight, composition, styleFor } from './sdf';
import { buildLibrary, FALLBACK, ManifestEntry, PeptideEntry, SHOP_URL } from './registry';
import type { ScaleInfo } from './MoleculeScene';
import styles from './StructureViewer.module.css';

/**
 * Code-split the WebGL renderer. React.lazy rather than next/dynamic so this
 * module drops into any React app (Vite, CRA, Next) without changes.
 *
 * It never renders during SSR regardless: it only mounts once a structure has
 * been fetched and parsed, which happens in a client effect.
 */
const MoleculeScene = lazy(() => import('./MoleculeScene'));

export default function StructureViewer() {
  // The library is empty until the manifest loads — every structure is
  // manifest-tracked, so there is no static fallback set to show first.
  const [library, setLibrary] = useState<PeptideEntry[]>(FALLBACK);
  const [entry, setEntry] = useState<PeptideEntry | null>(FALLBACK[0] ?? null);
  const [molecule, setMolecule] = useState<Molecule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scale, setScale] = useState<ScaleInfo | null>(null);
  const [spin, setSpin] = useState(true);
  // Hydrogens roughly double the atom count and hide the backbone. Off by default.
  const [showHydrogen, setShowHydrogen] = useState(false);
  // Off by default: fit-to-frame is the readable default, true scale is the
  // comparison mode.
  const [lockScale, setLockScale] = useState(false);
  const requestId = useRef(0);
  const railRef = useRef<HTMLDivElement>(null);
  const activeChipRef = useRef<HTMLButtonElement>(null);

  // Keep the selected compound in view. The rail scrolls, so a selection made
  // by keyboard — or one that starts off-screen — would otherwise be invisible.
  useEffect(() => {
    const rail = railRef.current;
    const chip = activeChipRef.current;
    if (!rail || !chip) return;
    const r = rail.getBoundingClientRect();
    const c = chip.getBoundingClientRect();
    if (c.left < r.left + 20 || c.right > r.right - 40) {
      rail.scrollTo({
        left: chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [entry]);

  // The available structures are whatever the generator resolved. Reading the
  // manifest at runtime means adding a structure is a re-run of that script,
  // not an edit here.
  useEffect(() => {
    let cancelled = false;
    fetch('/peptides/_manifest.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((m: ManifestEntry[]) => {
        if (cancelled) return;
        const lib = buildLibrary(m);
        if (!lib.length) return;
        setLibrary(lib);
        setEntry((cur) => cur ?? lib[0]);
      })
      .catch(() => {
        /* keep FALLBACK — viewer still works with whatever is statically known */
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!entry) return;
    const id = ++requestId.current;
    // Deliberately not clearing `molecule` here: doing so unmounts the canvas,
    // and every remount allocates a fresh WebGL context. Browsers cap live
    // contexts, so switching structures repeatedly would kill the renderer.
    setLoading(true);
    setError(null);

    fetch(`/peptides/${entry.file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} fetching ${entry.file}`);
        return r.text();
      })
      .then((text) => {
        if (requestId.current !== id) return; // a newer selection won
        setMolecule(parseSdf(text));
        setLoading(false);
      })
      .catch((e: Error) => {
        if (requestId.current !== id) return;
        setError(e.message);
        setLoading(false);
      });
  }, [entry]);

  const stats = useMemo(() => {
    if (!molecule) return null;
    return {
      formula: formula(molecule),
      weight: molecularWeight(molecule),
      atoms: molecule.atoms.length,
      bonds: molecule.bonds.length,
      composition: composition(molecule).filter((c) => c.element !== 'H' && c.element !== 'C'),
    };
  }, [molecule]);

  const hoveredAtom = hovered != null && molecule ? molecule.atoms[hovered] : null;

  /**
   * Pick a round number of angstroms whose on-screen bar lands near 90px, so
   * the bar reads as a measurement rather than an arbitrary line.
   */
  const scaleBar = useMemo(() => {
    if (!scale?.pxPerAngstrom) return null;
    const steps = [1, 2, 5, 10, 20, 50, 100, 200, 500];
    const target = 90 / scale.pxPerAngstrom;
    const angstroms = steps.find((s) => s >= target) ?? steps[steps.length - 1];
    return { angstroms, px: Math.round(angstroms * scale.pxPerAngstrom) };
  }, [scale]);

  return (
    <section className={styles.banner} aria-label="Compound structure explorer">
      {/* ─────────── Stage ─────────── */}
      <div className={styles.stage}>
        <span className={`${styles.bracket} ${styles.tl}`} />
        <span className={`${styles.bracket} ${styles.tr}`} />
        <span className={`${styles.bracket} ${styles.bl}`} />
        <span className={`${styles.bracket} ${styles.br}`} />
        <div className={styles.orbit} />

        <div className={styles.canvas}>
          {error && <div className={styles.error}>STRUCTURE_LOAD_FAIL — {error}</div>}
          {molecule && !error && (
            <Suspense
              fallback={<div className={styles.loading}>INITIALIZING_RENDERER</div>}
            >
              <MoleculeScene
                molecule={molecule}
                onHoverAtom={setHovered}
                onScale={setScale}
                spin={spin}
                showHydrogen={showHydrogen}
                lockScale={lockScale}
              />
            </Suspense>
          )}
          {loading && !error && <div className={styles.loading}>DECODING_STRUCTURE</div>}
        </div>

        <div className={styles.vignette} />
        <div className={styles.grain} />

        {/* Overlay: identity left, action right */}
        <div className={styles.stageTop}>
          <div className={styles.identity}>
            <h2 className={styles.name}>{entry?.name ?? '—'}</h2>
            <span className={styles.sku}>{entry?.sku ?? ''}</span>
          </div>

          <a
            className={styles.shop}
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            SHOP{entry ? ` ${entry.name.toUpperCase()}` : ''}
            <span aria-hidden="true"> →</span>
          </a>
        </div>

        <div className={styles.stageBottom}>
          <span className={styles.mono}>{stats ? stats.formula : '—'}</span>
          <span className={styles.readouts}>
            {stats && (
              <>
                <span>{stats.atoms} atoms</span>
                <span>{stats.bonds} bonds</span>
                {scale && <span>span {scale.span.toFixed(1)} Å</span>}
                <span>MW {stats.weight.toFixed(2)}</span>
              </>
            )}
          </span>
        </div>

        {scaleBar && (
          <div className={styles.scale}>
            <div className={styles.scaleBar} style={{ width: `${scaleBar.px}px` }} />
            <span className={styles.scaleLabel}>{scaleBar.angstroms} Å</span>
          </div>
        )}

        {hoveredAtom && (
          <div className={styles.probe}>
            <span
              className={styles.probeSwatch}
              style={{ background: styleFor(hoveredAtom.element).color }}
            />
            {hoveredAtom.element.toUpperCase()}
            <span className={styles.probeCoord}>
              {hoveredAtom.x.toFixed(2)} · {hoveredAtom.y.toFixed(2)} · {hoveredAtom.z.toFixed(2)} Å
            </span>
          </div>
        )}
      </div>

      {/* ─────────── Controls ─────────── */}
      <div className={styles.controls}>
        <div className={styles.toggles}>
          <button
            className={`${styles.toggle} ${spin ? styles.toggleOn : ''}`}
            onClick={() => setSpin((s) => !s)}
          >
            ROTATION_{spin ? 'AUTO' : 'MANUAL'}
          </button>
          <button
            className={`${styles.toggle} ${showHydrogen ? styles.toggleOn : ''}`}
            onClick={() => setShowHydrogen((h) => !h)}
          >
            HYDROGEN_{showHydrogen ? 'ON' : 'OFF'}
          </button>
          <button
            className={`${styles.toggle} ${lockScale ? styles.toggleOn : ''}`}
            onClick={() => setLockScale((s) => !s)}
            title="True scale holds the camera fixed so compounds are directly comparable"
          >
            SCALE_{lockScale ? 'TRUE' : 'FIT'}
          </button>
        </div>

        <div className={styles.provenance}>
          <span className={styles.provenanceLabel}>COORDINATE_SOURCE</span>
          <span className={styles.provenanceValue}>{entry?.source ?? '—'}</span>
        </div>
      </div>

      {entry?.caveat && <p className={styles.caveat}>{entry.caveat}</p>}

      {/* ─────────── Compound grid ─────────── */}
      <div className={styles.railLabel}>
        <span>COMPOUND_LIBRARY</span>
        <span className={styles.railCount}>{library.length} structures</span>
      </div>

      <div className={styles.rail} ref={railRef} role="listbox" aria-label="Compounds">
        {library.map((p) => (
          <button
            key={p.sku}
            role="option"
            aria-selected={p.sku === entry?.sku}
            ref={p.sku === entry?.sku ? activeChipRef : undefined}
            className={`${styles.chip} ${p.sku === entry?.sku ? styles.chipActive : ''}`}
            onClick={() => setEntry(p)}
          >
            <span className={styles.chipName}>{p.name}</span>
            <span className={styles.chipSku}>{p.sku}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

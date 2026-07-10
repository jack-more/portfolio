"use client";

import { useEffect, useRef } from "react";

const FOCUS_SELECTOR = "a, button, [data-focus]";
const PAD = 4;

export default function GameEffects() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: (() => void)[] = [];

    /* ---- Focus bracket cursor (desktop pointers only) ---- */
    const cursor = cursorRef.current;
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
      let activeEl: Element | null = null;
      let raf = 0;

      const apply = (r: DOMRect, pad: number) => {
        cursor.style.transform = `translate(${r.left - pad}px, ${r.top - pad}px)`;
        cursor.style.width = `${r.width + pad * 2}px`;
        cursor.style.height = `${r.height + pad * 2}px`;
      };

      // Re-read the rect every frame so the brackets chase elements that
      // move under the cursor (dragged cards, scrolling).
      const track = () => {
        if (!activeEl) return;
        const r = activeEl.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) {
          hide();
          return;
        }
        apply(r, PAD);
        raf = requestAnimationFrame(track);
      };

      const show = (el: Element) => {
        const fresh = !activeEl;
        activeEl = el;
        cancelAnimationFrame(raf);
        if (fresh) {
          // Appear inflated around the target and snap tight, instead of
          // flying in from the previous position.
          cursor.classList.add("fc-snap");
          apply(el.getBoundingClientRect(), PAD + 10);
          void cursor.offsetWidth;
          cursor.classList.remove("fc-snap");
        }
        cursor.dataset.visible = "true";
        raf = requestAnimationFrame(track);
      };

      const hide = () => {
        activeEl = null;
        cancelAnimationFrame(raf);
        delete cursor.dataset.visible;
      };

      const onOver = (e: MouseEvent) => {
        const el = (e.target as Element | null)?.closest?.(FOCUS_SELECTOR);
        if (el) show(el);
        else if (activeEl) hide();
      };
      const onLeave = () => hide();

      document.addEventListener("mouseover", onOver);
      document.documentElement.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        document.removeEventListener("mouseover", onOver);
        document.documentElement.removeEventListener("mouseleave", onLeave);
      });
    }

    /* ---- Tap burst ---- */
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const fx = document.createElement("div");
      fx.className = "tap-fx";
      fx.style.left = `${e.clientX}px`;
      fx.style.top = `${e.clientY}px`;
      const ring = document.createElement("span");
      ring.className = "tap-ring";
      fx.appendChild(ring);
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement("span");
        spark.className = "tap-spark";
        spark.style.setProperty("--a", `${i * 60 + 15}deg`);
        fx.appendChild(spark);
      }
      document.body.appendChild(fx);
      setTimeout(() => fx.remove(), 600);
    };
    window.addEventListener("pointerdown", onDown);
    cleanups.push(() => window.removeEventListener("pointerdown", onDown));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={cursorRef} className="focus-cursor" aria-hidden="true">
      <span className="fc-corner fc-tl" />
      <span className="fc-corner fc-tr" />
      <span className="fc-corner fc-bl" />
      <span className="fc-corner fc-br" />
    </div>
  );
}

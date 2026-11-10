"use client";
import { useEffect } from "react";
import { hasFinePointer } from "@/lib/env";

/**
 * Cristal líquido:
 * - el reflejo de cada panel .glass sigue al puntero (variables --gx / --gy);
 * - el filtro SVG #liquid-glass deforma lo que hay detrás (refracción) en Chromium.
 */
export default function GlassFx() {
  useEffect(() => {
    if (!hasFinePointer()) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const update = () => {
      raf = 0;
      if (!last) return;
      const t = (last.target as Element | null)?.closest?.(".glass, .btn--ghost") as HTMLElement | null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--gx", `${(((last.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      t.style.setProperty("--gy", `${(((last.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <filter id="liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

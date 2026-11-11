"use client";
import { useEffect } from "react";
import { hasFinePointer } from "@/lib/env";
import { whenIdle } from "@/lib/defer";
import { watchPointer } from "@/lib/pointer";

/**
 * Cristal líquido:
 * - el reflejo de cada panel .glass sigue al puntero (variables --gx / --gy);
 * - el filtro SVG #liquid-glass deforma lo que hay detrás (refracción) en Chromium.
 */
export default function GlassFx() {
  useEffect(() => whenIdle(() => document.documentElement.classList.add("grain-on")), []);

  useEffect(() => {
    if (!hasFinePointer()) return;
    // el panel bajo el ratón se mide junto con el resto de efectos, una vez por fotograma
    return watchPointer(
      (e) => (e.target as Element | null)?.closest?.(".glass, .btn--ghost") ?? null,
      (e, r) => {
        if (!r) return;
        const t = (e.target as Element).closest(".glass, .btn--ghost") as HTMLElement;
        t.style.setProperty("--gx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        t.style.setProperty("--gy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }
    );
  }, []);

  // Mientras hay scroll, cristal sin refracción (ver .is-scrolling en globals.css)
  useEffect(() => {
    if (typeof CSS === "undefined" || !CSS.supports("backdrop-filter", "url(#x)")) return;
    const html = document.documentElement;
    let stop = 0;
    const onScroll = () => {
      if (!stop) html.classList.add("is-scrolling");
      else window.clearTimeout(stop);
      stop = window.setTimeout(() => {
        stop = 0;
        html.classList.remove("is-scrolling");
      }, 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(stop);
      html.classList.remove("is-scrolling");
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

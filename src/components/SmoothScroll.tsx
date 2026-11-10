"use client";
import { useEffect } from "react";
import type Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/env";
import { loadMotion, motionNow, motionSettled, type Motion } from "@/lib/motion";
import { whenIdle } from "@/lib/defer";
import { setLenis, scrollToHash } from "@/lib/scroll";

/**
 * Scroll suave con Lenis sincronizado con el ticker de GSAP,
 * y gestión de enlaces internos (#ancla) para toda la web.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    let m: Motion | null = null;
    let cancelled = false;

    // Lenis + GSAP se cargan aparte, cuando la primera pantalla ya está pintada.
    const cancelBoot = whenIdle(() => {
      if (prefersReducedMotion()) return;
      Promise.all([import("lenis"), loadMotion()]).then(([{ default: LenisCtor }, motion]) => {
        if (cancelled) return;
        m = motion;
        lenis = new LenisCtor({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
        setLenis(lenis);
        lenis.on("scroll", motion.ScrollTrigger.update);
        tick = (t: number) => lenis?.raf(t * 1000);
        motion.gsap.ticker.add(tick);
        motion.gsap.ticker.lagSmoothing(0);
      });
    });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      const hash = url.hash;
      if (!hash || hash === "#") return;
      if (scrollToHash(hash)) e.preventDefault();
    };
    document.addEventListener("click", onClick);

    // Si se entra con un #ancla en la URL, esperar al layout de ScrollTrigger.
    let cancelHash = () => {};
    if (location.hash) {
      const h = location.hash;
      // esperar a que las secciones fijadas hayan calculado su espacio
      let off = false;
      cancelHash = () => {
        off = true;
      };
      motionSettled.then(() => {
        if (off) return;
        requestAnimationFrame(() => {
          scrollToHash(h, true);
          // segunda pasada por si alguna sección cambió de altura al llegar
          window.setTimeout(() => !off && motionNow() && scrollToHash(h, true), 500);
        });
      });
    }

    return () => {
      cancelled = true;
      cancelBoot();
      cancelHash();
      document.removeEventListener("click", onClick);
      if (tick && m) m.gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}

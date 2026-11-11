"use client";
import type Lenis from "lenis";

/** Instancia global de Lenis (null con movimiento reducido o antes de montar). */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Desplaza hasta un ancla respetando Lenis y el movimiento reducido. */
export function scrollToHash(hash: string, immediate = false) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = id ? document.getElementById(id) : document.body;
  if (!el) return false;
  if (lenis) {
    lenis.scrollTo(el, immediate ? { offset: 0, immediate: true, force: true } : { offset: 0, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
  // Mover el foco al destino para teclado y lectores de pantalla.
  if (el !== document.body) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
  history.replaceState(null, "", `#${id}`);
  return true;
}

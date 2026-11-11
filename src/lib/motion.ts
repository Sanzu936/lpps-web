"use client";
import { useEffect, type RefObject } from "react";
import { whenIdle } from "./defer";

export type Motion = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

/**
 * GSAP y ScrollTrigger se cargan aparte, después del primer pintado: la primera pantalla
 * no depende de ellos (su secuencia de montaje es solo CSS).
 */
let promise: Promise<Motion> | null = null;
let loaded: Motion | null = null;

export function loadMotion(): Promise<Motion> {
  if (!promise) {
    promise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      loaded = { gsap, ScrollTrigger };
      return loaded;
    });
  }
  return promise;
}

/** Librerías ya cargadas (o null si aún no). Útil dentro de manejadores de eventos. */
export const motionNow = () => loaded;

let refreshQueued = false;
let pending = 0;
let settle: () => void = () => {};
/**
 * Se resuelve cuando todas las secciones han preparado sus animaciones y ScrollTrigger
 * ha recalculado posiciones (útil para saltar a un #ancla al entrar).
 */
export const motionSettled: Promise<void> = new Promise((r) => {
  settle = r;
  if (typeof window !== "undefined") window.setTimeout(r, 6000);
});

/** Un único ScrollTrigger.refresh() cuando termina la tanda de inicializaciones. */
function scheduleRefresh(m: Motion) {
  if (refreshQueued || pending > 0) return;
  refreshQueued = true;
  whenIdle(() => {
    refreshQueued = false;
    if (pending > 0) return;
    m.ScrollTrigger.refresh();
    settle();
  });
}

type Setup = (m: Motion) => void | (() => void);

/**
 * Prepara animaciones de una sección. Se ejecuta en diferido (o en cuanto carga GSAP si
 * `immediate`), dentro de un gsap.context que se revierte al desmontar.
 */
export function useMotion(setup: Setup, scope?: RefObject<Element | null>, opts: { immediate?: boolean } = {}) {
  useEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let cleanup: void | (() => void);
    if (!opts.immediate) pending++;
    let counted = !opts.immediate;
    const done = () => {
      if (counted) {
        counted = false;
        pending--;
      }
    };
    const run = () =>
      loadMotion().then((m) => {
        if (cancelled) return;
        ctx = m.gsap.context(() => {
          cleanup = setup(m);
        }, scope?.current ?? undefined);
        done();
        if (!opts.immediate) scheduleRefresh(m);
      });
    const cancel = opts.immediate ? (run(), () => {}) : whenIdle(run);
    return () => {
      cancelled = true;
      done();
      cancel();
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // la preparación se define una vez por montaje
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TileField = dynamic(() => import("./TileField"), { ssr: false });

type Gpu = "none" | "software" | "hardware";

/** Detecta si hay WebGL y si lo acelera una GPU real o se emula por software. */
function detectGpu(): Gpu {
  try {
    const c = document.createElement("canvas");
    const fast = c.getContext("webgl", { failIfMajorPerformanceCaveat: true }) as WebGLRenderingContext | null;
    const gl = fast || (c.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return "none";
    let soft = !fast;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const r = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
      if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(r)) soft = true;
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return soft ? "software" : "hardware";
  } catch {
    return "none";
  }
}

/**
 * Carga diferida del 3D: la primera pantalla se pinta e interactúa sin esperar a WebGL.
 * El lienzo se prepara al mover el ratón o pulsar una tecla, o en el primer momento libre
 * unos segundos después de la carga (en móvil, siempre así), y nunca con un scroll en curso
 * ni con el hero fuera de pantalla (hasta entonces se ve el póster, idéntico en reposo).
 * - Con GPU: anima de continuo mientras el hero está a la vista.
 * - Sin GPU (WebGL por software): versión ligera que solo renderiza mientras hay interacción.
 */
export default function HeroCanvas() {
  const [mode, setMode] = useState<null | "full" | "lite">(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    // Ni scroll ni rueda ni toque: arrancar WebGL en pleno scroll daría un tirón justo en la transición.
    const events = ["pointermove", "pointerdown", "keydown"] as const;
    const detach = () => {
      events.forEach((ev) => window.removeEventListener(ev, onGesture));
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      window.clearTimeout(settle);
    };
    // Crear un contexto WebGL puede costar cientos de ms sin GPU: se hace al mover el ratón
    // o cuando el navegador queda libre unos segundos después de la carga, nunca durante ella.
    const boot = () => {
      detach();
      if (cancelled) return;
      const gpu = detectGpu();
      if (gpu === "none") return;
      setMode(gpu === "hardware" ? "full" : "lite");
    };
    // Preparar WebGL bloquea el hilo principal un buen rato (sobre todo en móvil): solo se hace
    // con el hero a la vista y sin scroll en curso. Si no, se espera a que el scroll se pare.
    let lastScroll = 0;
    let settle = 0;
    const onScroll = () => {
      lastScroll = performance.now();
      window.clearTimeout(settle);
      settle = window.setTimeout(tryBoot, 800);
    };
    const quiet = () => performance.now() - lastScroll > 700 && window.scrollY < window.innerHeight * 0.6;
    function tryBoot() {
      if (cancelled) return;
      if (!quiet()) return; // el próximo final de scroll lo vuelve a intentar
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      const go = () => (quiet() ? boot() : undefined);
      if (ric) ric(go, { timeout: 1500 });
      else go();
    }
    function onGesture(e: Event) {
      if ("pointerType" in e && (e as PointerEvent).pointerType === "touch") return; // un toque suele ser el inicio de un scroll
      tryBoot();
    }
    const arm = () => {
      if (cancelled) return;
      events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
      window.addEventListener("scroll", onScroll, { passive: true });
      timer = window.setTimeout(tryBoot, 4000);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", arm);
      detach();
    };
  }, []);

  return (
    <div className="hero__canvas" data-ready={ready ? "true" : "false"} aria-hidden="true">
      {mode ? <TileField lite={mode === "lite"} onReady={() => setReady(true)} /> : null}
    </div>
  );
}

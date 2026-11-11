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
 * unos segundos después de la carga (en móvil, siempre así).
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
      window.clearTimeout(timer);
    };
    // Crear un contexto WebGL puede costar cientos de ms sin GPU: se hace al mover el ratón
    // o cuando el navegador queda libre unos segundos después de la carga, nunca durante ella.
    const boot = (interacted: boolean) => {
      detach();
      if (cancelled) return;
      const gpu = detectGpu();
      if (gpu === "none") return;
      setMode(gpu === "hardware" ? "full" : "lite");
      void interacted;
    };
    function onGesture(e: Event) {
      if ("pointerType" in e && (e as PointerEvent).pointerType === "touch") return; // un toque suele ser el inicio de un scroll
      boot(true);
    }
    const arm = () => {
      if (cancelled) return;
      events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
      timer = window.setTimeout(() => {
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        if (ric) ric(() => boot(false), { timeout: 2000 });
        else boot(false);
      }, 4000);
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

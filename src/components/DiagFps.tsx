"use client";
import { useEffect, useState } from "react";

/** Contador de fotogramas del modo diagnóstico (?fps). Muestra FPS y el peor fotograma del último segundo. */
export default function DiagFps() {
  const [txt, setTxt] = useState<string | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (!q.has("fps")) return;
    const off = q.get("sin");
    let raf = 0;
    let frames = 0;
    let worst = 0;
    let last = performance.now();
    let start = last;
    const tick = (now: number) => {
      const d = now - last;
      last = now;
      frames++;
      if (d > worst) worst = d;
      if (now - start >= 1000) {
        setTxt(`${Math.round((frames * 1000) / (now - start))} fps · peor ${Math.round(worst)} ms${off ? ` · sin ${off}` : ""}`);
        frames = 0;
        worst = 0;
        start = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!txt) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 8,
        bottom: 8,
        zIndex: 2147483647,
        padding: "6px 10px",
        borderRadius: 8,
        background: "rgba(0,0,0,0.85)",
        color: "#7CFC9A",
        font: "600 13px/1.2 ui-monospace, monospace",
        pointerEvents: "none",
      }}
    >
      {txt}
    </div>
  );
}

"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/env";
import { loadMotion } from "@/lib/motion";
import { watchPointer } from "@/lib/pointer";

/**
 * Efecto magnético: cuando el cursor se acerca, el hijo se desplaza hacia él
 * y su etiqueta se mueve un poco más (paralaje interno). Solo ratón/trackpad.
 */
export default function Magnetic({
  children,
  radius = 140,
  strength = 0.42,
  maxShift = 14,
}: {
  children: ReactNode;
  radius?: number;
  strength?: number;
  /** desplazamiento máximo en px */
  maxShift?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || !hasFinePointer() || prefersReducedMotion()) return;
    const target = host.firstElementChild as HTMLElement | null;
    if (!target) return;
    let cancelled = false;
    let off = () => {};
    loadMotion().then(({ gsap }) => {
      if (cancelled) return;
    const inner = target.querySelector<HTMLElement>(".btn__label");
    const xTo = gsap.quickTo(target, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
    const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" }) : null;
    const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" }) : null;
    let active = false;

    const onMove = (e: PointerEvent, r: DOMRect | null) => {
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = radius + Math.max(r.width, r.height) / 2;
      const dist = Math.hypot(dx, dy);
      if (dist < reach) {
        active = true;
        const pull = 1 - dist / reach;
        // desplazamiento acotado: se pega al cursor sin invadir lo que tiene al lado
        const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
        xTo(clamp(dx * strength * (0.5 + pull), maxShift));
        yTo(clamp(dy * strength * (0.5 + pull), maxShift * 0.7));
        ixTo?.(clamp(dx * 0.18, maxShift * 0.5));
        iyTo?.(clamp(dy * 0.18, maxShift * 0.4));
        target.style.setProperty("--mag", pull.toFixed(3));
      } else release();
    };
    function release() {
      if (!active) return;
      active = false;
      xTo(0);
      yTo(0);
      ixTo?.(0);
      iyTo?.(0);
      target!.style.setProperty("--mag", "0");
    }
    // un solo listener compartido, una pasada por fotograma y solo con el botón en pantalla
    off = watchPointer(host, onMove, { onHide: release });
    });
    return () => {
      cancelled = true;
      off();
    };
  }, [radius, strength, maxShift]);

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}

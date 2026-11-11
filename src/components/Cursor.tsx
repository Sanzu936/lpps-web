"use client";
import { useEffect, useRef } from "react";
import { sin } from "@/lib/diag";
import { hasFinePointer, prefersReducedMotion } from "@/lib/env";
import { loadMotion } from "@/lib/motion";

/**
 * Cursor propio: punto + anillo con inercia. Sobre enlaces crece; sobre elementos con
 * data-cursor="Texto" muestra una etiqueta. Solo con ratón/trackpad.
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || !root.current || sin("cursor")) return;
    let off = () => {};
    let cancelled = false;
    loadMotion().then(({ gsap }) => {
      if (cancelled) return;
      off = setup(gsap);
    });
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  function setup(gsap: Awaited<ReturnType<typeof loadMotion>>["gsap"]) {
    const el = root.current!;
    const dot = el.querySelector<HTMLElement>(".cursor__dot")!;
    const ring = el.querySelector<HTMLElement>(".cursor__ring")!;
    const reduce = prefersReducedMotion();
    document.documentElement.classList.add("has-cursor");
    el.dataset.hidden = "true";

    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: reduce ? 0.01 : 0.38, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: reduce ? 0.01 : 0.38, ease: "power3" });

    let current: Element | null = null;
    let lastX = -1;
    let lastY = -1;
    const SEL = "[data-cursor], a, button, [role='slider'], summary, label";
    const setTarget = (target: Element | null) => {
      const t = target?.closest?.(SEL) ?? null;
      if (t === current) return;
      current = t;
      if (!t) {
        el.dataset.state = "";
        return;
      }
      const text = t.getAttribute("data-cursor");
      if (text) {
        label.current!.textContent = text;
        el.dataset.state = "label";
      } else {
        el.dataset.state = "link";
      }
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.dataset.hidden = "false";
      lastX = e.clientX;
      lastY = e.clientY;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      setTarget(e.target as Element | null);
    };
    // Al hacer scroll sin mover el ratón, el contenido cambia bajo el cursor:
    // se vuelve a mirar qué hay debajo para que la etiqueta no se quede pegada.
    let scrollRaf = 0;
    const onScroll = () => {
      if (lastX < 0 || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        setTarget(document.elementFromPoint(lastX, lastY));
      });
    };
    const leave = () => (el.dataset.hidden = "true");
    const down = () => gsap.to(ring, { scale: 0.82, duration: 0.15, ease: "power2.out" });
    const up = () => gsap.to(ring, { scale: 1, duration: 0.35, ease: "back.out(2)" });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor__ring">
        <span className="cursor__label" ref={label} />
      </div>
      <div className="cursor__dot" />
    </div>
  );
}

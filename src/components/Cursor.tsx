"use client";
import { useEffect, useRef } from "react";
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
    if (!hasFinePointer() || !root.current) return;
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
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.dataset.hidden = "false";
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='slider'], summary, label") ?? null;
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
    const leave = () => (el.dataset.hidden = "true");
    const down = () => gsap.to(ring, { scale: 0.82, duration: 0.15, ease: "power2.out" });
    const up = () => gsap.to(ring, { scale: 1, duration: 0.35, ease: "back.out(2)" });

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
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

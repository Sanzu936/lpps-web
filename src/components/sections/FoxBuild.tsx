"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";
import fox from "../fox-paths.json";

/**
 * El zorro de LPPS se monta como una web: primero el contorno en líneas celestes,
 * luego el color por capas. Al pasar el ratón, se inclina hacia el cursor.
 */
export default function FoxBuild() {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = ref.current!;
        const lines = root.querySelectorAll<SVGPathElement>(".fx-line");
        const fills = root.querySelectorAll<SVGPathElement>(".fx-fill");
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(fills, { opacity: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 78%", once: true } })
          .to(lines, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.18 })
          .to(fills, { opacity: 1, duration: 0.7, stagger: 0.16, ease: "power2.out" }, "-=0.5")
          .to(lines, { opacity: 0.25, duration: 0.6 }, "-=0.3");

        const svg = root.querySelector("svg")!;
        const rx = gsap.quickTo(svg, "rotationY", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(svg, "rotationX", { duration: 0.8, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
          const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
          rx(dx * 28);
          ry(-dy * 18);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    ref
  );

  return (
    <div className="fox-build" ref={ref} aria-hidden="true" style={{ perspective: "900px" }}>
      <span className="fox-build__halo" />
      <svg viewBox={fox.viewBox}>
        <path className="fx-fill" d={fox.white} fill="#edf2fa" />
        <path className="fx-fill" d={fox.navy} fill="#20508e" />
        <path className="fx-fill" d={fox.sky} fill="#5bc4e2" />
        <path className="fx-line" d={fox.navy} pathLength={1} />
        <path className="fx-line" d={fox.sky} pathLength={1} />
        <path className="fx-line" d={fox.white} pathLength={1} />
      </svg>
    </div>
  );
}

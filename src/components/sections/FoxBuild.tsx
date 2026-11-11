"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";
import { watchPointer } from "@/lib/pointer";
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
        const svgEl = root.querySelector("svg")!;
        // Las líneas solo hacen falta para la animación: se crean aquí, no en el HTML.
        const lines = [fox.navy, fox.sky, fox.white].map((d) => {
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("class", "fx-line");
          p.setAttribute("d", d);
          p.setAttribute("pathLength", "1");
          svgEl.appendChild(p);
          return p;
        });
        const fills = root.querySelectorAll<SVGElement>(".fx-fill");
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
        const onMove = (e: PointerEvent, r: DOMRect | null) => {
          if (!r) return;
          const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
          const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
          rx(dx * 28);
          ry(-dy * 18);
        };
        const stop = watchPointer(root, onMove);
        return () => {
          stop();
          lines.forEach((l) => l.remove());
        };
      });
    },
    ref
  );

  return (
    <div className="fox-build" ref={ref} aria-hidden="true" style={{ perspective: "900px" }}>
      <span className="fox-build__halo" />
      <svg viewBox={fox.viewBox}>
        <use className="fx-fill" href="#fox-w" fill="#edf2fa" />
        <use className="fx-fill" href="#fox-n" fill="#20508e" />
        <use className="fx-fill" href="#fox-s" fill="#5bc4e2" />
      </svg>
    </div>
  );
}

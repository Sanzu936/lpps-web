"use client";
import { useId, useRef } from "react";
import { useMotion } from "@/lib/motion";
import { hasFinePointer } from "@/lib/env";

/**
 * Nombre gigante en tipografía variable (Anybody): cada letra se ensancha y engorda
 * según lo cerca que esté el cursor; en táctil, una ola recorre el nombre con el scroll.
 * Se dibuja en SVG para que el cambio de anchura no desplace el resto de la página.
 */
export default function ElasticName({ name, accent }: { name: string; accent?: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const gid = useId().replace(/:/g, "");
  const letters = Array.from(name);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const el = svg.current!;
      const spans = Array.from(el.querySelectorAll<SVGTSpanElement>("tspan"));
      const n = spans.length;
      const state = spans.map(() => ({ w: 78, g: 260 }));
      const apply = () =>
        spans.forEach((s, i) => {
          s.style.fontVariationSettings = `"wdth" ${state[i].w.toFixed(1)}, "wght" ${state[i].g.toFixed(0)}`;
        });
      apply();

      const setFocus = (pos: number, amount: number) => {
        spans.forEach((_, i) => {
          const c = (i + 0.5) / n;
          const f = Math.exp(-Math.pow((c - pos) * 3.2, 2)) * amount;
          gsap.to(state[i], {
            w: 78 + f * 70,
            g: 260 + f * 420,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
            onUpdate: apply,
          });
        });
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (hasFinePointer()) {
          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const inY = e.clientY > r.top - 140 && e.clientY < r.bottom + 140;
            if (!inY) return setFocus(0.5, 0);
            const textW = (el.querySelector("text") as SVGTextElement).getComputedTextLength() * (r.width / 1000);
            setFocus((e.clientX - r.left) / Math.max(textW, 1), 1);
          };
          const onLeave = () => setFocus(0.5, 0);
          window.addEventListener("pointermove", onMove, { passive: true });
          document.addEventListener("pointerleave", onLeave);
          return () => {
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerleave", onLeave);
          };
        }
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 25%",
          onUpdate: (self) => setFocus(-0.15 + self.progress * 1.3, 1),
          onLeave: () => setFocus(0.5, 0),
          onLeaveBack: () => setFocus(0.5, 0),
        });
        return () => st.kill();
      });
    },
    svg
  );

  return (
    <svg ref={svg} className={`elastic ${accent ? "elastic--accent" : ""}`} viewBox="0 0 1000 250" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`chrome-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor={accent ? "#bfe9f7" : "#dfe6f2"} />
          <stop offset="0.5" stopColor={accent ? "#5bc4e2" : "#8794b0"} />
          <stop offset="0.62" stopColor={accent ? "#9fdcef" : "#e9eef7"} />
          <stop offset="1" stopColor={accent ? "#20508e" : "#a9b4c9"} />
        </linearGradient>
      </defs>
      <text x="0" y="214" fontSize="262" fill={`url(#chrome-${gid})`}>
        {letters.map((l, i) => (
          <tspan key={i}>{l}</tspan>
        ))}
      </text>
    </svg>
  );
}

"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";
import sigs from "../signatures.json";

/** Firma de un solo trazo que se dibuja a mano cuando entra en pantalla. */
export default function Signature({ who }: { who: "pablo" | "lori" }) {
  const ref = useRef<SVGSVGElement>(null);
  const s = sigs[who];

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const path = ref.current!.querySelector("path")!;
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.9,
            ease: "power1.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
          }
        );
      });
    },
    ref
  );

  return (
    <svg ref={ref} className="signature" viewBox={s.viewBox} aria-hidden="true" focusable="false">
      <path d={s.d} />
    </svg>
  );
}

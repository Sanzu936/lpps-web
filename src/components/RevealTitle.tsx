"use client";
import { useRef, type ElementType } from "react";
import { useMotion } from "@/lib/motion";

/**
 * Titular que sube línea a línea desde detrás de una máscara al entrar en pantalla.
 * Las líneas se pasan ya cortadas para controlar el ritmo tipográfico.
 */
export default function RevealTitle({
  lines,
  as: Tag = "h2",
  className = "section-title",
  id,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = ref.current!.querySelectorAll(".reveal-line > span");
        gsap.fromTo(
          inner,
          { yPercent: 108, rotate: 2.5 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: ref.current, start: "top 86%", once: true },
          }
        );
      });
    },
    ref
  );
  return (
    <Tag ref={ref} className={className} id={id}>
      {lines.map((l, i) => (
        <span className="reveal-line" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

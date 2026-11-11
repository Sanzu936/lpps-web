"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";

/**
 * Cinta de obra con texto en movimiento. La velocidad y el sentido siguen al scroll:
 * si bajas rápido, acelera; si subes, va hacia atrás.
 */
export default function Tape({
  items,
  variant = "signal",
  rotate = -2.5,
  reverse = false,
}: {
  items: string[];
  variant?: "signal" | "ink";
  rotate?: number;
  reverse?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".tape__track")!;
        const dir = reverse ? 1 : -1;
        const loop = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: 28, ease: "none", repeat: -1, paused: true }
        );
        let base = 1;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity() / 300;
            base = self.direction === 1 ? 1 : -1;
            const boost = gsap.utils.clamp(-6, 6, v * dir * -1);
            gsap.to(loop, { timeScale: base + boost * 0.6, duration: 0.25, overwrite: true });
            gsap.to(loop, { timeScale: base, duration: 1.2, delay: 0.25, ease: "power2.out" });
          },
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
        if (st.isActive) loop.play();
        return () => {
          st.kill();
          loop.kill();
        };
      });
    },
    root
  );

  const group = (hidden: boolean) => (
    <div className="tape__group" aria-hidden={hidden || undefined}>
      {[...items, ...items].map((t, i) => (
        <span className="tape__item" key={i}>
          {t}
          <span className="tape__sep" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className={`tape ${variant === "ink" ? "tape--ink" : ""}`}
      style={{ "--tape-rot": `${rotate}deg` } as React.CSSProperties}
      role="marquee"
      aria-label={items.join(". ")}
    >
      <div className="tape__track" aria-hidden="true">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

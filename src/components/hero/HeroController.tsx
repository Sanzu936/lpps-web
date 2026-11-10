"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";
import { heroState } from "./heroState";

/**
 * Transición oscuro → claro: el hero queda fijo y, al hacer scroll, una rejilla de
 * baldosas de papel gira una a una desde el centro (como un panel de aeropuerto)
 * mientras el contenido oscuro se aleja. Al terminar, la web ya está en claro.
 */
export default function HeroController() {
  const anchor = useRef<HTMLSpanElement>(null);

  useMotion(
    ({ gsap }) => {
    const section = anchor.current?.closest<HTMLElement>(".hero");
    if (!section) return;
    const content = section.querySelector<HTMLElement>(".hero__content")!;
    const flip = section.querySelector<HTMLElement>(".flip")!;
    const tiles = gsap.utils.toArray<HTMLElement>(".flip__tile", flip);
    const hint = section.querySelector<HTMLElement>(".hero__hint");
    const header = document.querySelector<HTMLElement>(".site-header");

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 760px)",
      },
      (ctx) => {
        const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
        if (!motion) {
          heroState.progress = 0;
          return;
        }
        const grid: [number, number] = wide ? [8, 12] : [12, 8];
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              heroState.progress = self.progress;
              flip.classList.toggle("is-active", self.progress > 0.002);
              if (header && self.isActive) header.dataset.theme = self.progress > 0.5 ? "light" : "dark";
            },
            onLeave: () => {
              heroState.visible = false;
            },
            onEnterBack: () => {
              heroState.visible = true;
            },
          },
        });
        tl.to(content, { scale: 0.86, yPercent: -5, autoAlpha: 0.12, duration: 0.6 }, 0);
        if (hint) tl.to(hint, { autoAlpha: 0, duration: 0.12 }, 0);
        tl.fromTo(
          tiles,
          { rotationX: -92, transformPerspective: 650, "--s": 0.7 },
          {
            rotationX: 0,
            "--s": 0,
            duration: 0.24,
            ease: "power2.out",
            stagger: { grid, from: "center", amount: 0.42 },
          },
          0.04
        );
        // tramo final: el contenido claro sube por encima del papel ya colocado
        tl.to({}, { duration: 0.3 }, 0.7);
        return () => {
          heroState.progress = 0;
          heroState.visible = true;
        };
      }
    );
    },
    undefined,
    { immediate: true }
  );

  return <span ref={anchor} hidden />;
}

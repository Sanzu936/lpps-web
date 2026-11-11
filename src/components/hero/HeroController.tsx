"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";
import { getLenis } from "@/lib/scroll";
import { heroState } from "./heroState";

/**
 * Transición del hero: el hero queda fijo y, al hacer scroll, una rejilla de baldosas
 * de cristal azul gira una a una desde el centro (como un panel de aeropuerto),
 * con un destello en el borde, mientras el contenido se aleja hacia el fondo.
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
          { rotationX: -92, transformPerspective: 650, "--s": 0.85, "--g": 1 },
          {
            rotationX: 0,
            "--s": 0,
            "--g": 0.12,
            duration: 0.24,
            ease: "power2.out",
            stagger: { grid, from: "center", amount: 0.42 },
          },
          0.04
        );
        // remate: un barrido de luz cruza el muro y el zorro aparece grabado en él
        const sweep = flip.querySelector<HTMLElement>(".flip__sweep");
        const fox = flip.querySelector<SVGElement>(".flip__fox");
        if (sweep) tl.fromTo(sweep, { xPercent: -130, autoAlpha: 0 }, { xPercent: 130, autoAlpha: 1, duration: 0.32, ease: "power1.inOut" }, 0.42);
        if (fox) tl.fromTo(fox, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power2.out" }, 0.5);
        // tramo final: la sección siguiente sube por encima de las baldosas ya colocadas
        tl.to({}, { duration: 0.3 }, 0.7);
        // Con teclado: si algo del hero recibe el foco cuando ya está tapado, se vuelve al inicio
        const onFocus = () => {
          if (heroState.progress > 0.02) {
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(0, { immediate: true });
            else window.scrollTo(0, 0);
          }
        };
        content.addEventListener("focusin", onFocus);
        return () => {
          content.removeEventListener("focusin", onFocus);
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

"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/config/site";
import RevealTitle from "../RevealTitle";
import Magnetic from "../Magnetic";
import FoxBuild from "./FoxBuild";

/**
 * Cierre. El teléfono aparece en un panel de aeropuerto: cada cifra gira
 * varias veces hasta quedarse en su sitio.
 */
export default function Contacto() {
  const root = useRef<HTMLElement>(null);
  const chars = Array.from(PHONE_DISPLAY);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const flaps = gsap.utils.toArray<HTMLElement>(".flap[data-digit]", root.current);
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current!.querySelector(".board"), start: "top 80%", once: true } });
        flaps.forEach((f, i) => {
          const final = f.dataset.digit!;
          const face = f.querySelector<HTMLElement>(".flap__face")!;
          const turns = 5 + (i % 4) * 2;
          for (let k = 0; k <= turns; k++) {
            const isLast = k === turns;
            tl.to(
              face,
              {
                rotationX: -90,
                duration: 0.06,
                ease: "power1.in",
                onComplete: () => {
                  face.textContent = isLast ? final : String(Math.floor(Math.random() * 10));
                  gsap.set(face, { rotationX: 90 });
                },
              },
              i * 0.07 + k * 0.12
            ).to(face, { rotationX: 0, duration: 0.06, ease: "power1.out" }, i * 0.07 + k * 0.12 + 0.06);
          }
        });
      });
    },
    root
  );

  return (
    <section ref={root} id="contacto" className="section contacto" aria-labelledby="contacto-title">
      <div className="wrap contacto__grid">
        <div>
        <RevealTitle id="contacto-title" className="contacto__title" lines={["¿Hablamos de", "tu web?"]} />
        <p className="contacto__lede">
          Llámanos o escríbenos. Te contamos cómo sería tu web y, si te encaja, te la enseñamos hecha antes de que pagues nada.
        </p>

        <a className="board" href={PHONE_HREF} aria-label={`Llamar al ${PHONE_DISPLAY}`} data-cursor="Llamar">
          {chars.map((c, i) =>
            c === " " ? (
              <span className="flap flap--gap" key={i} aria-hidden="true" />
            ) : (
              <span className="flap" data-digit={c} key={i} aria-hidden="true">
                <span className="flap__face">{c}</span>
              </span>
            )
          )}
        </a>

        <div className="contacto__actions">
          <Magnetic radius={110}>
            <a className="btn" href={PHONE_HREF} data-cursor="Llamar">
              <span className="btn__dot" aria-hidden="true" />
              <span className="btn__label">Llamar ahora</span>
            </a>
          </Magnetic>
          <a className="btn btn--ghost" href={EMAIL_HREF} data-cursor="Escribir">
            <span className="btn__label">Escribir a {EMAIL}</span>
          </a>
        </div>
        <p className="contacto__hours">Si no lo cogemos al momento, te devolvemos la llamada.</p>
        </div>
        <FoxBuild />
      </div>
    </section>
  );
}

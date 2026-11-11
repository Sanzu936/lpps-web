"use client";
import { useId, useRef, useState } from "react";
import { useMotion } from "@/lib/motion";
import RevealTitle from "../RevealTitle";

type QA = { q: string; a: React.ReactNode };

const FAQ: QA[] = [
  {
    q: "¿Tengo que pagar algo antes de ver mi web?",
    a: (
      <>
        No. Diseñamos y montamos tu web y te la enseñamos terminada. <mark>Solo pagas si te gusta lo que ves.</mark> Si no te
        convence, no nos debes nada.
      </>
    ),
  },
  {
    q: "¿Y si quiero cambiar cosas?",
    a: (
      <>
        Es lo normal. <mark>Incluimos una o dos rondas de ajustes</mark>: textos, colores, fotos, el orden de las secciones o lo que
        haga falta para que la web sea tuya de verdad.
      </>
    ),
  },
  {
    q: "¿Cuánto tardáis?",
    a: (
      <>
        Te enseñamos la primera versión en pocos días, según lo grande que sea tu web. Cuando nos das el visto bueno,{" "}
        <mark>la publicamos en 48 horas.</mark>
      </>
    ),
  },
  {
    q: "Ya tengo web. ¿Qué pasa con ella?",
    a: (
      <>
        La usamos como punto de partida: aprovechamos lo que funciona y rehacemos lo demás. Al publicar,{" "}
        <mark>la web nueva sustituye a la antigua en tu mismo dominio</mark>, y nos ocupamos de que las direcciones antiguas
        importantes sigan funcionando.
      </>
    ),
  },
  {
    q: "¿Dónde queda alojada? ¿Necesito hosting y dominio?",
    a: (
      <>
        <mark>La instalamos en tu hosting y en tu dominio</mark>, así todo sigue siendo tuyo. Si tu plataforma actual no lo
        permite, te ayudamos a pasar a otro hosting y nos encargamos de la parte técnica.
      </>
    ),
  },
  {
    q: "¿Qué necesitáis de mí?",
    a: (
      <>
        Poca cosa: una llamada para entender tu negocio, tu logo y tus fotos si los tienes, y la información de lo que vendes.{" "}
        <mark>Del resto nos encargamos nosotros</mark>, también de los textos si quieres.
      </>
    ),
  },
];

const GUARANTEES = [
  { t: "No pagas hasta verla", d: "Te enseñamos la web terminada primero." },
  { t: "Ajustes incluidos", d: "Una o dos rondas de cambios contigo." },
  { t: "Publicada en 48 h", d: "En tu hosting y tu dominio." },
];

function Item({ qa, open, onToggle }: { qa: QA; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className={`faq__item ${open ? "is-open" : ""}`}>
      <h3 className="faq__q">
        <button type="button" aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} onClick={onToggle}>
          <span>{qa.q}</span>
          <span className="faq__icon" aria-hidden="true" />
        </button>
      </h3>
      <div className="faq__a" id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} inert={!open}>
        <div className="faq__a-inner">
          <p>{qa.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Preguntas() {
  const [open, setOpen] = useState<number | null>(0);
  const root = useRef<HTMLElement>(null);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Sello que gira con la velocidad del scroll
        const seal = root.current!.querySelector(".seal__ring");
        const spin = gsap.to(seal, { rotation: 360, duration: 22, ease: "none", repeat: -1, paused: true });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 250);
            gsap.to(spin, { timeScale: 1 + v, duration: 0.2, overwrite: true });
            gsap.to(spin, { timeScale: 1, duration: 1.4, delay: 0.2 });
          },
          onToggle: (self) => (self.isActive ? spin.play() : spin.pause()),
        });
        if (st.isActive) spin.play();
        gsap.from(root.current!.querySelectorAll(".guarantee"), {
          y: 40,
          autoAlpha: 0,
          rotate: (i: number) => [-4, 3, -2][i % 3],
          stagger: 0.12,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current!.querySelector(".guarantees"), start: "top 85%", once: true },
        });
        return () => st.kill();
      });
    },
    root
  );

  return (
    <section ref={root} id="preguntas" className="section faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <div className="faq__side">
          <RevealTitle id="faq-title" lines={["Lo que", "nos suelen", "preguntar."]} />
          <div className="seal" aria-hidden="true">
            <svg className="seal__ring" viewBox="0 0 200 200">
              <defs>
                <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#seal-circle" startOffset="0" textLength="486" lengthAdjust="spacing">
                  No pagas hasta verla · Ajustes incluidos · Publicada en 48 h ·
                </textPath>
              </text>
            </svg>
            <span className="seal__core">
              <svg viewBox="0 0 24 24">
                <path d="M4 12.5 9.5 18 20 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        <div className="faq__list">
          {FAQ.map((qa, i) => (
            <Item key={qa.q} qa={qa} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>

      <div className="wrap">
        <ul className="guarantees" aria-label="Garantías">
          {GUARANTEES.map((g) => (
            <li className="guarantee glass glass--liquid" key={g.t}>
              <strong>{g.t}</strong>
              <span>{g.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

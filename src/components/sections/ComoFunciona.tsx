"use client";
import { useRef } from "react";
import { useMotion } from "@/lib/motion";

const STEPS = [
  {
    n: "1",
    title: "Te llamamos o nos escribes",
    text: "Nos cuentas qué vendes, a quién y qué te falla de tu web actual, si la tienes. Con una llamada corta tenemos lo necesario para empezar.",
  },
  {
    n: "2",
    title: "Te enseñamos tu web ya hecha",
    text: "Diseñamos y montamos tu web de verdad, no un boceto. La ves terminada y funcionando antes de pagar nada.",
  },
  {
    n: "3",
    title: "Ajustes incluidos",
    text: "¿Otro color, otro texto, otra foto? Hacemos contigo una o dos rondas de cambios, incluidas, hasta que te encaje.",
  },
  {
    n: "4",
    title: "Publicada en 48 horas",
    text: "Cuando das el visto bueno, la instalamos en tu hosting y tu dominio en 48 horas. Tú no tienes que tocar nada técnico.",
  },
];

function VisCall() {
  return (
    <div className="vis vis-call" aria-hidden="true">
      <div className="vis-call__rings">
        <span />
        <span />
        <span />
      </div>
      <div className="vis-call__phone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
        </svg>
      </div>
      <p className="bubble bubble--in">Hola, soy Lori, de LPPS. ¿Te cuento una idea para tu web?</p>
      <p className="bubble bubble--out">Vale, cuéntame.</p>
      <p className="bubble bubble--typing">
        <span />
        <span />
        <span />
      </p>
    </div>
  );
}

function VisBuild() {
  return (
    <div className="vis vis-build" aria-hidden="true">
      <div className="mini-browser">
        <div className="mini-browser__bar">
          <i />
          <i />
          <i />
          <span className="mini-browser__url">tunegocio.es</span>
        </div>
        <div className="mini-browser__body">
          <div className="mb-block mb-nav" />
          <div className="mb-block mb-hero">
            <span className="mb-line mb-line--l" />
            <span className="mb-line mb-line--m" />
            <span className="mb-pill" />
          </div>
          <div className="mb-row">
            <div className="mb-block mb-card" />
            <div className="mb-block mb-card" />
            <div className="mb-block mb-card" />
          </div>
        </div>
      </div>
      <div className="stamp">
        <span>Pagas</span>
        <span>después</span>
        <span>de verla</span>
      </div>
    </div>
  );
}

function VisTweak() {
  return (
    <div className="vis vis-tweak" aria-hidden="true">
      <div className="tweak-card">
        <div className="tweak-card__title">
          <span className="tw-a">Tu tienda</span>
          <span className="tw-b">Hecho a mano</span>
        </div>
        <span className="tweak-card__line" />
        <span className="tweak-card__line tweak-card__line--s" />
        <span className="tweak-card__btn">Ver tienda</span>
      </div>
      <div className="swatches">
        <span className="sw sw--1" />
        <span className="sw sw--2" />
        <span className="sw sw--3" />
      </div>
      <svg className="tw-cursor" viewBox="0 0 24 24">
        <path d="M4 2l15 9-6.5 1.6L9.6 19z" fill="#14152b" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div className="rounds">
        <span className="round round--1">Ronda 1</span>
        <span className="round round--2">Ronda 2</span>
      </div>
    </div>
  );
}

function VisLaunch() {
  return (
    <div className="vis vis-launch" aria-hidden="true">
      <div className="launch-url">
        <span className="launch-url__lock" />
        <span className="launch-url__text">www.tunegocio.es</span>
      </div>
      <div className="launch-ring">
        <svg viewBox="0 0 120 120">
          <circle className="launch-ring__bg" cx="60" cy="60" r="52" />
          <circle className="launch-ring__fg" cx="60" cy="60" r="52" pathLength={1} />
        </svg>
        <span className="launch-ring__num">
          <span className="launch-ring__count">48</span>
          <small>horas</small>
        </span>
      </div>
      <div className="launch-status">
        <span className="launch-status__dot" />
        <span className="launch-status__a">Subiendo a tu hosting</span>
        <span className="launch-status__b">Publicada</span>
      </div>
      <div className="launch-tiles">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}

const VIS = [VisCall, VisBuild, VisTweak, VisLaunch];

export default function ComoFunciona() {
  const root = useRef<HTMLElement>(null);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const section = root.current!;
      const track = section.querySelector<HTMLElement>(".hsteps__track")!;
      const panels = gsap.utils.toArray<HTMLElement>(".hstep", section);
      const fill = section.querySelector<HTMLElement>(".hsteps__fill")!;
      const marks = gsap.utils.toArray<HTMLElement>(".hsteps__mark", section);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        section.classList.add("is-horizontal");
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(fill, { scaleX: self.progress });
              marks.forEach((m, i) => m.classList.toggle("is-on", self.progress >= (i + 0.5) / (marks.length + 0.5)));
            },
          },
        });

        const st = (panel: HTMLElement) => ({
          containerAnimation: tween,
          trigger: panel,
          start: "left 80%",
          end: "center 50%",
          scrub: 0.5,
        });

        // Paso 1: llamada
        const p1 = panels[1];
        gsap
          .timeline({ scrollTrigger: st(p1) })
          .from(p1.querySelectorAll(".vis-call__rings span"), { scale: 0.2, autoAlpha: 0, stagger: 0.15, duration: 0.6 })
          .from(p1.querySelector(".vis-call__phone"), { rotate: -35, scale: 0.6, duration: 0.5, ease: "back.out(2)" }, 0)
          .from(p1.querySelector(".bubble--in"), { y: 24, scale: 0, transformOrigin: "0% 100%", duration: 0.4, ease: "back.out(1.6)" }, 0.35)
          .from(p1.querySelector(".bubble--out"), { y: 24, scale: 0, transformOrigin: "100% 100%", duration: 0.4, ease: "back.out(1.6)" }, 0.65)
          .from(p1.querySelector(".bubble--typing"), { y: 18, scale: 0, transformOrigin: "0% 100%", duration: 0.3 }, 0.9);

        // Paso 2: la web se monta dentro del navegador
        const p2 = panels[2];
        gsap
          .timeline({ scrollTrigger: st(p2) })
          .from(p2.querySelector(".mini-browser"), { y: 40, rotateX: 18, autoAlpha: 0, duration: 0.4 })
          .fromTo(p2.querySelectorAll(".mb-block"), { "--fill": 0 }, { "--fill": 1, stagger: 0.08, duration: 0.35 }, 0.3)
          .from(p2.querySelectorAll(".mb-line, .mb-pill"), { scaleX: 0, transformOrigin: "0 50%", stagger: 0.08, duration: 0.3 }, 0.55)
          .from(p2.querySelector(".stamp"), { scale: 0, rotate: -40, duration: 0.3, ease: "back.out(2)" }, 0.95);

        // Paso 3: ajustes con el cursor
        const p3 = panels[3];
        gsap
          .timeline({ scrollTrigger: st(p3) })
          .from(p3.querySelector(".tweak-card"), { y: 30, autoAlpha: 0, duration: 0.3 })
          .fromTo(p3.querySelector(".tw-cursor"), { x: 160, y: 120 }, { x: 0, y: 0, duration: 0.35 }, 0.15)
          .to(p3.querySelector(".tweak-card"), { "--accent": "#20508e", "--accent-ink": "#ffffff", duration: 0.05 }, 0.5)
          .to(p3.querySelector(".sw--2"), { scale: 1.25, duration: 0.08, yoyo: true, repeat: 1 }, 0.48)
          .from(p3.querySelector(".round--1"), { scale: 0, duration: 0.15 }, 0.5)
          .to(p3.querySelector(".tw-cursor"), { x: -150, y: -96, duration: 0.3 }, 0.62)
          .fromTo(p3.querySelector(".tw-a"), { yPercent: 0 }, { yPercent: -110, duration: 0.15 }, 0.92)
          .from(p3.querySelector(".tw-b"), { yPercent: 110, duration: 0.15 }, 0.92)
          .from(p3.querySelector(".round--2"), { scale: 0, duration: 0.15 }, 0.95);

        // Paso 4: publicación en 48 h
        const p4 = panels[4];
        const count = p4.querySelector<HTMLElement>(".launch-ring__count")!;
        const counter = { v: 0 };
        gsap
          .timeline({ scrollTrigger: st(p4) })
          .from(p4.querySelector(".launch-url__text"), { clipPath: "inset(0 100% 0 0)", duration: 0.35, ease: "steps(16)" })
          .fromTo(p4.querySelector(".launch-ring__fg"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6 }, 0.2)
          .fromTo(
            counter,
            { v: 0 },
            { v: 48, duration: 0.6, onUpdate: () => (count.textContent = String(Math.round(counter.v))) },
            0.2
          )
          .fromTo(p4.querySelector(".launch-status"), { "--done": 0 }, { "--done": 1, duration: 0.05 }, 0.8)
          .from(p4.querySelectorAll(".launch-tiles span"), { rotationX: -90, stagger: 0.03, duration: 0.2 }, 0.8);

        return () => section.classList.remove("is-horizontal");
      });
    },
    root
  );

  return (
    <section ref={root} id="como-funciona" className="hsteps on-light" data-theme="light" aria-labelledby="como-title">
      <div className="hsteps__viewport">
        <ol className="hsteps__track">
          <li className="hstep hstep--intro">
            <h2 id="como-title" className="section-title">
              Así trabajamos, paso a paso.
            </h2>
            <p className="lede">
              Cuatro pasos y ninguna sorpresa. Lo más importante: no pagas nada hasta que ves tu web terminada.
            </p>
            <p className="hstep__swipe" aria-hidden="true">
              Sigue bajando
              <span />
            </p>
          </li>
          {STEPS.map((s, i) => {
            const Vis = VIS[i];
            return (
              <li className="hstep" key={s.n}>
                <div className="hstep__copy">
                  <span className="hstep__n" aria-hidden="true">
                    {s.n}
                  </span>
                  <h3 className="hstep__title">
                    <span className="sr-only">Paso {s.n}: </span>
                    {s.title}
                  </h3>
                  <p className="hstep__text">{s.text}</p>
                </div>
                <Vis />
              </li>
            );
          })}
        </ol>
        <div className="hsteps__rail" aria-hidden="true">
          <span className="hsteps__fill" />
          {STEPS.map((s) => (
            <span className="hsteps__mark" key={s.n}>
              {s.n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

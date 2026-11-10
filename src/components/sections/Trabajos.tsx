"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { useMotion } from "@/lib/motion";
import { TRABAJOS, ANTES_DESPUES, type Captura } from "@/content/trabajos";
import { withBase } from "@/config/site";
import RevealTitle from "../RevealTitle";

function Pic({ c, alt, sizes, eager = false }: { c: Captura; alt: string; sizes: string; eager?: boolean }) {
  return (
    <picture>
      <source type="image/avif" srcSet={withBase(`${c.src}.avif`)} sizes={sizes} />
      <img
        src={withBase(`${c.src}.webp`)}
        alt={alt}
        width={c.width}
        height={c.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        draggable={false}
      />
    </picture>
  );
}

function SampleTag() {
  return (
    <span className="sample-tag">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 8.5 6 12.5 14 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      Proyecto de muestra
    </span>
  );
}

/** Pantalla con scroll interno: hover (ratón) o toque/teclado (botón) la recorre entera. */
function Screen({ c, alt, label, sizes }: { c: Captura; alt: string; label: string; sizes: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`screen ${on ? "is-scrolling" : ""}`} style={{ "--ratio": c.height / c.width } as React.CSSProperties}>
      <div className="screen__img">
        <Pic c={c} alt={alt} sizes={sizes} />
      </div>
      <button
        type="button"
        className="screen__toggle"
        aria-pressed={on}
        aria-label={on ? `Volver al principio de ${label}` : `Recorrer ${label} de arriba abajo`}
        data-cursor={on ? "Volver" : "Recorrer"}
        onClick={() => setOn((v) => !v)}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setOn(false);
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setOn(true);
        }}
      />
    </div>
  );
}

function Devices({ t }: { t: (typeof TRABAJOS)[number] }) {
  return (
    <div className="devices">
      <div className="laptop">
        <div className="laptop__lid">
          <div className="laptop__bezel">
            <span className="laptop__cam" aria-hidden="true" />
            <Screen c={t.escritorio} alt={`${t.nombre} en un portátil`} label={`la versión de escritorio de ${t.nombre.toLowerCase()}`} sizes="(min-width: 1000px) 760px, 92vw" />
          </div>
        </div>
        <div className="laptop__base" aria-hidden="true">
          <span className="laptop__notch" />
        </div>
      </div>
      <div className="phone">
        <div className="phone__frame">
          <span className="phone__island" aria-hidden="true" />
          <Screen c={t.movil} alt={`${t.nombre} en un móvil`} label={`la versión móvil de ${t.nombre.toLowerCase()}`} sizes="260px" />
        </div>
      </div>
    </div>
  );
}

/** Deslizador antes / después, con teclado (flechas) y arrastre. */
function BeforeAfter() {
  const ad = ANTES_DESPUES;
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const sweep = useRef<{ kill: () => void } | null>(null);

  const setFromX = useCallback((clientX: number) => {
    const r = root.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    root.current?.style.setProperty("--pos", `${pos}%`);
  }, [pos]);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const o = { v: 50 };
        sweep.current = gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } })
          .to(o, { v: 12, duration: 0.9, ease: "power2.inOut", onUpdate: () => setPos(o.v) })
          .to(o, { v: 88, duration: 1.2, ease: "power2.inOut", onUpdate: () => setPos(o.v) })
          .to(o, { v: 50, duration: 0.8, ease: "power2.out", onUpdate: () => setPos(o.v) });
      });
    },
    root
  );

  return (
    <figure className="ba">
      <div
        ref={root}
        className="ba__stage"
        data-cursor="Arrastra"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          sweep.current?.kill();
          setFromX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <div className="ba__img ba__img--before">
          <Pic c={ad.antes} alt={ad.antes.alt} sizes="(min-width: 1100px) 1040px, 94vw" />
        </div>
        <div className="ba__img ba__img--after">
          <Pic c={ad.despues} alt={ad.despues.alt} sizes="(min-width: 1100px) 1040px, 94vw" />
        </div>
        <span className="ba__chip ba__chip--before" aria-hidden="true">
          {ad.antes.etiqueta}
        </span>
        <span className="ba__chip ba__chip--after" aria-hidden="true">
          {ad.despues.etiqueta}
        </span>
        <div className="ba__handle" aria-hidden="true">
          <span className="ba__knob">
            <svg viewBox="0 0 24 24">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <input
          className="ba__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(e) => {
            sweep.current?.kill();
            setPos(Number(e.target.value));
          }}
          onFocus={(e) => e.currentTarget.matches(":focus-visible") && root.current?.classList.add("is-focused")}
          onBlur={() => root.current?.classList.remove("is-focused")}
          aria-label="Comparar antes y después: mueve a la izquierda para ver el después, a la derecha para ver el antes"
          aria-valuetext={`${Math.round(pos)} % de la imagen muestra el antes`}
        />
      </div>
      <figcaption className="ba__caption">
        <strong>{ad.nombre}.</strong> {ad.descripcion}
        {ad.muestra ? <SampleTag /> : null}
      </figcaption>
    </figure>
  );
}

export default function Trabajos() {
  const root = useRef<HTMLElement>(null);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".devices", root.current).forEach((d) => {
          const lid = d.querySelector(".laptop__lid");
          const screens = d.querySelectorAll(".screen");
          const phone = d.querySelector(".phone");
          gsap
            .timeline({ scrollTrigger: { trigger: d, start: "top 85%", end: "top 25%", scrub: 0.6 } })
            .fromTo(lid, { rotationX: -88 }, { rotationX: 0, ease: "power2.out", duration: 1 }, 0)
            .fromTo(screens, { "--power": 0 }, { "--power": 1, duration: 0.5, ease: "power1.in" }, 0.55)
            .fromTo(phone, { yPercent: 40, rotate: 9, autoAlpha: 0 }, { yPercent: 0, rotate: -4, autoAlpha: 1, duration: 0.8 }, 0.3);
        });
      });
    },
    root
  );

  return (
    <section ref={root} id="trabajos" className="section trabajos on-light" data-theme="light" aria-labelledby="trabajos-title">
      <div className="wrap">
        <div className="trabajos__head">
          <RevealTitle id="trabajos-title" lines={["La mejor muestra", "es esta web."]} />
          <p className="lede">
            Así de cuidada queda la tuya, en el ordenador y en el móvil. Pasa el ratón por las pantallas, o tócalas, para
            recorrerlas enteras.
          </p>
        </div>

        {TRABAJOS.map((t) => (
          <article className="work" key={t.id} aria-labelledby={`work-${t.id}`}>
            <Devices t={t} />
            <div className="work__info">
              {t.muestra ? <SampleTag /> : null}
              <h3 id={`work-${t.id}`} className="work__name">
                {t.nombre}
              </h3>
              <p className="work__type">{t.tipo}</p>
              <p className="work__desc">{t.descripcion}</p>
            </div>
          </article>
        ))}

        <BeforeAfter />
      </div>
    </section>
  );
}

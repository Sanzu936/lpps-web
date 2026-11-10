import { Fragment } from "react";
import BookingLink from "../BookingLink";
import { PHONE_DISPLAY, PHONE_HREF } from "@/config/site";
import HeroCanvas from "./HeroCanvas";
import HeroController from "./HeroController";
import FoxMark from "../FoxMark";

const TITLE = "Webs que no parecen de plantilla.";
const TILES = 96; // 12×8 en escritorio, 8×12 en móvil

/** Parte el titular en palabras y letras (cada letra se "pinta" por orden). */
function SplitTitle({ text }: { text: string }) {
  let i = 0;
  return (
    <span aria-hidden="true" className="hero__title-chars">
      {text.split(" ").map((word, w, all) => (
        <Fragment key={w}>
          <span className="hero__word">
            {Array.from(word).map((ch) => {
              const idx = i++;
              return (
                <span className="hero__ch" style={{ "--i": idx } as React.CSSProperties} key={idx}>
                  {ch}
                </span>
              );
            })}
          </span>
          {w < all.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__stage">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__grid" />
        </div>
        <HeroCanvas />

        <div className="hero__content wrap">
          <p className="hero__log" aria-hidden="true">
            <span className="hero__log-line">Montando la estructura</span>
            <span className="hero__log-line">Aplicando color y tipografía</span>
            <span className="hero__log-line">Escribiendo el contenido</span>
            <span className="hero__log-line">Web lista. Así trabajamos.</span>
          </p>

          <h1 id="hero-title" className="hero__title wf" data-wf="h1 · titular">
            <span className="sr-only">{TITLE}</span>
            <SplitTitle text={TITLE} />
          </h1>

          <p className="hero__sub wf wf--skeleton" data-wf="p · texto">
            <span className="hero__sub-text">
              Somos Pablo y Lori. Diseñamos y programamos webs a medida para negocios online, te enseñamos la tuya terminada
              antes de que pagues nada y la publicamos en 48&nbsp;horas.
            </span>
          </p>

          <div className="hero__ctas wf wf--skeleton" data-wf="a · botones">
            <BookingLink magnetic radius={120} />
            <a className="btn btn--ghost" href="#como-funciona">
              <span className="btn__label">Cómo trabajamos</span>
            </a>
          </div>

          <p className="hero__note wf wf--skeleton" data-wf="p · nota">
            <span className="hero__note-text">
              ¿Te acabamos de llamar? Somos nosotros:{" "}
              <a href={PHONE_HREF} data-cursor="Llamar">
                {PHONE_DISPLAY}
              </a>
            </span>
          </p>
        </div>

        <span className="hero__flare" aria-hidden="true" />

        <div className="hero__hint" aria-hidden="true">
          <span>Sigue bajando</span>
          <span className="hero__hint-bar" />
        </div>

        <div className="flip" aria-hidden="true">
          {Array.from({ length: TILES }, (_, i) => (
            <span className="flip__tile" key={i} />
          ))}
          <span className="flip__sweep" />
          <FoxMark className="flip__fox" />
        </div>
      </div>
      <HeroController />
    </section>
  );
}

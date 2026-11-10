import RevealTitle from "../RevealTitle";
import ElasticName from "./ElasticName";
import Signature from "./Signature";
import { PHONE_DISPLAY, PHONE_HREF } from "@/config/site";

const PARTNERS = [
  {
    id: "pablo" as const,
    name: "Pablo",
    role: "Diseño y desarrollo",
    text: "Diseña cada web desde una hoja en blanco y la programa a mano, sin plantillas ni constructores. Si algo en tu web se mueve con gracia, carga rápido o se ve igual de bien en el móvil, es cosa suya.",
    tasks: ["Diseño visual y de interacción", "Programación y animación", "Velocidad, SEO técnico y accesibilidad"],
  },
  {
    id: "lori" as const,
    name: "Lori",
    role: "Proyecto, textos y publicación",
    text: "Es quien suele llamarte. Entiende qué vendes y a quién, escribe contigo los textos y lleva los ajustes hasta que la web queda como quieres. Después la publica en tu hosting y en tu dominio.",
    tasks: ["Llamadas y seguimiento contigo", "Textos y estructura de la web", "Ajustes, publicación y dominio"],
  },
];

export default function Nosotros() {
  return (
    <section id="nosotros" className="section nosotros on-light" data-theme="light" aria-labelledby="nosotros-title">
      <div className="wrap">
        <div className="nosotros__head">
          <RevealTitle id="nosotros-title" lines={["Detrás de esta web", "hay dos personas."]} />
          <p className="lede">
            Sin centralita, sin departamentos y sin becarios que cambian cada mes. Hablas siempre con quien diseña y publica tu
            web.
          </p>
        </div>

        <div className="partners">
          {PARTNERS.map((p, i) => (
            <article className={`partner partner--${p.id}`} key={p.id} aria-labelledby={`partner-${p.id}`}>
              <h3 id={`partner-${p.id}`} className="partner__name">
                <span className="sr-only">{p.name}</span>
                <ElasticName name={p.name} accent={i === 1} />
              </h3>
              <Signature who={p.id} />
              <p className="partner__role">{p.role}</p>
              <p className="partner__text">{p.text}</p>
              <ul className="partner__tasks">
                {p.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="direct">
          <p className="direct__lead">Si llamas a este número, lo coge uno de los dos:</p>
          <a className="direct__phone" href={PHONE_HREF} data-cursor="Llamar">
            <span className="direct__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              </svg>
            </span>
            <span className="direct__number">{PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

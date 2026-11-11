/**
 * TRABAJOS que se muestran en la sección "Trabajos".
 *
 * Para añadir un proyecto de muestra:
 *  1. Guarda dos capturas de página completa en /public/trabajos/:
 *     - escritorio: ~1000 px de ancho (.avif y .webp con el mismo nombre)
 *     - móvil: ~390 px de ancho (.avif y .webp)
 *  2. Añade un objeto a TRABAJOS con `muestra: true`: así se muestra la etiqueta
 *     "Proyecto de muestra" y nunca parece un cliente real.
 *
 * Mientras no haya proyectos de muestra, se enseña esta misma web.
 */
export type Captura = {
  /** ruta sin extensión, p. ej. "/trabajos/lpps-escritorio" (se sirven .avif y .webp) */
  src: string;
  width: number;
  height: number;
};

export type Trabajo = {
  id: string;
  nombre: string;
  /** tipo de negocio o de web, p. ej. "Tienda online de cerámica" */
  tipo: string;
  descripcion: string;
  /** true = proyecto de muestra (negocio inventado). Muestra la etiqueta. */
  muestra: boolean;
  /** opcional: ruta a la web en vivo (p. ej. "/trabajos/sigila/"); muestra el botón "Ver la web en vivo" */
  url?: string;
  escritorio: Captura;
  movil: Captura;
};

export type AntesDespues = {
  nombre: string;
  descripcion: string;
  muestra: boolean;
  antes: Captura & { etiqueta: string; alt: string };
  despues: Captura & { etiqueta: string; alt: string };
  /** opcionales: versiones para móvil (se usan por debajo de 760 px) */
  antesMovil?: Captura;
  despuesMovil?: Captura;
};

// Las dimensiones se rellenan con scripts/capturas.mjs (genera src/content/capturas.json).
import capturas from "./capturas.json";
import muestras from "./capturas-muestras.json";

export const TRABAJOS: Trabajo[] = [
  {
    id: "sigila",
    nombre: "Sigila",
    tipo: "SaaS · facturación para autónomos",
    descripcion:
      "Web de producto con escena 3D propia en el hero, la interfaz de la app funcionando sola, precios y prueba gratis. Pensada para que un autónomo entienda el producto en diez segundos.",
    muestra: true,
    url: "/trabajos/sigila/",
    escritorio: muestras.sigila.escritorio,
    movil: muestras.sigila.movil,
  },
  {
    id: "oquedad",
    nombre: "OQUEDAD",
    tipo: "Tienda online · cerámica hecha a mano",
    descripcion:
      "E-commerce pequeño con una vasija en 3D que se esmalta al hacer scroll, fichas de producto, colección y carrito. Para que comprar cerámica por internet dé confianza.",
    muestra: true,
    url: "/trabajos/oquedad/",
    escritorio: muestras.oquedad.escritorio,
    movil: muestras.oquedad.movil,
  },
  {
    id: "candela",
    nombre: "Candela Ruiseñor",
    tipo: "Coach online · programa de oratoria",
    descripcion:
      "Web de infoproductora con vídeo en el hero, el método paso a paso, el programa estrella y testimonios. Todo lleva a reservar una llamada.",
    muestra: true,
    url: "/trabajos/candela/",
    escritorio: muestras.candela.escritorio,
    movil: muestras.candela.movil,
  },
  {
    id: "lpps",
    nombre: "Esta misma web",
    tipo: "Web de agencia",
    descripcion:
      "Diseño propio, 3D en tiempo real, cristal líquido y animaciones ligadas al scroll, con una versión más ligera para que en el móvil vaya igual de fina.",
    muestra: false,
    escritorio: capturas.escritorio,
    movil: capturas.movil,
  },
];

export const ANTES_DESPUES: AntesDespues = {
  nombre: "Del plano a la web terminada",
  descripcion:
    "Así era la sección «Quiénes somos» de esta web antes de aplicar el diseño: solo estructura en líneas. Arrastra para ver la diferencia.",
  muestra: false,
  antes: { ...capturas.plano, etiqueta: "Antes", alt: "La sección Quiénes somos de LPPS en fase de plano: estructura en líneas, sin color ni tipografía." },
  antesMovil: capturas.planoMovil,
  despuesMovil: capturas.finalMovil,
  despues: { ...capturas.final, etiqueta: "Después", alt: "La sección Quiénes somos terminada: nombres de Pablo y Lori en tipografía grande y sus firmas." },
};

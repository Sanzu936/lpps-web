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
  escritorio: Captura;
  movil: Captura;
};

export type AntesDespues = {
  nombre: string;
  descripcion: string;
  muestra: boolean;
  antes: Captura & { etiqueta: string; alt: string };
  despues: Captura & { etiqueta: string; alt: string };
};

// Las dimensiones se rellenan con scripts/capturas.mjs (genera src/content/capturas.json).
import capturas from "./capturas.json";

export const TRABAJOS: Trabajo[] = [
  {
    id: "lpps",
    nombre: "Esta misma web",
    tipo: "Web de agencia",
    descripcion:
      "Diseño propio, 3D en tiempo real, animaciones ligadas al scroll y una versión ligera para móvil. Pasa el ratón o toca la pantalla para recorrerla entera.",
    muestra: false,
    escritorio: capturas.escritorio,
    movil: capturas.movil,
  },
];

export const ANTES_DESPUES: AntesDespues = {
  nombre: "Del plano a la web terminada",
  descripcion:
    "Así era esta página antes de aplicar el diseño: solo estructura en líneas. Arrastra para ver la diferencia que marca el diseño.",
  muestra: false,
  antes: { ...capturas.plano, etiqueta: "Antes", alt: "La web de LPPS en fase de plano: estructura en líneas, sin color ni tipografía." },
  despues: { ...capturas.final, etiqueta: "Después", alt: "La web de LPPS terminada: hero oscuro con titular grande y escena 3D." },
};

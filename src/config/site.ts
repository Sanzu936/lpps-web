/**
 * Datos de contacto y destino de los botones "Agendar llamada".
 * Para conectar una agenda (Calendly, Cal.com, Google Calendar...), cambia BOOKING_HREF
 * por la URL de la agenda. Todos los botones "Agendar llamada" de la web usan esta constante.
 */
export const BOOKING_HREF = "#contacto";

/** Ruta base si la web se publica en una subcarpeta (ver next.config.mjs). Vacía en la raíz. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
/** Antepone la ruta base a una ruta interna absoluta ("/aviso-legal/" → "/demo/aviso-legal/"). */
export const withBase = (path: string) => `${BASE_PATH}${path}`;

/** true si BOOKING_HREF apunta a otra web (abre en pestaña nueva). */
export const BOOKING_IS_EXTERNAL = /^https?:\/\//.test(BOOKING_HREF);

export const PHONE_DISPLAY = "919 93 38 23";
export const PHONE_HREF = "tel:+34919933823";
export const EMAIL = "info@lppstech.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const SITE_URL = "https://lppstech.com";
export const SITE_NAME = "LPPS";
export const SITE_TITLE = "LPPS · Diseñamos y publicamos webs que no parecen de plantilla";
export const SITE_DESCRIPTION =
  "Somos Pablo y Lori. Diseñamos webs a medida para negocios online, te enseñamos la tuya terminada antes de que pagues nada y la publicamos en tu hosting en 48 horas.";

import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";
import "../legal.css";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "lppstech.com no usa cookies ni herramientas de seguimiento. Te explicamos qué significa y cómo gestionar las cookies en tu navegador.",
  alternates: { canonical: "/cookies/" },
  openGraph: { title: "Política de cookies · LPPS", url: "/cookies/", type: "article", locale: "es_ES", siteName: "LPPS", description: "lppstech.com no usa cookies ni herramientas de seguimiento. Te explicamos qué significa y cómo gestionar las cookies en tu navegador." },
};

export default function Cookies() {
  return (
    <LegalPage title="Política de cookies" updated="noviembre de 2026">
      <p>
        Esta política se publica en cumplimiento del artículo 22.2 de la Ley 34/2002, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), y de las directrices de la Agencia Española de Protección de Datos.
      </p>

      <h2>1. Qué son las cookies</h2>
      <p>
        Las cookies son pequeños archivos que una web guarda en tu navegador para recordar información sobre tu visita.
        Pueden ser técnicas (necesarias para que la web funcione) o no esenciales (analítica, publicidad o redes sociales), y
        estas últimas requieren tu consentimiento previo.
      </p>

      <h2>2. Cookies que usa esta web</h2>
      <p>
        <strong>Ninguna.</strong> lppstech.com no instala cookies propias ni de terceros, ni usa tecnologías equivalentes de
        seguimiento como píxeles, huellas digitales del navegador o almacenamiento local con fines de análisis o publicidad.
      </p>
      <ul>
        <li>No usamos herramientas de analítica ni de medición de audiencias.</li>
        <li>No mostramos publicidad ni incrustamos contenidos de redes sociales.</li>
        <li>Las tipografías y todos los recursos se sirven desde nuestro propio servidor, sin conexiones a terceros.</li>
      </ul>
      <p>
        Por eso no te mostramos ningún aviso ni banner de cookies: no hay nada que tengas que aceptar o rechazar.
      </p>

      <h2>3. Enlaces a otras webs</h2>
      <p>
        Si sigues un enlace a otra web (por ejemplo, la de la Agencia Española de Protección de Datos), esa web puede usar
        sus propias cookies, que se rigen por su política.
      </p>

      <h2>4. Cómo gestionar las cookies en tu navegador</h2>
      <p>
        Aunque esta web no las usa, puedes consultar, bloquear o borrar las cookies de cualquier sitio desde la configuración
        de tu navegador: en Chrome, Firefox, Safari y Edge están en el apartado de privacidad y seguridad.
      </p>

      <h2>5. Cambios</h2>
      <p>
        Si en el futuro incorporamos cookies no esenciales, actualizaremos esta política y te pediremos tu consentimiento con
        un aviso antes de instalarlas.
      </p>
    </LegalPage>
  );
}

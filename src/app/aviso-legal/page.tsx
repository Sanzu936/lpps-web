import type { Metadata } from "next";
import { LegalPage, Titular } from "@/components/Legal";
import { withBase } from "@/config/site";
import "../legal.css";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de lppstech.com: datos del titular, condiciones de uso, propiedad intelectual y responsabilidad.",
  alternates: { canonical: "/aviso-legal/" },
  openGraph: { title: "Aviso legal · LPPS", url: "/aviso-legal/", type: "article", locale: "es_ES", siteName: "LPPS", description: "Aviso legal de lppstech.com: datos del titular, condiciones de uso, propiedad intelectual y responsabilidad." },
};

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal" updated="noviembre de 2026">
      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de
        Comercio Electrónico (LSSI-CE), te informamos de los datos del titular de este sitio web:
      </p>
      <Titular />

      <h2>2. Objeto</h2>
      <p>
        Este sitio web presenta los servicios de LPPS: diseño, desarrollo y publicación de páginas web para negocios. Su uso
        te atribuye la condición de usuario e implica que aceptas este aviso legal. Si no estás de acuerdo, te pedimos que no
        utilices la web.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        Te comprometes a usar la web y sus contenidos de forma lícita, sin dañar su funcionamiento ni los derechos e intereses
        de LPPS o de terceros. No está permitido intentar acceder a zonas restringidas de los sistemas, introducir código
        malicioso ni usar los contenidos con fines contrarios a la ley.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        El diseño, el código, los textos, las animaciones, los gráficos y el resto de elementos de esta web son titularidad de
        LPPS o se usan con licencia, y están protegidos por la normativa de propiedad intelectual e industrial. No se permite
        reproducirlos, distribuirlos, comunicarlos públicamente ni transformarlos sin autorización expresa, salvo para uso
        personal y privado.
      </p>
      <p>
        Las tipografías Anybody y Schibsted Grotesk se usan bajo la licencia SIL Open Font License. Las firmas manuscritas
        están trazadas con la tipografía EMS Allure, también bajo licencia SIL Open Font License.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        Trabajamos para que la información de esta web sea correcta y esté actualizada, pero no garantizamos la ausencia de
        errores ni la disponibilidad ininterrumpida del sitio. LPPS no se hace responsable de los daños que pudieran derivarse
        de interrupciones técnicas, de virus o de un uso de la web contrario a este aviso legal.
      </p>
      <p>
        Las webs que se muestran en la sección de trabajos se identifican claramente. Cuando una web es un proyecto de muestra,
        corresponde a un negocio inventado y no a un cliente real.
      </p>

      <h2>6. Enlaces</h2>
      <p>
        Si en algún momento la web enlaza a sitios de terceros, LPPS no controla ni se responsabiliza de sus contenidos. Si
        detectas un enlace con contenidos ilícitos, escríbenos y lo retiraremos.
      </p>

      <h2>7. Protección de datos y cookies</h2>
      <p>
        El tratamiento de tus datos personales se explica en la <a href={withBase("/privacidad/")}>política de privacidad</a>. Esta web no
        utiliza cookies; los detalles están en la <a href={withBase("/cookies/")}>política de cookies</a>.
      </p>

      <h2>8. Legislación aplicable y jurisdicción</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para resolver cualquier controversia, las partes se someten a
        los juzgados y tribunales que correspondan conforme a la ley. Si actúas como consumidor, serán competentes los de tu
        domicilio.
      </p>
    </LegalPage>
  );
}

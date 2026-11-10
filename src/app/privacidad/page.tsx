import type { Metadata } from "next";
import { LegalPage, Pendiente } from "@/components/Legal";
import "../legal.css";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo trata LPPS tus datos personales conforme al RGPD y a la LOPDGDD: finalidades, base legal, plazos y tus derechos.",
  alternates: { canonical: "/privacidad/" },
};

export default function Privacidad() {
  return (
    <LegalPage title="Política de privacidad" updated="noviembre de 2026">
      <p>
        Esta política explica cómo tratamos tus datos personales cuando visitas lppstech.com, nos llamas o nos escribes. Se
        aplica el Reglamento (UE) 2016/679 General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, de Protección de
        Datos Personales y garantía de los derechos digitales (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <table>
        <tbody>
          <tr>
            <th scope="row">Responsable</th>
            <td>
              <Pendiente>nombre y apellidos o razón social</Pendiente>
            </td>
          </tr>
          <tr>
            <th scope="row">NIF</th>
            <td>
              <Pendiente>NIF</Pendiente>
            </td>
          </tr>
          <tr>
            <th scope="row">Domicilio</th>
            <td>
              <Pendiente>domicilio completo</Pendiente>
            </td>
          </tr>
          <tr>
            <th scope="row">Correo de contacto</th>
            <td>
              <a href="mailto:info@lppstech.com">info@lppstech.com</a>
            </td>
          </tr>
          <tr>
            <th scope="row">Teléfono</th>
            <td>
              <a href="tel:+34919933823">919 93 38 23</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>2. Qué datos tratamos</h2>
      <p>Esta web no tiene formularios, no pide registro y no usa herramientas de analítica ni de publicidad. Tratamos:</p>
      <ul>
        <li>
          Los datos que nos das cuando nos llamas o nos escribes: nombre, teléfono, correo electrónico, nombre de tu negocio y
          la información que quieras compartir sobre él y sobre tu web.
        </li>
        <li>
          Los datos de contacto profesional de negocios a los que llamamos para presentarles nuestros servicios, obtenidos de
          fuentes de acceso público, como su propia web o sus fichas públicas de empresa.
        </li>
        <li>
          Datos técnicos mínimos que registra el servidor que aloja la web (dirección IP, fecha y hora, página solicitada y
          navegador), necesarios para servir la página y protegerla frente a abusos.
        </li>
      </ul>

      <h2>3. Para qué los usamos y con qué base legal</h2>
      <table>
        <tbody>
          <tr>
            <th scope="row">Atender tu llamada o tu correo</th>
            <td>
              Tu consentimiento al contactarnos y la aplicación de medidas precontractuales a petición tuya (art. 6.1.a y 6.1.b
              RGPD).
            </td>
          </tr>
          <tr>
            <th scope="row">Preparar y enseñarte tu web antes de contratar</th>
            <td>Medidas precontractuales solicitadas por ti (art. 6.1.b RGPD).</td>
          </tr>
          <tr>
            <th scope="row">Prestar el servicio si lo contratas, facturar y cumplir obligaciones legales</th>
            <td>Ejecución del contrato y cumplimiento de obligaciones legales (art. 6.1.b y 6.1.c RGPD).</td>
          </tr>
          <tr>
            <th scope="row">Llamar a negocios para presentarles nuestros servicios</th>
            <td>
              Interés legítimo en dar a conocer nuestra actividad a otros negocios (art. 6.1.f RGPD), dentro de los límites
              de la Ley 11/2022, General de Telecomunicaciones (ver el apartado siguiente). Puedes oponerte en cualquier
              momento y no volveremos a contactarte.
            </td>
          </tr>
          <tr>
            <th scope="row">Mantener la web segura</th>
            <td>Interés legítimo en garantizar la seguridad del sitio (art. 6.1.f RGPD).</td>
          </tr>
        </tbody>
      </table>
      <p>No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos.</p>

      <h2>4. Llamadas comerciales</h2>
      <p>
        Para presentar nuestros servicios llamamos a teléfonos de contacto de empresas y negocios publicados por ellos mismos
        para recibir llamadas comerciales. Cumplimos el artículo 66.1.b de la Ley 11/2022, de 28 de junio, General de
        Telecomunicaciones: no hacemos llamadas comerciales a personas físicas, autónomos incluidos, salvo que nos hayan dado
        su consentimiento previo o exista otra base legal que lo permita.
      </p>
      <p>
        Antes de llamar consultamos la lista de exclusión publicitaria Lista Robinson y no llamamos a quien figura en ella ni a
        quien nos ha pedido que no le llamemos. En cada llamada nos identificamos, te explicamos para qué te llamamos y te
        recordamos que puedes oponerte. Si no quieres que volvamos a llamarte, dínoslo en la propia llamada o escríbenos a{" "}
        <a href="mailto:info@lppstech.com">info@lppstech.com</a>.
      </p>

      <h2>5. Cuánto tiempo los conservamos</h2>
      <ul>
        <li>
          Si no llegas a contratar, conservamos tus datos de contacto el tiempo necesario para atender tu solicitud y, como
          máximo, un año desde el último contacto.
        </li>
        <li>
          Si contratas, durante la relación comercial y después durante los plazos que exige la ley (por ejemplo, seis años
          para la documentación contable y fiscal).
        </li>
        <li>Si te opones a recibir llamadas, guardamos solo lo imprescindible para no volver a llamarte.</li>
        <li>Los registros técnicos del servidor se conservan durante el tiempo que fija el proveedor de alojamiento.</li>
      </ul>

      <h2>6. Con quién los compartimos</h2>
      <p>
        No vendemos ni cedemos tus datos. Solo acceden a ellos los proveedores que necesitamos para trabajar (alojamiento de
        la web, correo electrónico y telefonía), como encargados del tratamiento y con contrato conforme al artículo 28 del
        RGPD. También los comunicaremos a las administraciones públicas cuando la ley nos obligue.
      </p>
      <p>
        Si algún proveedor estuviera fuera del Espacio Económico Europeo, solo trabajaremos con él si ofrece garantías
        adecuadas, como una decisión de adecuación de la Comisión Europea o las cláusulas contractuales tipo.
      </p>

      <h2>7. Tus derechos</h2>
      <p>Puedes ejercer en cualquier momento, sin coste, los derechos de:</p>
      <ul>
        <li>acceso a tus datos;</li>
        <li>rectificación de los datos inexactos;</li>
        <li>supresión cuando ya no sean necesarios;</li>
        <li>oposición al tratamiento, incluidas las llamadas comerciales;</li>
        <li>limitación del tratamiento;</li>
        <li>portabilidad de los datos que nos hayas facilitado;</li>
        <li>retirada del consentimiento, sin que afecte a lo tratado antes.</li>
      </ul>
      <p>
        Escríbenos a <a href="mailto:info@lppstech.com">info@lppstech.com</a> indicando qué derecho quieres ejercer. Si no
        estás conforme con nuestra respuesta, puedes reclamar ante la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" rel="noopener noreferrer" target="_blank">
          www.aepd.es
        </a>
        ).
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a pérdidas, accesos no autorizados
        o alteraciones. La web se sirve mediante conexión cifrada (HTTPS).
      </p>

      <h2>9. Menores</h2>
      <p>Nuestros servicios se dirigen a negocios y profesionales. No tratamos de forma consciente datos de menores de 14 años.</p>

      <h2>10. Cambios en esta política</h2>
      <p>
        Si cambiamos la forma de tratar tus datos, actualizaremos esta página e indicaremos la fecha de la última
        modificación.
      </p>
    </LegalPage>
  );
}

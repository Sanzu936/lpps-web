import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { withBase } from "@/config/site";

/**
 * Campo pendiente de rellenar por el titular. Búscalo en el código por "Pendiente".
 * Los únicos huecos de la web son los datos del titular en las páginas legales.
 */
export function Pendiente({ children }: { children: ReactNode }) {
  return <mark className="pendiente">[Pendiente: {children}]</mark>;
}

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="legal">
        <div className="wrap legal__wrap">
          <a className="legal__back" href={withBase("/")}>
            <span aria-hidden="true">←</span> Volver a la web
          </a>
          <h1 className="legal__title">{title}</h1>
          <p className="legal__updated">Última actualización: {updated}</p>
          <div className="legal__body">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Titular() {
  return (
    <ul>
      <li>
        Titular: <Pendiente>nombre y apellidos o razón social</Pendiente>
      </li>
      <li>
        NIF: <Pendiente>NIF</Pendiente>
      </li>
      <li>
        Domicilio: <Pendiente>domicilio completo</Pendiente>
      </li>
      <li>
        Datos registrales: <Pendiente>solo si el titular es una sociedad, registro mercantil, tomo, folio, hoja e
        inscripción; si es autónomo, borra esta línea</Pendiente>
      </li>
      <li>
        Correo electrónico: <a href="mailto:info@lppstech.com">info@lppstech.com</a>
      </li>
      <li>
        Teléfono: <a href="tel:+34919933823">919 93 38 23</a>
      </li>
      <li>Nombre comercial: LPPS</li>
      <li>Sitio web: lppstech.com</li>
    </ul>
  );
}

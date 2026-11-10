import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FoxMark from "@/components/FoxMark";
import { withBase } from "@/config/site";
import "./legal.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="legal notfound">
        <div className="wrap legal__wrap">
          <FoxMark className="notfound__fox" />
          <h1 className="legal__title">Esta página no existe.</h1>
          <p className="legal__updated">Puede que el enlace esté mal escrito o que la página ya no esté. La web principal sí está.</p>
          <a className="btn" href={withBase("/")}>
            <span className="btn__dot" aria-hidden="true" />
            <span className="btn__label">Volver a la web</span>
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}

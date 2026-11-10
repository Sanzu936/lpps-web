import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/hero/Hero";
import Tape from "@/components/Tape";
import Nosotros from "@/components/sections/Nosotros";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Trabajos from "@/components/sections/Trabajos";
import Preguntas from "@/components/sections/Preguntas";
import Contacto from "@/components/sections/Contacto";
import { EMAIL, PHONE_DISPLAY, SITE_DESCRIPTION, SITE_URL } from "@/config/site";
import "./hero.css";
import "./sections.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "LPPS",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  email: EMAIL,
  telephone: `+34 ${PHONE_DISPLAY}`,
  image: `${SITE_URL}/og.jpg`,
  knowsLanguage: "es",
  founder: [
    { "@type": "Person", name: "Pablo" },
    { "@type": "Person", name: "Lori" },
  ],
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <div className="tape-slot">
          <Tape items={["Tu web, hecha antes de pagar", "Ajustes incluidos", "Publicada en 48 horas", "Diseñada a mano"]} />
        </div>
        <Nosotros />
        <ComoFunciona />
        <Trabajos />
        <div className="tape-slot tape-slot--alt">
          <Tape
            variant="ink"
            rotate={1.8}
            reverse
            items={["Sin plantillas", "Sin sorpresas", "Sin letra pequeña", "Con nombre y teléfono"]}
          />
        </div>
        <Preguntas />
        <Contacto />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

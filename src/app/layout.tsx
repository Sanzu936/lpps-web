import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/config/site";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

const anybody = localFont({
  src: "../fonts/anybody.woff2",
  variable: "--font-anybody",
  weight: "750 900",
  style: "normal",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "60% 150%" }],
  adjustFontFallback: "Arial",
  preload: true,
});

const schibsted = localFont({
  src: "../fonts/schibsted.woff2",
  variable: "--font-schibsted",
  weight: "400 700",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "LPPS: una web montándose, del plano en líneas a la versión terminada" }],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0e2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${anybody.variable} ${schibsted.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <SmoothScroll />
      </body>
    </html>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { PHONE_HREF, PHONE_DISPLAY, withBase } from "@/config/site";
import BookingLink from "./BookingLink";
import FoxMark from "./FoxMark";

const LINKS = [
  { href: "/#nosotros", label: "Quiénes somos" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#trabajos", label: "Trabajos" },
  { href: "/#preguntas", label: "Preguntas" },
  { href: "/#contacto", label: "Contacto" },
];

export function Logo() {
  return (
    <a href={withBase("/#inicio")} className="logo" aria-label="LPPS, ir al inicio">
      <FoxMark className="logo__mark" />
      <span aria-hidden="true">LPPS</span>
    </a>
  );
}

/** Cabecera fija que cambia a tema claro u oscuro según la sección que tiene debajo. */
export default function Header({ initialTheme = "dark" }: { initialTheme?: "dark" | "light" }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const onScroll = () => {
      header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="site-header" ref={ref} data-theme={initialTheme} data-scrolled="false">
      <div className="site-header__bar glass" aria-hidden="true" />
      <div className="wrap site-header__inner">
        <Logo />
        <nav aria-label="Principal">
          <ul className="nav">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={withBase(l.href)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <a className="header-call glass" href={PHONE_HREF} aria-label={`Llamar al ${PHONE_DISPLAY}`} data-cursor="Llamar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
          </a>
          <BookingLink />
        </div>
      </div>
    </header>
  );
}

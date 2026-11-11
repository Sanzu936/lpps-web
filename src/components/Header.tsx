"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHONE_HREF, PHONE_DISPLAY, EMAIL, EMAIL_HREF, withBase } from "@/config/site";
import BookingLink from "./BookingLink";
import FoxMark from "./FoxMark";
import { getLenis } from "@/lib/scroll";

const LINKS = [
  { href: "/#nosotros", label: "Quiénes somos" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#trabajos", label: "Trabajos" },
  { href: "/#preguntas", label: "Preguntas" },
  { href: "/#contacto", label: "Contacto" },
];

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export function Logo() {
  return (
    <a href={withBase("/#inicio")} className="logo" aria-label="LPPS, ir al inicio">
      <FoxMark className="logo__mark" />
      <span aria-hidden="true">LPPS</span>
    </a>
  );
}

/** Cabecera fija: al bajar, aparece su barra de cristal. En móvil, menú a pantalla completa. */
export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Menú abierto: Esc cierra, el foco entra en el panel y no se puede tabular fuera de él
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current!;
    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>("a[href], button"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const f = [toggleRef.current!, ...focusables()];
        const i = f.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : i === f.length - 1 ? 0 : i + 1;
        e.preventDefault();
        f[next]?.focus();
      }
    };
    const onResize = () => window.matchMedia("(min-width: 1000px)").matches && close(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.documentElement.classList.add("menu-open");
    getLenis()?.stop();
    return () => {
      getLenis()?.start();
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open, close]);

  return (
    <header className="site-header" ref={ref} data-scrolled="false" data-menu={open ? "open" : "closed"}>
      <div className="site-header__bar glass glass--liquid" aria-hidden="true" />
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
            <PhoneIcon />
          </a>
          <BookingLink />
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle glass"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar el menú" : "Abrir el menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-toggle__bars" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id="menu-movil" ref={panelRef} className="menu-panel" hidden={!open}>
        <nav aria-label="Menú">
          <ul className="menu-panel__links">
            {LINKS.map((l, i) => (
              <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                <a href={withBase(l.href)} onClick={() => close(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-panel__actions">
          <a className="btn btn--ghost" href={PHONE_HREF} onClick={() => close(false)}>
            <PhoneIcon />
            <span className="btn__label">{PHONE_DISPLAY}</span>
          </a>
          <a className="menu-panel__mail" href={EMAIL_HREF}>
            {EMAIL}
          </a>
        </div>
      </div>
    </header>
  );
}

import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, withBase } from "@/config/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p>© {year} LPPS. Webs diseñadas y programadas por Pablo y Lori.</p>
        <nav aria-label="Legal y contacto">
          <ul>
            <li>
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            </li>
            <li>
              <a href={EMAIL_HREF}>{EMAIL}</a>
            </li>
            <li>
              <a href={withBase("/aviso-legal/")}>Aviso legal</a>
            </li>
            <li>
              <a href={withBase("/privacidad/")}>Política de privacidad</a>
            </li>
            <li>
              <a href={withBase("/cookies/")}>Política de cookies</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

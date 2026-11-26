# Páginas ocultas

Las carpetas que empiezan por `_` no generan rutas en Next.js: estas páginas no se publican
ni se puede entrar en ellas, pero el texto se conserva.

- `aviso-legal/`: aviso legal (faltan los datos del titular, marcados como `[Pendiente: …]`).
- `privacidad/`: política de privacidad (faltan los datos del responsable).

## Para volver a publicarlas
1. Rellena los datos pendientes.
2. Mueve cada carpeta a `src/app/` (`src/app/aviso-legal/`, `src/app/privacidad/`) y cambia en
   cada `page.tsx` `import "../../legal.css"` por `import "../legal.css"`.
3. Pon `LEGAL_COMPLETO = true` en `src/config/site.ts` (vuelven los enlaces del pie y el sitemap).
4. `npm run build`.

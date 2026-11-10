# LPPS · lppstech.com

Web de LPPS: una sola página (con transición 3D, scroll horizontal, mockups y antes/después) y tres páginas legales. Next.js con exportación estática: el resultado es HTML, CSS y JS que se sube a cualquier hosting.

## Ejecutar en local

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
```

## Generar la versión para publicar

```bash
npm run build      # genera la carpeta out/
npm start          # (opcional) sirve out/ en http://localhost:3000 para revisarla
```

## Desplegar

Sube **el contenido de la carpeta `out/`** a la raíz pública de tu hosting (`public_html`, `www`, etc.) por FTP o desde el gestor de archivos. No necesita Node ni base de datos. Cada página va en su carpeta con `index.html` (`/aviso-legal/`, `/privacidad/`, `/cookies/`), así que funciona en cualquier servidor (Apache, Nginx, Netlify, Vercel, Cloudflare Pages…).

## Cambiar el destino de «Agendar llamada»

Todos los botones «Agendar llamada» usan una sola constante en **`src/config/site.ts`**:

```ts
export const BOOKING_HREF = "#contacto";
```

Cámbiala por la URL de vuestra agenda (Calendly, Cal.com, Google Calendar…) y vuelve a ejecutar `npm run build`. Si es una URL externa, se abre en una pestaña nueva automáticamente. En ese mismo archivo están el teléfono y el correo.

## Datos legales pendientes

Solo faltan los datos del titular. Están marcados en amarillo como **[Pendiente: …]** en:

- `src/components/Legal.tsx` (componente `Titular`, usado en el aviso legal): nombre o razón social, NIF y domicilio.
- `src/app/privacidad/page.tsx` (tabla «Responsable del tratamiento»): nombre o razón social, NIF y domicilio.

Sustituye cada `<Pendiente>…</Pendiente>` por el dato real (texto normal) y genera de nuevo la web.

## Añadir proyectos de muestra a «Trabajos»

Los datos de la sección están en **`src/content/trabajos.ts`**. Mientras no haya proyectos de muestra, los mockups enseñan esta misma web y el antes/después compara su versión en plano con la terminada.

Para añadir un proyecto:

1. Guarda en `public/trabajos/` dos capturas de página completa (`.avif` y `.webp` con el mismo nombre): escritorio de unos 1000 px de ancho y móvil de unos 390 px.
2. Añade un objeto a `TRABAJOS` con `muestra: true`. Así aparece la etiqueta «Proyecto de muestra».
3. Para el antes/después, cambia `ANTES_DESPUES` con las dos capturas.

Las capturas de esta web se regeneran con `npm run capturas`, con la web servida en `http://localhost:4321`:

```bash
npm run build
npx serve out -l 4321
```

```bash
npm run capturas
npm run build
```

## Herramientas incluidas

- `scripts/gen-images.mjs`: genera imágenes con OpenRouter en el momento de construir. La clave se lee de `OPENROUTER_API_KEY` (ver `.env.example`) y nunca se guarda en el código.
- `scripts/fonts.sh`: recorta las tipografías a los glifos del español y a los rangos de peso y anchura que se usan.
- `scripts/assets.mjs`: textura de grano, favicon e icono.
- `scripts/signatures.mjs`: trazados de las firmas manuscritas (tipografía EMS Allure, licencia OFL).

## Tecnología

Next.js 15 (exportación estática), GSAP + ScrollTrigger y Lenis (cargados tras el primer pintado), Three.js con React Three Fiber y shaders GLSL propios para el fondo 3D. Sin cookies ni analítica de terceros.

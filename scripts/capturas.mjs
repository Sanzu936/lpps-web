// Genera las capturas de la sección Trabajos a partir de la propia web compilada.
// Uso: npm run build && npx serve out -l 4321 & node scripts/capturas.mjs [http://localhost:4321]
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:4321";
const OUT = "public/trabajos";
mkdirSync(OUT, { recursive: true });

const PLANO_CSS = `
  .hero__canvas, .grain, .cursor, .tape, .flip, .hero__flare, .ambient, .site-header__bar { display: none !important; }
  *, *::before, *::after { color: transparent !important; -webkit-text-stroke: 0 !important; text-shadow: none !important;
    box-shadow: none !important; background-color: transparent !important; background-image: none !important;
    fill: transparent !important; stroke: transparent !important; animation: none !important; backdrop-filter: none !important; }
  html, body, .hero, .hero__stage { background: #03050b !important; }
  .hero__grid { display: block !important; opacity: 1 !important;
    background-image: repeating-linear-gradient(90deg, rgba(91,196,226,.16) 0 1px, transparent 1px calc((100% - 2 * var(--gutter)) / 12)),
      repeating-linear-gradient(0deg, rgba(91,196,226,.1) 0 1px, transparent 1px 64px) !important; }
  h1, h2, h3, p, li, .btn, .logo, .nav a, .header-call, .elastic, .signature { outline: 1px dashed rgba(91,196,226,.75) !important; outline-offset: 6px; }
  .reveal-line > span, .partner__text, .partner__role, .partner__tasks li, .lede, .direct__lead, .direct__number {
    background-image: linear-gradient(rgba(91,196,226,.22), rgba(91,196,226,.22)) !important; background-repeat: no-repeat !important;
    background-size: 100% 0.62em !important; background-position: 0 58% !important; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .elastic text { fill: transparent !important; stroke: rgba(91,196,226,.6) !important; stroke-width: 1.5px; }
  .hero__ch, .hero__sub-text, .hero__note-text, .nav a, .btn__label, .logo span, .hero__log-line {
    background-image: linear-gradient(rgba(91,196,226,.22), rgba(91,196,226,.22)) !important; background-repeat: no-repeat !important;
    background-size: 100% 0.62em !important; background-position: 0 58% !important; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .logo__mark path { stroke: rgba(91,196,226,.8) !important; stroke-width: 1.5px; }
  .hero__log-line:not(:last-child) { display: none !important; }
  .hero__log-line { opacity: 1 !important; }
  .btn { box-shadow: inset 0 0 0 1px rgba(91,196,226,.7) !important; }
`;

async function shot(page, file, width) {
  const buf = await page.screenshot({ fullPage: file === "lpps-escritorio" || file === "lpps-movil" });
  const img = sharp(buf).resize({ width, withoutEnlargement: true });
  const meta = await img.clone().toBuffer({ resolveWithObject: true });
  await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/${file}.avif`);
  await img.clone().webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${file}.webp`);
  return { src: `/trabajos/${file}`, width: meta.info.width, height: meta.info.height };
}

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const res = {};

async function open(viewport, mobile) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector('.hero__canvas[data-ready="true"]', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
  // La sección de trabajos no se incluye en sus propias capturas.
  await page.addStyleTag({ content: "#trabajos, #trabajos + .tape-slot { display: none !important; } .cursor { display: none !important; }" });
  return page;
}

let page = await open({ width: 1440, height: 900 }, false);
// Encuadre denso: desde los nombres de los socios (nombre elástico, firma, rol y tareas)
const toNosotros = () =>
  page.evaluate(() => window.scrollTo(0, document.querySelector("#nosotros .partners").getBoundingClientRect().top + scrollY - 48));
res.escritorio = await shot(page, "lpps-escritorio", 1000);
// antes / después: la sección "Quiénes somos" terminada y en fase de plano, con el mismo
// encuadre en las dos (sin cabecera, sin hero ni cintas que se cuelen por arriba)
const AISLAR = ".site-header,.hero,.tape-slot{display:none!important}";
await page.addStyleTag({ content: AISLAR });
await page.evaluate(() => window.dispatchEvent(new Event("resize")));
await page.waitForTimeout(600);
await toNosotros();
await page.waitForTimeout(900);
res.final = await shot(page, "lpps-final", 1440);
await page.addStyleTag({ content: PLANO_CSS });
await toNosotros();
await page.waitForTimeout(400);
res.plano = await shot(page, "lpps-plano", 1440);
await page.context().close();

page = await open({ width: 390, height: 844 }, true);
res.movil = await shot(page, "lpps-movil", 390);
await page.addStyleTag({ content: AISLAR });
await page.evaluate(() => window.dispatchEvent(new Event("resize")));
await page.waitForTimeout(600);
await toNosotros();
await page.waitForTimeout(900);
res.finalMovil = await shot(page, "lpps-final-movil", 390);
await page.addStyleTag({ content: PLANO_CSS });
await toNosotros();
await page.waitForTimeout(400);
res.planoMovil = await shot(page, "lpps-plano-movil", 390);
await page.context().close();

// Imagen Open Graph a 1200×630 nativo (sin recortes)
page = await open({ width: 1200, height: 630 }, false);
await page.addStyleTag({
  content: ".site-header,.hero__note,.hero__hint,.hero__log,.tape-slot{display:none!important} .hero__content{padding-top:48px!important;padding-bottom:56px!important} .hero__title{font-size:104px!important}",
});
await page.waitForTimeout(300);
await sharp(await page.screenshot()).jpeg({ quality: 82, mozjpeg: true }).toFile("public/og.jpg");
await page.context().close();

await browser.close();
writeFileSync("src/content/capturas.json", JSON.stringify(res, null, 2) + "\n");
console.log(res);

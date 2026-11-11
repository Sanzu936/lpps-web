// Capturas de las webs de muestra para la sección Trabajos.
// Las muestras viven ya compiladas en public/trabajos/<slug>/. Sirve la carpeta public y lanza el script:
//   python3 -m http.server 4322 -d public &   (o: npx serve public -l 4322)
//   node scripts/capturas-muestras.mjs [http://localhost:4322]
// Genera public/trabajos/<slug>-escritorio y <slug>-movil (.avif y .webp) y src/content/capturas-muestras.json.
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:4322";
const OUT = "public/trabajos";
const SLUGS = (process.env.SLUGS || "sigila,oquedad,candela").split(",");
// Alto máximo de la captura (en px de la imagen final). Las pantallas recorren la imagen
// con scroll interno, así que basta con las primeras secciones de cada web.
const MAX = { escritorio: 5200, movil: 5600 };

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const res = {};

async function capture(slug, kind) {
  const mobile = kind === "movil";
  const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/trabajos/${slug}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  // Recorre la página para que carguen las imágenes diferidas y se disparen las entradas.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += viewport.height * 0.6) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  // Sin cursores propios ni avisos de cookies flotando sobre la captura.
  // overflow: clip en html/body hace que la captura de página completa solo coja la pantalla visible.
  await page.addStyleTag({ content: "body [class*=cursor]{display:none!important} html,body{overflow:visible!important}" });
  const buf = await page.screenshot({ fullPage: true });
  await ctx.close();

  const width = mobile ? 390 : 1000;
  const resized = await sharp(buf).resize({ width, withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
  const height = Math.min(resized.info.height, MAX[kind]);
  const img = sharp(resized.data).extract({ left: 0, top: 0, width: resized.info.width, height });
  const file = `${slug}-${kind}`;
  await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/${file}.avif`);
  await img.clone().webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${file}.webp`);
  console.log(file, resized.info.width, "x", height);
  return { src: `/trabajos/${file}`, width: resized.info.width, height };
}

for (const slug of SLUGS) {
  res[slug] = { escritorio: await capture(slug, "escritorio"), movil: await capture(slug, "movil") };
}
await browser.close();
writeFileSync("src/content/capturas-muestras.json", JSON.stringify(res, null, 2) + "\n");

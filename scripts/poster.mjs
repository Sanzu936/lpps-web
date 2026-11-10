// Genera el póster del fondo 3D del hero (se ve hasta que arranca el WebGL).
// Uso: con la web servida en http://localhost:4321 -> node scripts/poster.mjs
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.argv[2] || "http://localhost:4321";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [name, vp, mobile, width] of [
  ["escritorio", { width: 1440, height: 900 }, false, 1440],
  ["movil", { width: 390, height: 844 }, true, 780],
]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(1200);
  // un gesto pone en marcha el 3D; luego se deja que el foco recorra solo la rejilla
  if (mobile) await page.touchscreen.tap(vp.width * 0.7, vp.height * 0.3);
  else await page.mouse.move(vp.width * 0.72, vp.height * 0.32);
  await page.waitForSelector('.hero__canvas[data-ready="true"]', { timeout: 20000 });
  await page.waitForTimeout(5000);
  await page.addStyleTag({ content: ".hero__content,.hero__hint,.hero__flare,.site-header,.grain,.cursor,.hero__canvas::after{display:none!important} .hero__canvas::after{content:none!important}" });
  await page.waitForTimeout(300);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, ...vp } });
  await sharp(buf).resize({ width }).webp({ quality: 62, effort: 6 }).toFile(`src/assets/hero-poster-${name}.webp`);
  await ctx.close();
}
await browser.close();
console.log("ok");

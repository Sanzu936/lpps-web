// Versiones reducidas de las capturas que se ven dentro de las pantallas de Trabajos.
// Las pantallas miden como mucho ~690 px (portátil) y ~220 px (móvil): con srcset cada
// dispositivo descarga y descomprime solo el tamaño que necesita, sin perder nitidez.
// Se ejecuta solo al final de scripts/capturas.mjs y scripts/capturas-muestras.mjs.
import sharp from "sharp";
import { readdirSync } from "node:fs";

export const ANCHOS = { escritorio: [450, 700], movil: [180, 260] };
const DIR = "public/trabajos";

export async function variantes() {
  const files = readdirSync(DIR).filter((f) => /-(escritorio|movil)\.webp$/.test(f) && !/-(final|plano)-movil/.test(f));
  for (const f of files) {
    const kind = f.includes("-escritorio") ? "escritorio" : "movil";
    const base = f.replace(/\.webp$/, "");
    for (const w of ANCHOS[kind]) {
      const img = sharp(`${DIR}/${f}`, { limitInputPixels: false }).resize({ width: w });
      await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${DIR}/${base}-${w}.avif`);
      await img.clone().webp({ quality: 74, effort: 6 }).toFile(`${DIR}/${base}-${w}.webp`);
    }
    console.log("variantes", base, ANCHOS[kind].join(", "));
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await variantes();

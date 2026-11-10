// Genera trazados SVG de un solo trazo (fuente EMS Allure, OFL) para las firmas.
import { readFileSync, writeFileSync } from "node:fs";
const svg = readFileSync("node_modules/hersheytext/svg_fonts/EMSAllure.svg", "utf8");
const glyphs = {};
for (const m of svg.matchAll(/<glyph unicode="([^"]+)"[^>]*?horiz-adv-x="([\d.]+)"(?: d="([^"]*)")?/g)) {
  glyphs[m[1]] = { adv: parseFloat(m[2]), d: m[3] || "" };
}
function path(text, kern = -25) {
  let x = 0;
  const parts = [];
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (const ch of text) {
    const g = glyphs[ch];
    if (!g) continue;
    const d = g.d.replace(/([ML])\s*([-\d.]+)\s+([-\d.]+)/g, (_, c, px, py) => {
      const nx = +(parseFloat(px) + x).toFixed(1);
      const ny = +(800 - parseFloat(py)).toFixed(1);
      minX = Math.min(minX, nx); maxX = Math.max(maxX, nx); minY = Math.min(minY, ny); maxY = Math.max(maxY, ny);
      return `${c}${nx} ${ny}`;
    });
    parts.push(d);
    x += g.adv + kern;
  }
  const pad = 20;
  return { d: parts.join(" "), viewBox: `${(minX - pad).toFixed(0)} ${(minY - pad).toFixed(0)} ${(maxX - minX + pad * 2).toFixed(0)} ${(maxY - minY + pad * 2).toFixed(0)}` };
}
const out = { pablo: path("Pablo"), lori: path("Lori") };
writeFileSync("src/components/signatures.json", JSON.stringify(out, null, 0));
console.log(out.pablo.viewBox, out.lori.viewBox, out.pablo.d.length);

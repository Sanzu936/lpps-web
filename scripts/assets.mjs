// Genera recursos estáticos propios: grano, favicon e iconos.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

// Grano: ruido monocromo con transparencia
const S = 128;
const buf = Buffer.alloc(S * S * 4);
for (let i = 0; i < S * S; i++) {
  const v = Math.random() * 255;
  buf[i * 4] = v;
  buf[i * 4 + 1] = v;
  buf[i * 4 + 2] = v;
  buf[i * 4 + 3] = 90 + Math.random() * 120;
}
await sharp(buf, { raw: { width: S, height: S, channels: 4 } }).png({ compressionLevel: 9, palette: true, colors: 12 }).toFile("src/assets/grain.png");

import fox from "../src/components/fox-paths.json" with { type: "json" };
const [vx, vy, vw, vh] = fox.viewBox.split(" ").map(Number);
const side = Math.max(vw, vh) * 1.18;
const ox = vx - (side - vw) / 2;
const oy = vy - (side - vh) / 2;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ox.toFixed(1)} ${oy.toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}">
  <rect x="${ox.toFixed(1)}" y="${oy.toFixed(1)}" width="${side.toFixed(1)}" height="${side.toFixed(1)}" rx="${(side * 0.22).toFixed(1)}" fill="#03050b"/>
  <path d="${fox.white}" fill="#edf2fa"/><path d="${fox.navy}" fill="#20508e"/><path d="${fox.sky}" fill="#5bc4e2"/>
</svg>`;
writeFileSync("src/app/icon.svg", icon);
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile("src/app/apple-icon.png");
console.log("ok");

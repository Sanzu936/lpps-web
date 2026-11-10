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
await sharp(buf, { raw: { width: S, height: S, channels: 4 } }).png({ compressionLevel: 9, palette: true, colors: 12 }).toFile("public/grain.png");

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0c0e2b"/>
  <rect x="14" y="14" width="16" height="16" rx="3" fill="#eef0f4"/>
  <rect x="34" y="14" width="16" height="16" rx="3" fill="#ffd21f"/>
  <rect x="14" y="34" width="16" height="16" rx="3" fill="#eef0f4"/>
  <rect x="34" y="34" width="16" height="16" rx="3" fill="#eef0f4"/>
</svg>`;
writeFileSync("src/app/icon.svg", icon);
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile("src/app/apple-icon.png");
console.log("ok");

// Genera imágenes con un modelo de imagen de OpenRouter, SOLO en el momento de construir.
// La clave se lee de OPENROUTER_API_KEY (o la inyecta un proxy de red) y nunca se escribe en disco.
//
// Uso:
//   node scripts/gen-images.mjs encargos.json [carpeta-salida]
// encargos.json: [{ "id": "hero-ceramica", "ratio": "16:9", "prompt": "..." }, ...]
//
// Nota: Node 22 solo usa el proxy HTTPS del sistema con NODE_USE_ENV_PROXY=1.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";

const [jobsFile, outDir = "public/generadas"] = process.argv.slice(2);
if (!jobsFile) {
  console.error("Uso: node scripts/gen-images.mjs encargos.json [carpeta-salida]");
  process.exit(1);
}
const MODEL = process.env.OR_IMAGE_MODEL || "google/gemini-3-pro-image";
const KEY = process.env.OPENROUTER_API_KEY || "proxy";
const STYLE = "Absolutely no people, no hands, no faces, no text, no logos, no watermarks.";
const jobs = JSON.parse(await readFile(jobsFile, "utf8"));
await mkdir(outDir, { recursive: true });

const exists = (p) => access(p).then(() => true, () => false);
for (const job of jobs) {
  const file = path.join(outDir, `${job.id}.png`);
  if ((await exists(file)) && !process.env.FORCE) continue;
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      modalities: ["image", "text"],
      image_config: { aspect_ratio: job.ratio || "1:1" },
      messages: [{ role: "user", content: `${job.prompt} ${STYLE}` }],
    }),
  });
  const json = await res.json().catch(() => ({}));
  const url = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!res.ok || !url?.startsWith("data:image")) {
    console.error(`Error en ${job.id} (${res.status})`);
    continue;
  }
  await writeFile(file, Buffer.from(url.split(",")[1], "base64"));
  console.log("ok", job.id);
}

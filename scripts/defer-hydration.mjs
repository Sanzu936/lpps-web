// Tras `next build`: los scripts de Next se piden después del primer pintado, no antes.
// Así el texto del hero se pinta sin competir con la descarga y la evaluación de React
// en móviles lentos. La hidratación arranca un fotograma más tarde; nada más cambia.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const SCRIPT = /<script src="([^"]*\/_next\/static\/chunks\/[^"]+\.js)"((?: id="[^"]*")?) async=""><\/script>/g;
const PRELOAD = /<link rel="preload" as="script" fetchPriority="low" href="[^"]+"\/>/g;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

let n = 0;
for (const file of walk(OUT)) {
  let html = readFileSync(file, "utf8");
  const list = [];
  html = html.replace(SCRIPT, (_, src, id) => {
    const m = id.match(/id="([^"]*)"/);
    list.push(m ? [src, m[1]] : [src]);
    return "";
  });
  if (!list.length) continue;
  html = html.replace(PRELOAD, "");
  const loader =
    `<script>(function(){var l=${JSON.stringify(list)};function go(){l.forEach(function(x){var s=document.createElement("script");s.src=x[0];if(x[1])s.id=x[1];s.async=true;document.head.appendChild(s)})}` +
    // Arranca en cuanto hay primer pintado (o a los 1,5 s si el navegador no lo informa).
    `var d=0;function once(){if(!d){d=1;setTimeout(go,0)}}setTimeout(once,1500);` +
    `try{new PerformanceObserver(function(e){if(e.getEntriesByName("first-contentful-paint").length)once()}).observe({type:"paint",buffered:true})}catch(_){requestAnimationFrame(function(){requestAnimationFrame(once)})}})()</script>`;
  html = html.replace("</body>", `${loader}</body>`);
  writeFileSync(file, html);
  n++;
}
console.log(`defer-hydration: ${n} páginas`);

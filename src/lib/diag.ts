/**
 * Modo diagnóstico (solo si la dirección lo pide; quien entra normalmente no nota nada).
 *   ?sin=3d,cristal,scroll,transicion,grano,cursor   (o ?sin=todo)   y   ?fps
 * Sirve para probar en un móvil u ordenador reales qué efecto provoca los tirones.
 */
export const DIAG_KEYS = ["3d", "cristal", "scroll", "transicion", "grano", "cursor"] as const;
export type DiagKey = (typeof DIAG_KEYS)[number];

declare global {
  interface Window {
    __lppsSin?: string[];
  }
}

export const sin = (k: DiagKey) => typeof window !== "undefined" && !!window.__lppsSin?.includes(k);

/** CSS de cada interruptor. Lo inserta el script en línea del layout antes del primer pintado. */
export const DIAG_CSS: Record<DiagKey, string> = {
  "3d": "",
  cristal: "*,*::before,*::after{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}",
  scroll: "",
  transicion:
    ".hero{height:auto!important}.hero__stage{position:relative!important}.hero+.tape-slot{margin-top:0!important}.flip{display:none!important}",
  grano: ".grain,.ambient{display:none!important}",
  cursor: ".cursor{display:none!important}",
};

/** Script en línea: lee ?sin= y deja las banderas en window.__lppsSin + su CSS. */
export const diagScript = `(function(){try{var q=new URLSearchParams(location.search),s=q.get("sin");if(!s&&!q.has("fps"))return;var k=${JSON.stringify(
  DIAG_KEYS
)},c=${JSON.stringify(DIAG_CSS)};var l=(s||"").split(",").map(function(x){return x.trim().toLowerCase()});if(l.indexOf("todo")>-1)l=k.slice();window.__lppsSin=l;var css=l.map(function(x){return c[x]||""}).join("");if(css){var st=document.createElement("style");st.id="lpps-diag";st.textContent=css;document.head.appendChild(st)}}catch(e){}})()`;

/* Sigila · escena del hero renderizada en un Web Worker con OffscreenCanvas.
   Todo el WebGL (compilación y dibujo) ocurre fuera del hilo principal, así que
   la página sigue respondiendo aunque la GPU del dispositivo sea lenta.
   Cadena de eslabones de cristal (facturas encadenadas de Verifactu) y un sello
   de lacre con el símbolo de Sigila, en un único fragment shader con raymarching. */
"use strict";

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;
const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;     // -1..1 suavizado
uniform float uScroll;   // 0..1 progreso del hero
uniform float uHalf;     // (eslabones-1)/2
uniform int uSteps;
uniform float uMobile;   // 0 escritorio, 1 móvil (encuadre)

const float LE = 0.34;   // tramo recto del eslabón
const float R1 = 0.30;   // radio del eslabón
const float R2 = 0.082;  // grosor del alambre
const float D  = 1.13;   // separación entre eslabones (entrelazados)
const float PI = 3.14159265;

const vec3 INK    = vec3(0.051, 0.031, 0.125);
const vec3 LACRE  = vec3(1.0, 0.18, 0.494);
const vec3 HONDO  = vec3(0.62, 0.05, 0.27);
const vec3 AMBAR  = vec3(1.0, 0.70, 0.243);
const vec3 VIDRIO = vec3(0.486, 0.91, 1.0);

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }

// Paleta coseno: lacre → ámbar → vidrio (iridiscencia)
vec3 irid(float t){
  return 0.5 + 0.5 * cos(6.2831 * (t + vec3(0.0, 0.33, 0.67)) + vec3(0.0, 0.6, 1.4));
}

// Hash entero (sin el truco del seno, estable entre GPUs)
float hash12(vec2 p){
  uvec2 q = uvec2(ivec2(floor(p))) * uvec2(1597334673u, 3812015801u);
  uint n = (q.x ^ q.y) * 1597334673u;
  return float(n) * (1.0 / 4294967295.0);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x),
             mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
}

// ── Cadena ────────────────────────────────────────────────────────────────
vec3 chainSpace(vec3 p){
  float t = uTime;
  // la cadena se retuerce con el scroll y con el ratón
  p.yz = rot(t * 0.12 + uScroll * 2.6 + uMouse.x * 0.5) * p.yz;
  p.xy = rot(-0.32 + uMouse.y * 0.12 + uScroll * 0.35) * p.xy;
  // ondulación suave (curvatura del dominio, Lipschitz bajo)
  p.y -= 0.22 * sin(p.x * 0.55 + t * 0.7) * (1.0 - 0.5 * uScroll);
  p.z -= 0.16 * cos(p.x * 0.42 + t * 0.5);
  return p;
}

float sdLink(vec3 q){
  vec3 r = vec3(max(abs(q.x) - LE, 0.0), q.y, q.z);
  return length(vec2(length(r.xy) - R1, r.z)) - R2;
}

float linkAt(vec3 p, float i){
  vec3 q = p - vec3(i * D, 0.0, 0.0);
  if (mod(i + 64.0, 2.0) > 0.5) q.yz = vec2(q.z, -q.y); // giro de 90° alterno
  return sdLink(q);
}

// devuelve distancia y el índice del eslabón más cercano
vec2 sdChain(vec3 p){
  vec3 c = chainSpace(p);
  float i = clamp(floor(c.x / D + 0.5), -uHalf, uHalf);
  float d0 = linkAt(c, i);
  float d1 = linkAt(c, clamp(i - 1.0, -uHalf, uHalf));
  float d2 = linkAt(c, clamp(i + 1.0, -uHalf, uHalf));
  float d = d0; float id = i;
  if (d1 < d){ d = d1; id = clamp(i - 1.0, -uHalf, uHalf); }
  if (d2 < d){ d = d2; id = clamp(i + 1.0, -uHalf, uHalf); }
  return vec2(d * 0.85, id);
}

// ── Sello de lacre con el símbolo de Sigila ──────────────────────────────
vec3 sealSpace(vec3 p){
  vec3 sp = uMobile > 0.5 ? vec3(0.15, 0.55, 0.9) : vec3(1.35, -0.15, 0.9);
  p -= sp;
  p.xz = rot(uMouse.x * 0.45 + sin(uTime * 0.4) * 0.12) * p.xz;
  p.yz = rot(-uMouse.y * 0.3 + 0.18) * p.yz;
  p.xy = rot(uTime * 0.05 - uScroll * 0.8) * p.xy;
  return p;
}

float arcPiece(vec2 p, vec2 c, float r, float w, float top){
  vec2 q = p - c;
  float d = abs(length(q) - r) - w;
  // el arco superior pierde su cuarto inferior derecho; el inferior, el superior izquierdo
  float cut = top > 0.5 ? max(-q.x, q.y) : max(q.x, -q.y);
  return max(d, -cut);
}

float glyph(vec2 p){
  float g = arcPiece(p, vec2(0.0, 0.125), 0.125, 0.03, 1.0);
  g = min(g, arcPiece(p, vec2(0.0, -0.125), 0.125, 0.03, 0.0));
  vec2 dp = abs(p - vec2(0.24, 0.24));
  g = min(g, (dp.x + dp.y) - 0.05); // rombo: la huella
  return g;
}

float sdSeal(vec3 p){
  vec3 q = sealSpace(p);
  float a = atan(q.y, q.x);
  float r = length(q.xy);
  float rad = 0.74 + 0.035 * sin(a * 7.0 + 1.3) + 0.022 * sin(a * 13.0 + 0.4) + 0.012 * sin(a * 23.0);
  vec2 d = vec2(r - rad, abs(q.z) - 0.1);
  float disc = min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - 0.07;
  // relieve: anillo hundido y símbolo en resalte en la cara frontal
  float ring = abs(r - 0.54) - 0.022;
  float face = smoothstep(-0.02, 0.08, q.z);
  float relief = -0.018 * smoothstep(0.012, -0.004, ring) + 0.028 * smoothstep(0.012, -0.006, glyph(q.xy * 1.15));
  return (disc - relief * face) * 0.9;
}

// x: distancia, y: material (1 cristal, 2 lacre), z: índice de eslabón
vec3 map(vec3 p){
  vec2 ch = sdChain(p);
  float s = sdSeal(p);
  return s < ch.x ? vec3(s, 2.0, 0.0) : vec3(ch.x, 1.0, ch.y);
}

vec3 calcNormal(vec3 p){
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.0015;
  return normalize(k.xyy * map(p + k.xyy * h).x + k.yyx * map(p + k.yyx * h).x +
                   k.yxy * map(p + k.yxy * h).x + k.xxx * map(p + k.xxx * h).x);
}

vec3 env(vec3 rd){
  vec3 col = mix(lin(INK) * 0.6, lin(vec3(0.12, 0.06, 0.26)), smoothstep(-0.6, 0.8, rd.y));
  col += lin(LACRE) * 0.55 * pow(max(dot(rd, normalize(vec3(0.6, -0.25, -1.0))), 0.0), 6.0);
  col += lin(VIDRIO) * 0.35 * pow(max(dot(rd, normalize(vec3(-0.7, 0.6, -0.6))), 0.0), 8.0);
  col += lin(AMBAR) * 0.25 * pow(max(dot(rd, normalize(vec3(0.2, 0.9, 0.3))), 0.0), 10.0);
  return col;
}

// pulso que recorre la cadena: cada eslabón "se sella" al pasar
float pulseAt(float id){
  float n = uHalf * 2.0 + 1.0;
  float head = mod(uTime * 1.1, n + 5.0) - uHalf - 2.5;
  return exp(-pow(id - head, 2.0) * 0.9);
}

void main(){
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.y;

  // cámara
  float dist = mix(5.4, 4.3, uScroll) + uMobile * 1.6;
  vec3 ro = vec3(0.0, 0.0, dist);
  ro.xz = rot(-uMouse.x * 0.22) * ro.xz;
  ro.yz = rot(uMouse.y * 0.14) * ro.yz;
  vec3 ta = uMobile > 0.5 ? vec3(0.0, -1.35, 0.0) : vec3(0.35, 0.0, 0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.9 * ww);

  vec3 col = env(rd);
  float t = 0.0;
  float glow = 0.0;
  vec3 hit = vec3(-1.0);
  for (int i = 0; i < 96; i++){
    if (i >= uSteps) break;
    vec3 p = ro + rd * t;
    vec3 m = map(p);
    if (m.y < 1.5) glow += exp(-m.x * 14.0) * pulseAt(m.z) * 0.045;
    if (m.x < 0.0015 * t){ hit = vec3(t, m.y, m.z); break; }
    t += m.x;
    if (t > 12.0) break;
  }

  if (hit.x > 0.0){
    vec3 p = ro + rd * hit.x;
    vec3 n = calcNormal(p);
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    vec3 L = normalize(vec3(-0.4, 0.7, 0.8));
    if (hit.y < 1.5){
      // cristal iridiscente
      float pu = pulseAt(hit.z);
      vec3 refl = env(reflect(rd, n));
      vec3 refr = env(refract(rd, n, 0.72)) * lin(vec3(0.55, 0.45, 0.85));
      vec3 film = lin(irid(fres * 1.4 + dot(n, vec3(0.3, 0.5, 0.2)) * 0.5 + uTime * 0.03));
      vec3 emis = mix(lin(LACRE), lin(AMBAR), 0.5 + 0.5 * sin(hit.z * 1.7)) * pu * 1.6;
      col = mix(refr * 0.9 + emis * 0.6, refl * 1.4 + film * 0.55, 0.25 + 0.75 * fres);
      col += emis * (0.35 + fres);
      col += pow(max(dot(reflect(-L, n), -rd), 0.0), 64.0) * vec3(1.0) * 1.2;
    } else {
      // lacre brillante con algo de dispersión interna
      vec3 q = sealSpace(p);
      float nz = vnoise(q.xy * 6.0) * 0.6 + vnoise(q.xy * 15.0) * 0.4;
      vec3 base = mix(lin(HONDO), lin(LACRE), 0.45 + 0.5 * nz);
      float wrap = (dot(n, L) + 0.45) / 1.45;
      float spec = pow(max(dot(reflect(-L, n), -rd), 0.0), 42.0);
      vec3 sss = lin(AMBAR) * pow(1.0 - max(dot(n, -rd), 0.0), 2.0) * 0.55;
      col = base * (0.18 + 0.9 * max(wrap, 0.0)) + spec * vec3(1.0, 0.86, 0.8) * 1.1 + sss;
      col += env(reflect(rd, n)) * fres * 0.6;
    }
    // niebla hacia el fondo
    col = mix(col, env(rd), smoothstep(5.0, 9.0, hit.x));
  }

  col += glow * mix(lin(LACRE), lin(AMBAR), 0.35);

  // tonemap + gamma
  col = 1.0 - exp(-col * 1.35);
  col = pow(col, vec3(1.0 / 2.2));

  // viñeta y fundido inferior hacia la tinta de la página
  vec2 q = gl_FragCoord.xy / uRes;
  col *= 0.55 + 0.45 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.2);
  col = mix(INK, col, smoothstep(0.0, 0.22, q.y));

  // tramado para evitar bandas
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) / 255.0;
  fragColor = vec4(col, 1.0);
}
`;

let gl, prog, canvas, U = {};
let cfg = { w: 1, h: 1, dpr: 1, mobile: false, reduce: false };
let scale = 0.6, minScale = 0.35, maxScale = 0.9;
let mouse = { x: 0, y: 0, tx: 0, ty: 0 };
let scroll = 0;
let visible = true;
let running = false;
let t0 = 0;
let ema = 0, frames = 0, checked = 0;
let fence = null, fenceT = 0, lite = false, dirty = true, lastScroll = -1;

const raf = typeof requestAnimationFrame === "function" ? (f) => requestAnimationFrame(f) : (f) => setTimeout(() => f(performance.now()), 16);

function resize() {
  if (!gl) return;
  canvas.width = Math.max(2, Math.round(cfg.w * cfg.dpr * scale));
  canvas.height = Math.max(2, Math.round(cfg.h * cfg.dpr * scale));
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(U.uRes, canvas.width, canvas.height);
  dirty = true;
  if (cfg.reduce) draw(performance.now());
}

function draw(now, ease = 0.06) {
  const time = cfg.reduce ? 6.5 : (now - t0) / 1000 + 2.0;
  mouse.x += (mouse.tx - mouse.x) * ease;
  mouse.y += (mouse.ty - mouse.y) * ease;
  lastScroll = scroll;
  gl.uniform1f(U.uTime, time);
  gl.uniform2f(U.uMouse, mouse.x, mouse.y);
  gl.uniform1f(U.uScroll, scroll);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  fenceT = performance.now();
  gl.flush();
}

// Sin fotogramas apilados: se espera a que la GPU acabe el anterior
function gpuBusy() {
  if (!fence) return false;
  if (gl.getSyncParameter(fence, gl.SYNC_STATUS) !== gl.SIGNALED) return true;
  gl.deleteSync(fence);
  fence = null;
  const cost = performance.now() - fenceT;
  frames++;
  if (frames > 2) ema = ema ? ema * 0.7 + cost * 0.3 : cost;
  return false;
}

function loop(now) {
  if (!running) return;
  if (!visible) { running = false; return; }
  if (!gpuBusy()) {
    if (frames > 3 && frames !== checked && frames % 4 === 0) {
      checked = frames;
      if (ema > 28 && scale > minScale + 0.001) { scale = Math.max(minScale, scale * 0.72); resize(); }
      else if (ema > 55) lite = true;
      else if (ema < 12 && frames > 40 && scale < maxScale) { scale = Math.min(maxScale, scale + 0.05); resize(); }
    }
    if (lite && ema > 250) {
      // ni en modo ligero llega: resolución mínima y, si aun así no puede, escena quieta
      // un último fotograma nítido (en el worker no bloquea la página) y la escena se queda quieta
      running = false;
      scale = cfg.mobile ? 0.8 : 0.5;
      resize();
      draw(now, 1);
      return;
    }
    if (lite) {
      // modo ligero: solo se redibuja cuando el ratón o el scroll cambian
      const moved = Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.02 || Math.abs(scroll - lastScroll) > 0.01;
      if (dirty || moved) { dirty = false; draw(now, 0.5); }
      setTimeout(() => loop(performance.now()), 450);
      return;
    }
    draw(now);
  } else if (now - fenceT > 500 && frames < 4) {
    lite = true;
  }
  raf(loop);
}

function start() {
  if (running || cfg.reduce || !gl) return;
  running = true;
  raf(loop);
}

function init(msg) {
  canvas = msg.canvas;
  cfg = { ...cfg, ...msg.cfg };
  scale = cfg.mobile ? 0.6 : 0.8;
  maxScale = cfg.mobile ? 0.85 : 1;
  gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance" });
  if (!gl) return postMessage({ type: "failed" });
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return postMessage({ type: "failed" });
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  for (const n of ["uRes", "uTime", "uMouse", "uScroll", "uHalf", "uSteps", "uMobile"]) U[n] = gl.getUniformLocation(prog, n);
  gl.uniform1f(U.uHalf, cfg.mobile ? 2 : 3);
  gl.uniform1i(U.uSteps, cfg.mobile ? 52 : 80);
  gl.uniform1f(U.uMobile, cfg.mobile ? 1 : 0);
  t0 = performance.now();
  resize();
  draw(t0);
  postMessage({ type: "ready" });
  start();
}

onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") init(m);
  else if (m.type === "resize") { cfg.w = m.w; cfg.h = m.h; resize(); }
  else if (m.type === "pointer") { mouse.tx = m.x; mouse.ty = m.y; }
  else if (m.type === "scroll") { scroll = m.s; }
  else if (m.type === "visible") { visible = m.v; dirty = true; if (visible) start(); }
};

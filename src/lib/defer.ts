"use client";
/**
 * Cola de inicialización diferida: cada tarea se ejecuta en su propio hueco libre
 * del navegador después de la carga, para no bloquear la primera pantalla.
 */
type Job = { fn: () => void; cancelled: boolean };
const queue: Job[] = [];
let loaded = false;
let running = false;

type RIC = (cb: (d: { timeRemaining: () => number }) => void, o?: { timeout: number }) => number;
const ric: RIC =
  typeof window !== "undefined" && (window as unknown as { requestIdleCallback?: RIC }).requestIdleCallback
    ? (window as unknown as { requestIdleCallback: RIC }).requestIdleCallback.bind(window)
    : (cb) => window.setTimeout(() => cb({ timeRemaining: () => 8 }), 32);

function pump() {
  if (running || !loaded) return;
  running = true;
  ric(
    () => {
      running = false;
      const job = queue.shift();
      if (job && !job.cancelled) job.fn();
      if (queue.length) pump();
    },
    { timeout: 900 }
  );
}

if (typeof window !== "undefined") {
  const onLoad = () => {
    // un fotograma extra para que la primera pantalla quede pintada
    requestAnimationFrame(() =>
      window.setTimeout(() => {
        loaded = true;
        pump();
      }, 60)
    );
  };
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });
}

/** Encola fn y devuelve una función para cancelarla. */
export function whenIdle(fn: () => void) {
  const job: Job = { fn, cancelled: false };
  queue.push(job);
  pump();
  return () => {
    job.cancelled = true;
  };
}

/**
 * Un único gestor del ratón para todos los efectos que lo siguen (nombres elásticos, botones
 * magnéticos, zorro, brillo del cristal, 3D):
 * - un solo listener de pointermove para toda la web;
 * - como mucho una pasada por fotograma (un ratón manda de 125 a 1000 eventos por segundo);
 * - en cada pasada se leen primero todas las posiciones y después se llama a cada efecto,
 *   así nunca se intercalan lecturas y escrituras de diseño (no hay recálculos forzados);
 * - los efectos fuera de pantalla no hacen nada (IntersectionObserver).
 */
type Target = Element | ((e: PointerEvent) => Element | null);
type Sub = {
  target: Target;
  cb: (e: PointerEvent, rect: DOMRect | null, extra?: number) => void;
  /** lectura extra opcional (p. ej. ancho de un texto), hecha en la fase de lecturas */
  measure?: (el: Element) => number;
  onHide?: () => void;
  always: boolean;
  visible: boolean;
};

const subs = new Set<Sub>();
let last: PointerEvent | null = null;
let raf = 0;
let io: IntersectionObserver | null = null;

const elOf = (t: Target, e: PointerEvent) => (typeof t === "function" ? t(e) : t);

function flush() {
  raf = 0;
  const e = last;
  if (!e) return;
  const active = [...subs].filter((s) => s.always || s.visible);
  // 1) lecturas
  const reads = active.map((s) => {
    const el = elOf(s.target, e);
    return el ? ([el.getBoundingClientRect(), s.measure?.(el)] as const) : ([null, undefined] as const);
  });
  // 2) escrituras
  active.forEach((s, i) => s.cb(e, reads[i][0], reads[i][1]));
}

function onMove(e: PointerEvent) {
  last = e;
  if (!raf) raf = requestAnimationFrame(flush);
}

function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          for (const s of subs) {
            if (s.target !== en.target) continue;
            const was = s.visible;
            s.visible = en.isIntersecting;
            if (was && !s.visible) s.onHide?.();
          }
        }
      },
      { rootMargin: "160px 0px" }
    );
  }
  return io;
}

/**
 * Llama a `cb(evento, rect)` como mucho una vez por fotograma mientras el ratón se mueve.
 * Con un elemento, solo cuando está en pantalla (o cerca); `onHide` al salir de ella.
 * Con una función (elemento variable, p. ej. el que está bajo el ratón), siempre.
 */
export function watchPointer(
  target: Target,
  cb: Sub["cb"],
  opts: { onHide?: () => void; measure?: (el: Element) => number } = {}
) {
  const always = typeof target === "function";
  const sub: Sub = { target, cb, onHide: opts.onHide, measure: opts.measure, always, visible: false };
  if (subs.size === 0) window.addEventListener("pointermove", onMove, { passive: true });
  subs.add(sub);
  if (!always) observer().observe(target as Element);
  return () => {
    subs.delete(sub);
    if (!always && io) {
      const el = target as Element;
      if (![...subs].some((s) => s.target === el)) io.unobserve(el);
    }
    if (subs.size === 0) {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      raf = 0;
      last = null;
    }
  };
}

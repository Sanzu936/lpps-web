import fox from "./fox-paths.json";

/** Zorro de LPPS en vectorial (trazado del logo con scripts/trace-logo.py). */
export default function FoxMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={fox.viewBox} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={fox.white} fill="#edf2fa" />
      <path d={fox.navy} fill="#20508e" />
      <path d={fox.sky} fill="#5bc4e2" />
    </svg>
  );
}

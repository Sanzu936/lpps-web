import fox from "./fox-paths.json";

/** Zorro de LPPS en vectorial; los trazados viven en FoxDefs (layout). */
export default function FoxMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={fox.viewBox} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <use href="#fox-w" fill="#edf2fa" />
      <use href="#fox-n" fill="#20508e" />
      <use href="#fox-s" fill="#5bc4e2" />
    </svg>
  );
}

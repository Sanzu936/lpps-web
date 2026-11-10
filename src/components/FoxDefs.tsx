import fox from "./fox-paths.json";

/** Trazados del zorro definidos una sola vez; FoxMark y FoxBuild los reutilizan con <use>. */
export default function FoxDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        <path id="fox-w" d={fox.white} />
        <path id="fox-n" d={fox.navy} />
        <path id="fox-s" d={fox.sky} />
      </defs>
    </svg>
  );
}

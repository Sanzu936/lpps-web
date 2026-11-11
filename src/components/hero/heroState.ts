/** Estado compartido entre el scroll del hero y la escena 3D (sin re-render de React). */
export const heroState = {
  /** 0 → hero intacto, 1 → transición terminada */
  progress: 0,
  /** true mientras el hero está en pantalla */
  visible: true,
  /** true cuando el muro de baldosas (opaco) ya tapa el 3D entero: no hace falta dibujarlo */
  covered: false,
  /** la escena 3D se registra aquí para volver a dibujar en cuanto el muro se abre */
  wake: null as null | (() => void),
  /** centro objetivo de la lente de cristal, en coordenadas de pantalla 0-1 (y hacia arriba) */
  lens: { x: 0.68, y: 0.55 },
  /** false cuando la lente debe retirarse (en móvil, sin toque reciente, para no tapar el texto) */
  lensOn: true,
};

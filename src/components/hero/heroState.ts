/** Estado compartido entre el scroll del hero y la escena 3D (sin re-render de React). */
export const heroState = {
  /** 0 → hero intacto, 1 → transición terminada */
  progress: 0,
  /** true mientras el hero está en pantalla */
  visible: true,
  /** centro objetivo de la lente de cristal, en coordenadas de pantalla 0-1 (y hacia arriba) */
  lens: { x: 0.68, y: 0.55 },
};

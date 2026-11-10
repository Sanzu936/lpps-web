/** Estado compartido entre el scroll del hero y la escena 3D (sin re-render de React). */
export const heroState = {
  /** 0 → hero intacto, 1 → transición a claro terminada */
  progress: 0,
  /** true mientras el hero está en pantalla */
  visible: true,
};

import type { ReactNode } from "react";
import { BOOKING_HREF, BOOKING_IS_EXTERNAL, withBase } from "@/config/site";
import Magnetic from "./Magnetic";

type Props = {
  children?: ReactNode;
  className?: string;
  magnetic?: boolean;
  /** Distancia (px) a la que el botón empieza a "pegarse" al cursor. */
  radius?: number;
};

/** Botón "Agendar llamada". Su destino sale siempre de BOOKING_HREF (src/config/site.ts). */
export default function BookingLink({ children = "Agendar llamada", className = "btn", magnetic = false, radius }: Props) {
  // Un ancla (#contacto) se resuelve contra la portada, para que funcione también desde las legales
  const href = BOOKING_HREF.startsWith("#") ? withBase(`/${BOOKING_HREF}`) : BOOKING_HREF;
  const link = (
    <a
      href={href}
      className={className}
      {...(BOOKING_IS_EXTERNAL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="btn__dot" aria-hidden="true" />
      <span className="btn__label">{children}</span>
    </a>
  );
  return magnetic ? <Magnetic radius={radius}>{link}</Magnetic> : link;
}

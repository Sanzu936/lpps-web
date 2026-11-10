import type { ReactNode } from "react";
import { BOOKING_HREF, BOOKING_IS_EXTERNAL } from "@/config/site";
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
  const link = (
    <a
      href={BOOKING_HREF}
      className={className}
      {...(BOOKING_IS_EXTERNAL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="btn__dot" aria-hidden="true" />
      <span className="btn__label">{children}</span>
    </a>
  );
  return magnetic ? <Magnetic radius={radius}>{link}</Magnetic> : link;
}

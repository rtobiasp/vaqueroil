import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registro centralizado: se ejecuta una sola vez por bundle (deduplicado por
// el bundler aunque se importe desde muchos archivos). Idempotente.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 0.8, overwrite: "auto" });
}

export { gsap, ScrollTrigger, useGSAP };

export function isReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Start estándar para reveals: lo bastante abajo para no bloquear LCP. */
export const REVEAL_START = "top 88%";

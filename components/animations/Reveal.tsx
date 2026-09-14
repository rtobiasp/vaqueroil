"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, REVEAL_START, isReducedMotion } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Desplazamiento vertical inicial en px. Solo transform (GPU). */
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
};

/**
 * Reveal genérico on-scroll. Solo anima opacity/transform para no provocar
 * layout thrash. Un ScrollTrigger por instancia con `once: true` que se mata
 * solo tras reproducirse; `useGSAP` revierte todo al desmontar (sin leaks en
 * navegación del App Router).
 */
export default function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
  duration = 0.8,
  start = REVEAL_START,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || isReducedMotion()) return;

      el.style.willChange = "transform, opacity";
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, once },
          onComplete: () => {
            el.style.willChange = "";
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        if (el) el.style.willChange = "";
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

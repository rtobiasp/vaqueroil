"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, REVEAL_START, isReducedMotion } from "@/lib/gsap";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  /** Selector de los hijos a escalonar dentro del contenedor. */
  itemSelector?: string;
  stagger?: number;
  y?: number;
  start?: string;
};

/**
 * Un solo ScrollTrigger por grupo + stagger interno. Mucho más barato que un
 * trigger por tarjeta (N triggers -> 1). Ideal para grids (servicios, valores,
 * canales, FAQs, features).
 */
export default function StaggerGroup({
  children,
  className,
  itemSelector = "[data-stagger]",
  stagger = 0.08,
  y = 26,
  start = REVEAL_START,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || isReducedMotion()) return;
      const items = root.querySelectorAll(itemSelector);
      if (items.length === 0) return;

      const tween = gsap.fromTo(
        items,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: root, start, once: true },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
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

"use client";

import { useRef } from "react";
import BrandButton from "../ui/BrandButton";
import Image from "next/image";
import { gsap, useGSAP, isReducedMotion } from "@/lib/gsap";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope || isReducedMotion()) return;

      // Intro solo con transform/opacity; sin ScrollTrigger para no retrasar LCP.
      const intro = gsap.fromTo(
        scope.querySelectorAll("[data-hero]"),
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.1,
        },
      );

      return () => {
        intro.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate -mt-20 flex min-h-svh items-stretch overflow-hidden bg-bg-dark"
    >
      <div className="absolute inset-0">
        <Image
          src="/hero_background.jpg"
          alt="Mecánico trabajando en el motor de un vehículo"
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-bg-dark/35" aria-hidden="true" />

      <div className="relative z-10 flex w-full flex-1 flex-col justify-between gap-8 px-5 pt-36 pb-12 text-text-inverse sm:px-8 md:px-15 md:pt-60">
        <div className="max-w-full sm:max-w-[80%]">
          <h1
            data-hero
            className="font-body text-6xl leading-none tracking-tighter text-balance sm:text-7xl md:text-[112px] md:leading-[0.95]"
          >
            Tu vehículo, en las mejores manos.
          </h1>
        </div>

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p
            data-hero
            className="max-w-xl text-base leading-relaxed text-text-inverse/95 sm:text-lg md:text-xl"
          >
            Mantenimiento y reparación profesional para que sigas avanzando con
            total tranquilidad.
          </p>
          <div
            data-hero
            className="w-full sm:w-auto [&>a]:w-full sm:[&>a]:w-auto [&>a]:justify-center"
          >
            <BrandButton link="/request-appointment-quote" text="Pedir cita" />
          </div>
        </div>
      </div>
    </section>
  );
}

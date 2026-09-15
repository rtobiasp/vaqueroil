"use client";

import { useRef } from "react";
import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import { gsap, useGSAP, isReducedMotion } from "@/lib/gsap";

type HeroLandingProps = {
  bg_image: string;
  title: string;
  alt?: string;
};

export default function HeroLanding({
  bg_image,
  title,
  alt = "Taller Vaqueroil en Logroño",
}: HeroLandingProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope || isReducedMotion()) return;

      const intro = gsap.fromTo(
        scope.querySelectorAll("[data-hero-landing]"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
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
      className="relative -mt-20 flex min-h-[60vh] overflow-hidden"
    >
      <Image
        src={bg_image}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center blur-xs"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-accent-primary/60 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-bg-dark/50 via-transparent to-transparent"
      />

      <div
        data-hero-landing
        className="absolute inset-x-0 top-24 z-20 sm:top-28"
      >
        <div className="mx-auto flex w-full max-w-6xl justify-start px-4 sm:px-8">
          <Breadcrumbs />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 pt-32 pb-12 text-center sm:px-8">
        <h1
          data-hero-landing
          className="text-5xl font-medium text-text-inverse sm:text-[100px]"
        >
          {title}
        </h1>
      </div>
    </section>
  );
}

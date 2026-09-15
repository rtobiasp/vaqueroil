import type { Metadata } from "next";
import HeroLanding from "@/components/HeroLanding";
import CtaBanner from "@/components/shared/CtaBanner";
import TestimonialSection from "@/components/home/TestimonialSection";
import StorySection from "@/components/about/StorySection";
import ValuesSection from "@/components/about/ValuesSection";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sobre nosotros | Taller de confianza en Logroño",
  description:
    "Conoce Vaqueroil: taller multimarca en C. Calahorra 12, Logroño. Trato cercano, precio claro y trabajo garantizado. La mayoría de clientes repite.",
  alternates: { canonical: absoluteUrl("/about-us") },
  openGraph: {
    title: "Sobre Vaqueroil | Taller en Logroño",
    description:
      "Taller multimarca en Logroño con trato cercano y garantía en piezas y mano de obra.",
    url: absoluteUrl("/about-us"),
  },
};

export default function AboutUsPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: absoluteUrl("/") },
          { name: "Sobre nosotros", url: absoluteUrl("/about-us") },
        ])}
      />
      <HeroLanding
        bg_image="/hero_about-us.jpg"
        title="SOBRE NOSOTROS"
        alt="Equipo del taller Vaqueroil en Logroño"
      />
      <StorySection />
      <ValuesSection />
      <TestimonialSection />
      <CtaBanner
        title="VEN A VERNOS"
        description="Estamos en C. Calahorra 12, Logroño. Pásate, pide cita y nos conocemos."
      />
    </main>
  );
}

import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeatureBarSection from "@/components/home/FeatureBarSection";
import BrandsMarqueeSection from "@/components/home/BrandsMarqueeSection";
import { db } from "@/src/db";
import { services } from "@/src/db/schema";
import TestimonialSection from "@/components/home/TestimonialSection";
import UbicacionSection from "@/components/home/UbicacionSection";
import VentajasSection from "@/components/home/VentajasSection";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Taller multimarca en Logroño | Mantenimiento y reparación",
  description:
    "Taller multimarca en Logroño: revisiones, cambio de aceite, frenos, neumáticos, diagnosis y pre-ITV con precio claro y garantía. Pide cita online en Vaqueroil.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "Vaqueroil | Taller multimarca en Logroño",
    description:
      "Mantenimiento y reparación profesional en Logroño con precio claro, cita online y garantía de taller.",
    url: absoluteUrl("/"),
  },
};

export default async function Home() {
  const serviceList = (await db.select().from(services)) || [];

  return (
    <main id="contenido" tabIndex={-1}>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Inicio", url: absoluteUrl("/") }])}
      />
      <HeroSection />
      <FeatureBarSection />
      <ServicesSection services={serviceList} />
      <BrandsMarqueeSection />
      <VentajasSection />
      <TestimonialSection />
      <UbicacionSection />
    </main>
  );
}

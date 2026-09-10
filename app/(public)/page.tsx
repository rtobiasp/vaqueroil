import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeatureBarSection from "@/components/home/FeatureBarSection";
import { db } from "@/src/db";
import { services } from "@/src/db/schema";
import TestimonialSection from "@/components/home/TestimonialSection";
import UbicacionSection from "@/components/home/UbicacionSection";
import VentajasSection from "@/components/home/VentajasSection";

export default async function Home() {
  const serviceList = (await db.select().from(services)) || [];

  return (
    <main>
      <HeroSection />
      <FeatureBarSection />
      <ServicesSection services={serviceList} />
      <VentajasSection />
      <TestimonialSection />
      <UbicacionSection />
    </main>
  );
}

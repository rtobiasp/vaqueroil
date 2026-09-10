import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import { db } from "@/src/db";
import { services } from "@/src/db/schema";

export default async function Home() {
  const serviceList = (await db.select().from(services)) || [];

  return (
    <main>
      <HeroSection />
      <ServicesSection services={serviceList} />
    </main>
  );
}

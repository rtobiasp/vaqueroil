import HeroLanding from "@/components/HeroLanding";
import FeatureBarSection from "@/components/home/FeatureBarSection";
import CtaBanner from "@/components/shared/CtaBanner";
import FaqList from "@/components/shared/FaqList";
import SectionHeading from "@/components/shared/SectionHeading";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServicesGrid from "@/components/services/ServicesGrid";
import { db } from "@/src/db";
import { services } from "@/src/db/schema";

export const dynamic = "force-dynamic";

const faqs = [
  {
    question: "¿Tengo que pedir cita?",
    answer:
      "Mejor que sí, para no hacerte esperar. Pero si es urgente, pásate y lo vemos según cómo vaya el día.",
  },
  {
    question: "¿Me decís el precio antes?",
    answer:
      "Siempre. Primero miramos y luego te pasamos el presupuesto. Sin tu OK no se hace nada.",
  },
  {
    question: "¿Las reparaciones tienen garantía?",
    answer: "Sí, en piezas y en mano de obra, con su factura.",
  },
  {
    question: "¿Tocáis todas las marcas?",
    answer: "Sí, somos taller multimarca.",
  },
  {
    question: "¿Cuánto tarda una revisión?",
    answer:
      "Un cambio de aceite con revisión suele llevar un par de horas. Al pedir cita te decimos el plazo.",
  },
];

export default async function ServicesPage() {
  const serviceList = (await db.select().from(services)) ?? [];

  return (
    <main>
      <HeroLanding bg_image="/hero_services.jpg" title="SERVICIOS" />

      <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
          <SectionHeading
            title="NUESTROS SERVICIOS"
            description="Esto es lo que hacemos en el taller. Si no ves lo que necesitas, llámanos al 941 04 76 95 y pregunta."
          />
          <ServicesGrid services={serviceList} />
        </div>
      </section>

      <FeatureBarSection />
      <ServiceProcess />

      <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <SectionHeading align="center" title="PREGUNTAS FRECUENTES" />
          <FaqList items={faqs} />
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}

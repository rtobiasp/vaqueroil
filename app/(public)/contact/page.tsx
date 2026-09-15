import type { Metadata } from "next";
import HeroLanding from "@/components/HeroLanding";
import UbicacionSection from "@/components/home/UbicacionSection";
import CtaBanner from "@/components/shared/CtaBanner";
import FaqList from "@/components/shared/FaqList";
import SectionHeading from "@/components/shared/SectionHeading";
import ContactChannels from "@/components/contact/ContactChannels";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const faqs = [
  {
    question: "¿Cuál es vuestro horario?",
    answer:
      "De lunes a viernes, de 9:00 a 13:30 y de 16:00 a 19:30. Los fines de semana cerramos.",
  },
  {
    question: "¿Dónde estáis?",
    answer:
      "En la calle Calahorra 12, pabellón 1, Logroño. Dale a «Cómo llegar» y se te abre la ruta.",
  },
  {
    question: "Tengo una avería urgente, ¿qué hago?",
    answer:
      "Llámanos al 941 04 76 95 dentro del horario y te buscamos el primer hueco.",
  },
  {
    question: "¿Puedo pedir presupuesto por email?",
    answer:
      "Sí: info@vaqueroil.es. Cuéntanos la marca, el modelo y qué le notas al coche, y te decimos algo.",
  },
];

export const metadata: Metadata = {
  title: "Contacto | Taller en C. Calahorra 12, Logroño",
  description:
    "Contacta con Vaqueroil en Logroño: llama al 941 04 76 95, escribe a info@vaqueroil.es o pide cita online. L-V 9:00–13:30 y 16:00–19:30.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: "Contacto | Vaqueroil Logroño",
    description:
      "Llámanos, reserva online o visítanos en C. Calahorra 12, Logroño.",
    url: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: absoluteUrl("/") },
          { name: "Contacto", url: absoluteUrl("/contact") },
        ])}
      />
      <HeroLanding
        bg_image="/hero_contacto.jpg"
        title="CONTACTO"
        alt="Contacto con el taller Vaqueroil en C. Calahorra 12, Logroño"
      />
      <ContactChannels />
      <UbicacionSection />

      <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <SectionHeading align="center" title="PREGUNTAS FRECUENTES" />
          <FaqList items={faqs} />
        </div>
      </section>

      <CtaBanner
        title="PIDE CITA ONLINE"
        description="Elige el día y la hora en el formulario y te la confirmamos."
      />
    </main>
  );
}

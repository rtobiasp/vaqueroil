import Image from "next/image";
import SectionHeading from "@/components/shared/SectionHeading";
import BrandButton from "@/components/ui/BrandButton";
import Reveal from "@/components/animations/Reveal";

export default function StorySection() {
  return (
    <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-12">
        <Reveal className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl shadow-md lg:aspect-4/5 lg:w-[48%]">
          <Image
            src="/features.jpg"
            alt="Mecánico de Vaqueroil revisando el motor de un coche en Logroño"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal className="flex w-full flex-col items-start gap-5 lg:w-[52%]">
          <div className="flex w-full flex-col items-start gap-5">
            <SectionHeading title="QUIÉNES SOMOS" />
            <div className="flex flex-col gap-4 text-base leading-relaxed text-text-inverse/80 sm:text-lg">
              <p>
                Somos Vaqueroil, un taller multimarca en la calle Calahorra 12,
                en Logroño. Nos dedicamos al mantenimiento y la reparación de
                coches de todas las marcas.
              </p>
              <p>
                Hacemos revisiones, cambios de aceite, frenos, neumáticos,
                diagnosis electrónica y pre-ITV. Y si no sabes qué le pasa a tu
                coche, lo miramos y te contamos lo que vemos.
              </p>
              <p>La mayoría de la gente que viene, repite.</p>
            </div>
            <div className="w-full sm:w-auto [&>a]:w-full sm:[&>a]:w-auto [&>a]:justify-center">
              <BrandButton link="/services" text="Ver servicios" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import BrandButton from "../ui/BrandButton";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative isolate -mt-20 flex min-h-svh items-stretch overflow-hidden bg-bg-dark">
      <Image
        src="/hero_background.jpg"
        alt="Mecánico trabajando en el motor de un vehículo"
        fill
        priority
        className="object-cover opacity-50"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-bg-dark/35" aria-hidden="true" />

      <div className="relative z-10 flex w-full flex-1 flex-col justify-between gap-8 px-5 pt-36 pb-12 text-text-inverse sm:px-8 md:px-15 md:pt-60">
        <div className="max-w-full sm:max-w-[80%]">
          <h1 className="font-body text-4xl tracking-tighter leading sm:text-5xl md:text-[112px]">
            Tu vehículo, en las mejores manos.
          </h1>
        </div>

        <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base leading-relaxed text-text-inverse/95 sm:text-lg md:text-xl">
            Mantenimiento y reparación profesional para que sigas avanzando con
            total tranquilidad.
          </p>
          <div className="w-full sm:w-auto [&>a]:w-full sm:[&>a]:w-auto [&>a]:justify-center">
            <BrandButton link="/request-appointment-quote" text="Pedir cita" />
          </div>
        </div>
      </div>
    </section>
  );
}

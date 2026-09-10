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

      <div className="relative z-10 flex flex-1 flex-col justify-between w-full pt-60 pb-12 text-text-inverse md:px-15">
        <div className="max-w-[80%]">
          <h1 className="font-body text-5xl tracking-tighter leading md:text-[112px]">
            Tu vehículo, en las mejores manos.
          </h1>
        </div>

        <div className="w-full flex flex-row justify-between items-center">
          <p className="max-w-xl text-lg leading-relaxed text-text-inverse/95 md:text-xl">
            Mantenimiento y reparación profesional para que sigas avanzando con
            total tranquilidad.
          </p>
          <BrandButton link="/request-appointment-quote" text="Pedir cita" />
        </div>
      </div>
    </section>
  );
}

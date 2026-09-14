import Image from "next/image";
import image_features from "@/public/features.jpg";
import BrandButton from "../ui/BrandButton";
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react";

export default function VentajasSection() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-felt bg-bg-dark px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-stretch lg:flex-row lg:items-center">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl shadow-md lg:aspect-3/4 lg:max-h-[75vh] lg:w-[52%]">
          <Image
            src={image_features}
            alt="Imagen de un mecánico revisando el motor de un coche. "
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <article className="relative z-10 w-full rounded-2xl bg-surface-mid p-6 text-text-inverse shadow-[0_30px_80px_-15px_rgba(0,0,0,0.85)] sm:p-8 lg:-ml-36 lg:w-[58%] lg:p-12">
          <h2 className="text-3xl leading-[1.05] font-medium sm:text-5xl md:text-6xl">
            POR QUÉ ELEGIRNOS
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-text-inverse/80 sm:mt-5 sm:text-lg">
            Tres cosas que intentamos hacer bien cada día.
          </p>
          <ul className="mt-6 flex flex-col gap-5 sm:mt-8">
            <li className="flex items-start gap-3 sm:gap-4">
              <ShieldCheck
                className="mt-1 shrink-0 text-accent-primary"
                size={28}
              />
              <div>
                <p className="text-lg font-medium sm:text-xl">Precio claro</p>
                <p className="text-sm text-text-inverse/70 sm:text-base">
                  Te decimos lo que cuesta antes de empezar.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 sm:gap-4">
              <Clock className="mt-1 shrink-0 text-accent-primary" size={28} />
              <div>
                <p className="text-lg font-medium sm:text-xl">Te decimos cuándo está</p>
                <p className="text-sm text-text-inverse/70 sm:text-base">
                  Y si algo se retrasa, te avisamos.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 sm:gap-4">
              <BadgeCheck
                className="mt-1 shrink-0 text-accent-primary"
                size={28}
              />
              <div>
                <p className="text-lg font-medium sm:text-xl">Trabajo garantizado</p>
                <p className="text-sm text-text-inverse/70 sm:text-base">
                  Si algo de lo que hemos tocado falla, lo miramos.
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-8 w-full sm:mt-10 sm:w-fit [&>a]:w-full sm:[&>a]:w-auto [&>a]:justify-center">
            <BrandButton link="/services" text="Ver servicios" />
          </div>
        </article>
      </div>
    </section>
  );
}

import Image from "next/image";
import image_features from "@/public/features.jpg";
import BrandButton from "../ui/BrandButton";
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react";

export default function VentajasSection() {
  return (
    <section className="flex items-center justify-center min-h-[80vh] px-15 py-20 bg-felt bg-bg-dark">
      <div className="flex items-center w-full max-w-7xl mx-auto">
        <div className="relative w-[52%] aspect-3/4 max-h-[75vh] rounded-2xl overflow-hidden shadow-md shrink-0">
          <Image
            src={image_features}
            alt="Imagen de un mecánico revisando el motor de un coche. "
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
        </div>
        <article className="relative z-10 -ml-24 md:-ml-36 w-[58%] bg-surface-mid text-text-inverse rounded-2xl p-10 md:p-12 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.85)]">
          <p className="font-link uppercase tracking-widest text-accent-primary text-sm">
            Nuestras ventajas
          </p>
          <h2 className="mt-3 font-medium text-5xl md:text-6xl leading-[1.05]">
            POR QUÉ ELEGIRNOS
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-inverse/80">
            Cuidamos tu vehículo como si fuera el nuestro, con diagnóstico
            preciso y trato transparente.
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            <li className="flex items-start gap-4">
              <ShieldCheck
                className="mt-1 shrink-0 text-accent-primary"
                size={28}
              />
              <div>
                <p className="text-xl font-medium">Transparencia total</p>
                <p className="text-text-inverse/70">
                  Presupuesto claro antes de cada reparación, sin sorpresas.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Clock className="mt-1 shrink-0 text-accent-primary" size={28} />
              <div>
                <p className="text-xl font-medium">Rapidez y puntualidad</p>
                <p className="text-text-inverse/70">
                  Entrega en plazo para que sigas avanzando con tranquilidad.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <BadgeCheck
                className="mt-1 shrink-0 text-accent-primary"
                size={28}
              />
              <div>
                <p className="text-xl font-medium">Garantía profesional</p>
                <p className="text-text-inverse/70">
                  Técnicos expertos y recambios de calidad contrastada.
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-10 w-fit">
            <BrandButton link="/services" text="Ver servicios" />
          </div>
        </article>
      </div>
    </section>
  );
}

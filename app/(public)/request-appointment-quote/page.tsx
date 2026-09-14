import HeroLanding from "@/components/HeroLanding";
import SectionHeading from "@/components/shared/SectionHeading";
import CtaBanner from "@/components/shared/CtaBanner";
import Reveal from "@/components/animations/Reveal";
import { db } from "@/src/db/index";
import { services } from "@/src/db/schema";
import { AppointmentForm } from "./appointment-form";
import { MapPin, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pedir cita | Vaqueroil",
  description:
    "Reserva tu cita en el taller en un minuto: elige servicio, fecha y hora. Te la confirmamos por teléfono.",
};

export default async function RequestAppointmentQuotePage() {
  const servicios = await db
    .select({ id: services.id, name: services.name })
    .from(services);

  return (
    <main>
      <HeroLanding bg_image="/hero_background.jpg" title="PEDIR CITA" />

      <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
          <SectionHeading
            title="RESERVA EN UN MINUTO"
            description="Rellena tus datos, tu coche y elige día y hora entre los huecos libres. Te confirmamos la cita por teléfono."
          />

          <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 lg:grid-cols-[1fr_360px]">
            <AppointmentForm services={servicios} />

            <Reveal delay={0.1} y={24}>
            <aside className="flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-24">
              <div className="rounded-2xl bg-surface-mid p-6 text-text-inverse sm:p-7">
                <h2 className="text-lg font-medium">¿Cómo funciona?</h2>
                <ol className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-text-inverse/70">
                  <li className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                    />
                    Cuéntanos quién eres y qué coche traes.
                  </li>
                  <li className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                    />
                    Elige servicio, día y hora libre.
                  </li>
                  <li className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                    />
                    Te llamamos para confirmarte la cita.
                  </li>
                </ol>
              </div>

              <div className="rounded-2xl bg-surface-mid p-6 text-text-inverse sm:p-7">
                <h2 className="text-lg font-medium">Horario</h2>
                <dl className="mt-4 flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-text-inverse/60">Lunes – Viernes</dt>
                    <dd className="font-medium">9:00 – 13:30 · 16:00 – 19:30</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-text-inverse/60">Fines de semana</dt>
                    <dd className="font-medium">Cerrado</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-text-inverse/50">
                  Cada cita dura 45 minutos. Si es urgente, llámanos y te
                  buscamos el primer hueco.
                </p>
              </div>

              <div className="rounded-2xl bg-accent-primary p-6 text-text-inverse sm:p-7">
                <h2 className="text-lg font-medium">¿Prefieres llamar?</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-inverse/90">
                  Para urgencias o dudas, te atendemos en horario de taller.
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href="tel:+34941047695"
                    className="flex items-center justify-center gap-2 rounded-lg bg-bg-dark px-4 py-3 text-sm font-medium uppercase transition hover:bg-surface-mid"
                  >
                    <Phone size={16} aria-hidden="true" />
                    941 04 76 95
                  </a>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-text-inverse/85">
                    <MapPin size={14} aria-hidden="true" />
                    C. Calahorra 12, Logroño
                  </p>
                </div>
              </div>
            </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBanner
        title="¿TIENES UNA AVERÍA URGENTE?"
        description="No esperes al formulario: llámanos y te buscamos el primer hueco libre."
      />
    </main>
  );
}

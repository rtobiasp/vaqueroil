import { CalendarCheck, Mail, MapPin, Phone } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import StaggerGroup from "@/components/animations/StaggerGroup";

const channels = [
  {
    icon: Phone,
    title: "Llámanos",
    description: "Para urgencias, dudas o presupuesto rápido.",
    actionLabel: "941 04 76 95",
    actionHref: "tel:+34941047695",
  },
  {
    icon: CalendarCheck,
    title: "Pide cita online",
    description: "Elige servicio, fecha y hora en un minuto.",
    actionLabel: "Reservar cita",
    actionHref: "/request-appointment-quote",
  },
  {
    icon: Mail,
    title: "Escríbenos",
    description: "Te respondemos en horario de taller.",
    actionLabel: "info@vaqueroil.es",
    actionHref: "mailto:info@vaqueroil.es",
  },
  {
    icon: MapPin,
    title: "Visítanos",
    description: "C. Calahorra, 12, Pab. 1, 26006 Logroño.",
    actionLabel: "Cómo llegar",
    actionHref:
      "https://www.google.com/maps/dir/?api=1&destination=Vaqueroil+C.+Calahorra+12+26006+Logro%C3%B1o",
  },
];

export default function ContactChannels() {
  return (
    <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <SectionHeading
          title="ELIGE CÓMO CONTACTAR"
          description="Llámanos, reserva por la web, escríbenos o pásate por el taller. Abrimos de lunes a viernes: 9:00–13:30 y 16:00–19:30."
        />
        <StaggerGroup stagger={0.09}>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {channels.map(
              ({ icon: Icon, title, description, actionLabel, actionHref }) => (
                <li
                  key={title}
                  data-stagger
                  className="flex flex-col justify-between gap-5 rounded-2xl bg-surface-mid p-6 text-text-inverse sm:p-7"
                >
                  <div className="flex flex-col gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-medium">{title}</h3>
                    <p className="text-sm leading-relaxed text-text-inverse/70 sm:text-base">
                      {description}
                    </p>
                  </div>
                  <a
                    href={actionHref}
                    target={
                      actionHref.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      actionHref.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="font-link text-sm uppercase tracking-wide text-accent-primary transition-colors hover:text-text-inverse"
                  >
                    {actionLabel} →
                  </a>
                </li>
              ),
            )}
          </ul>
        </StaggerGroup>
      </div>
    </section>
  );
}

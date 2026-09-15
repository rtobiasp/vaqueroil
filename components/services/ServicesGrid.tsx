import {
  AirVent,
  BadgeEuro,
  Car,
  CircleGauge,
  Disc3,
  Droplets,
  SearchCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import StaggerGroup from "@/components/animations/StaggerGroup";

export type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  price: string | number | null;
};

const FALLBACK_DETAILS: Record<string, { icon: LucideIcon; points: string[] }> = {
  default: {
    icon: Wrench,
    points: ["Diagnóstico previo", "Recambios de calidad", "Garantía de taller"],
  },
};

function iconForService(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("aceite") || n.includes("mantenimiento") || n.includes("revisi"))
    return Droplets;
  if (n.includes("freno")) return Disc3;
  if (n.includes("neum")) return Car;
  if (n.includes("diagn") || n.includes("electr")) return SearchCheck;
  if (n.includes("itv") || n.includes("emision")) return BadgeEuro;
  if (n.includes("clima") || n.includes("aire")) return AirVent;
  if (n.includes("motor") || n.includes("distribu")) return CircleGauge;
  return FALLBACK_DETAILS.default.icon;
}

function detailPoints(name: string): string[] {
  const n = name.toLowerCase();
  if (n.includes("aceite") || n.includes("mantenimiento"))
    return ["Aceite y filtros", "Revisión de 20 puntos", "Puesta a punto"];
  if (n.includes("freno"))
    return ["Pastillas y discos", "Líquido de frenos", "Test de frenada"];
  if (n.includes("neum"))
    return ["Montaje y equilibrado", "Alineado de dirección", "Control de presiones"];
  if (n.includes("diagn"))
    return ["Diagnosis electrónica", "Informe detallado", "Presupuesto cerrado"];
  if (n.includes("itv"))
    return ["Revisión pre-ITV", "Emisiones y alumbrado", "Gestión de cita"];
  if (n.includes("clima"))
    return ["Carga de gas", "Filtro de habitáculo", "Antibacterias"];
  return FALLBACK_DETAILS.default.points;
}

export default function ServicesGrid({ services }: { services: ServiceItem[] }) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-mid p-8 text-center text-text-inverse/70">
        Estamos actualizando nuestro catálogo. Llámanos al{" "}
        <a href="tel:+34941047695" className="text-accent-ink underline">
          941 04 76 95
        </a>{" "}
        y te informamos de todos los servicios disponibles.
      </div>
    );
  }

  return (
    <StaggerGroup stagger={0.08}>
    <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = iconForService(service.name);
        return (
          <li
            key={service.id}
            data-stagger
            className="flex flex-col justify-between gap-6 rounded-2xl bg-surface-mid p-6 text-text-inverse transition-colors hover:bg-surface-mid/80 sm:p-8"
          >
            <div className="flex flex-col gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-primary">
                <Icon size={28} aria-hidden="true" />
              </span>
              <h3 className="text-2xl font-medium">{service.name}</h3>
              {service.description ? (
                <p className="text-sm leading-relaxed text-text-inverse/70 sm:text-base">
                  {service.description}
                </p>
              ) : null}
              <ul className="flex flex-col gap-2">
                {detailPoints(service.name).map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-sm text-text-inverse/75"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              {service.price != null && String(service.price) !== "" ? (
                <p className="text-sm font-medium tracking-wide text-text-inverse/85">
                  Desde{" "}
                  <span className="text-lg text-accent-ink">
                    {String(service.price)} €
                  </span>
                </p>
              ) : null}
            </div>
            <Link
              href="/request-appointment-quote"
              aria-label={`Reservar ${service.name}`}
              className="flex items-center gap-2 font-link text-sm uppercase tracking-wide text-accent-ink transition-colors hover:text-text-inverse"
            >
              Reservar este servicio <MoveRight size={18} aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </ul>
    </StaggerGroup>
  );
}

import { Handshake, ScanSearch, Timer, Wallet } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import StaggerGroup from "@/components/animations/StaggerGroup";

const values = [
  {
    icon: Wallet,
    title: "Precio por adelantado",
    description:
      "Miramos el coche y te decimos lo que cuesta antes de hacer nada. Sin tu visto bueno no se toca.",
  },
  {
    icon: ScanSearch,
    title: "Vamos a lo que es",
    description:
      "Comprobamos antes de cambiar piezas. Y si quieres ver las viejas, te las enseñamos.",
  },
  {
    icon: Timer,
    title: "Te decimos cuándo está",
    description:
      "Al pedir cita te damos un plazo. Si se complica algo, te llamamos.",
  },
  {
    icon: Handshake,
    title: "Trato de barrio",
    description:
      "Pregunta lo que quieras y decide tranquilo. Aquí no hay prisa.",
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-bg-dark bg-felt px-5 py-12 text-text-inverse sm:px-8 sm:py-16 md:px-15 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <SectionHeading title="ASÍ TRABAJAMOS" />
        <StaggerGroup stagger={0.09}>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                data-stagger
                className="flex flex-col gap-3 rounded-2xl bg-surface-mid p-6 text-text-inverse sm:p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary text-text-inverse">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-medium sm:text-xl">{title}</h3>
                <p className="text-sm leading-relaxed text-text-inverse/70 sm:text-base">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </StaggerGroup>
      </div>
    </section>
  );
}

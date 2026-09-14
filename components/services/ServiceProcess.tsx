import SectionHeading from "@/components/shared/SectionHeading";
import StaggerGroup from "@/components/animations/StaggerGroup";

const steps = [
  {
    number: "01",
    title: "Pide cita",
    description:
      "Por la web o por teléfono. Nos cuentas qué le notas al coche y te buscamos hueco.",
  },
  {
    number: "02",
    title: "Te damos precio",
    description:
      "Lo revisamos y te decimos cuánto vale arreglarlo. Tú decides si seguimos.",
  },
  {
    number: "03",
    title: "Lo arreglamos",
    description: "Hacemos el trabajo con recambios de primeras marcas.",
  },
  {
    number: "04",
    title: "Lo recoges",
    description:
      "Te avisamos cuando está listo. Te llevas la factura con todo desglosado.",
  },
];

export default function ServiceProcess() {
  return (
    <section className="bg-bg-dark bg-felt px-5 py-12 text-text-inverse sm:px-8 sm:py-16 md:px-15 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <SectionHeading title="CÓMO TRABAJAMOS" />
        <StaggerGroup stagger={0.09}>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {steps.map((step) => (
              <li
                key={step.number}
                data-stagger
                className="flex flex-col gap-3 rounded-2xl bg-surface-mid p-6 text-text-inverse sm:p-7"
              >
                <span className="font-link text-sm font-bold tracking-widest text-accent-primary">
                  {step.number}
                </span>
                <h3 className="text-lg leading-snug font-medium sm:text-xl">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-inverse/70 sm:text-base">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </StaggerGroup>
      </div>
    </section>
  );
}

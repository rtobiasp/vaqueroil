import { ArrowUpRight, Phone } from "lucide-react";

type CtaBannerProps = {
  title?: string;
  description?: string;
  primaryLink?: string;
  primaryText?: string;
};

export default function CtaBanner({
  title = "PIDE CITA",
  description = "Por la web o llamando al 941 04 76 95. Estamos en C. Calahorra 12, Logroño.",
  primaryLink = "/request-appointment-quote",
  primaryText = "Pedir cita",
}: CtaBannerProps) {
  return (
    <section className="bg-bg-dark bg-felt px-5 py-12 sm:px-8 sm:py-16 md:px-15 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 rounded-2xl bg-accent-primary p-6 text-text-inverse sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl leading-[1.05] font-medium sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-inverse/90 sm:text-lg">
            {description}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center lg:flex-col lg:items-stretch">
          <a
            href={primaryLink}
            className="flex items-center justify-center gap-2 rounded-lg bg-bg-dark px-4 py-3 text-sm font-medium uppercase transition hover:bg-surface-mid"
          >
            {primaryText}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            href="tel:+34941047695"
            className="flex items-center justify-center gap-2 rounded-lg bg-text-inverse px-4 py-3 text-sm font-medium text-accent-primary transition hover:bg-bg-dark hover:text-text-inverse"
          >
            <Phone size={16} aria-hidden="true" />
            941 04 76 95
          </a>
        </div>
      </div>
    </section>
  );
}

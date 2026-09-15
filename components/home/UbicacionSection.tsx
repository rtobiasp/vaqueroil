import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import Reveal from "@/components/animations/Reveal";
import StaggerGroup from "@/components/animations/StaggerGroup";
import ConsentMap from "@/components/cookies/ConsentMap";

const horario = [
  { dias: "Lunes — Viernes", horas: "9:00–13:30 · 16:00–19:30" },
  { dias: "Sábado — Domingo", horas: "Cerrado" },
];

export default function UbicacionSection() {
  return (
    <section
      id="ubicacion"
      className="grid grid-cols-1 items-stretch bg-bg-dark lg:grid-cols-2"
    >
      {/* Panel info */}
      <div className="flex flex-col justify-center gap-5 bg-accent-primary px-5 py-10 text-bg-dark sm:px-8 md:px-10 md:py-8 lg:px-12 lg:py-10">
        <Reveal>
          <h2 className="text-2xl font-medium uppercase leading-none sm:text-3xl md:text-4xl">
            Dónde estamos
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed sm:text-base">
            Te esperamos en nuestro taller. Pásate sin compromiso o llámanos y
            te asesoramos.
          </p>
        </Reveal>

        <StaggerGroup stagger={0.1}>
          <address
            data-stagger
            className="flex items-start gap-3 text-sm not-italic leading-relaxed sm:items-center sm:text-base"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-dark/15">
              <MapPin size={18} aria-hidden="true" />
            </span>
            <span>C. Calahorra, 12, Pab. 1, 26006 Logroño, La Rioja</span>
          </address>

          <div
            data-stagger
            className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href="tel:+34941047695"
              className="flex items-center justify-center gap-2 rounded-lg bg-text-inverse px-4 py-2.5 font-medium text-accent-primary-hover transition hover:bg-bg-dark hover:text-text-inverse sm:w-auto"
            >
              <Phone size={18} aria-hidden="true" />
              941 04 76 95
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Vaqueroil+C.+Calahorra+12+26006+Logro%C3%B1o"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-bg-dark/40 px-4 py-2.5 text-sm font-medium uppercase transition hover:bg-bg-dark/10"
            >
              <Navigation size={18} aria-hidden="true" />
              Cómo llegar
            </a>
          </div>

          <div
            data-stagger
            className="mt-5 border-t border-bg-dark/25 pt-4"
          >
            <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
              <Clock size={16} aria-hidden="true" />
              Horario
            </h3>
            <dl className="mt-2 flex flex-col">
              {horario.map(({ dias, horas }) => (
                <div
                  key={dias}
                  className="flex items-center justify-between gap-6 border-b border-bg-dark/15 py-2 last:border-0"
                >
                  <dt>{dias}</dt>
                  <dd
                    className={
                      horas === "Cerrado"
                        ? "rounded-full bg-bg-dark px-3 py-0.5 text-sm uppercase tracking-wide text-text-inverse"
                        : "font-medium tabular-nums"
                    }
                  >
                    {horas}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </StaggerGroup>
      </div>

      {/* Mapa */}
      <Reveal y={0} duration={0.9} className="relative h-[320px] sm:h-[380px] lg:h-auto lg:min-h-full">
        <div className="relative h-[320px] sm:h-[380px] lg:h-auto lg:min-h-full">
          <ConsentMap
            title="Mapa de Vaqueroil en C. Calahorra, 12, Logroño"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23547.185522801108!2d-2.4296745594073483!3d42.461819182894864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5aab2f44b4360f%3A0x9cbb66c643f0db3f!2sVaqueroil!5e0!3m2!1ses!2ses!4v1789213239531!5m2!1ses!2ses"
          />
        </div>
      </Reveal>
    </section>
  );
}

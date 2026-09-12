import { Clock, MapPin, Navigation, Phone } from "lucide-react";

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
      <div className="flex flex-col justify-center gap-5 bg-accent-primary px-8 py-8 text-text-inverse md:px-10 lg:px-12 lg:py-10">
        <div>
          <h2 className="text-3xl font-medium uppercase leading-none md:text-4xl">
            Dónde estamos
          </h2>
          <p className="mt-2 max-w-md leading-relaxed text-text-inverse/90">
            Te esperamos en nuestro taller. Pásate sin compromiso o llámanos y
            te asesoramos.
          </p>
        </div>

        <address className="flex items-center gap-3 not-italic leading-relaxed">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-text-inverse/15">
            <MapPin size={18} aria-hidden="true" />
          </span>
          <span>
            C. Calahorra, 12, Pab. 1, 26006 Logroño, La Rioja
          </span>
        </address>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+34941047695"
            className="flex items-center gap-2 rounded-lg bg-text-inverse px-4 py-2.5 font-medium text-accent-primary transition hover:bg-bg-dark hover:text-text-inverse"
          >
            <Phone size={18} aria-hidden="true" />
            941 04 76 95
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Vaqueroil+C.+Calahorra+12+26006+Logro%C3%B1o"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-text-inverse/40 px-4 py-2.5 text-sm font-medium uppercase transition hover:bg-text-inverse/10"
          >
            <Navigation size={18} aria-hidden="true" />
            Cómo llegar
          </a>
        </div>

        <div className="border-t border-text-inverse/25 pt-4">
          <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-text-inverse/80">
            <Clock size={16} aria-hidden="true" />
            Horario
          </h3>
          <dl className="mt-2 flex flex-col">
            {horario.map(({ dias, horas }) => (
              <div
                key={dias}
                className="flex items-center justify-between gap-6 border-b border-text-inverse/15 py-2 last:border-0"
              >
                <dt>{dias}</dt>
                <dd
                  className={
                    horas === "Cerrado"
                      ? "rounded-full bg-bg-dark/25 px-3 py-0.5 text-sm uppercase tracking-wide"
                      : "font-medium tabular-nums"
                  }
                >
                  {horas}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Mapa */}
      <div className="relative min-h-[320px] lg:min-h-full">
        <iframe
          title="Mapa de Vaqueroil en C. Calahorra, 12, Logroño"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23547.185522801108!2d-2.4296745594073483!3d42.461819182894864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5aab2f44b4360f%3A0x9cbb66c643f0db3f!2sVaqueroil!5e0!3m2!1ses!2ses!4v1789213239531!5m2!1ses!2ses"
          className="absolute inset-0 block h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import BrandButton from "./ui/BrandButton";

const exploreLinks = [
  { label: "Servicios", href: "/services" },
  { label: "Pedir cita", href: "/request-appointment-quote" },
  { label: "Sobre nosotros", href: "/about-us" },
  { label: "Contacto", href: "/contact" },
];

const horario = [
  { dias: "Lunes — Viernes", horas: "9:00–13:30 · 16:00–19:30" },
  { dias: "Sábado — Domingo", horas: "Cerrado" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark bg-felt text-text-inverse">
      <div className="mx-auto w-full max-w-7xl px-8 py-14 md:px-15 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1.1fr] lg:gap-10">
          {/* Marca */}
          <div className="flex flex-col items-start gap-5">
            <Link href="/" aria-label="Vaqueroil - inicio">
              <Image
                src="/logo.png"
                alt="Vaqueroil"
                width={200}
                height={64}
                className="h-auto w-44"
              />
            </Link>
            <p className="max-w-xs text-lg leading-relaxed text-text-inverse/70">
              Tu vehículo, en las mejores manos. Mantenimiento y reparación
              profesional en Logroño.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <BrandButton link="/request-appointment-quote" text="Pedir cita" />
              <a
                href="tel:+34941047695"
                className="flex items-center gap-2 rounded-lg border border-text-inverse/25 px-4 py-3 text-sm font-medium transition hover:border-accent-primary hover:text-accent-primary"
              >
                <Phone size={16} aria-hidden="true" />
                941 04 76 95
              </a>
            </div>
          </div>

          {/* Explorar */}
          <nav aria-label="Explorar">
            <h2 className="font-link text-sm uppercase tracking-widest text-accent-primary">
              Explorar
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {exploreLinks.map(({ label, href }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    className="text-text-inverse/75 transition-colors hover:text-accent-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div className="rounded-2xl bg-surface-mid p-6">
            <h2 className="font-link text-sm uppercase tracking-widest text-accent-primary">
              Contacto
            </h2>
            <address className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-text-inverse/80 not-italic">
              <MapPin
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-accent-primary"
              />
              C. Calahorra, 12, Pab. 1, 26006 Logroño, La Rioja
            </address>
            <div className="mt-4 flex items-center gap-2 border-t border-text-inverse/10 pt-4 text-sm">
              <Clock
                size={16}
                aria-hidden="true"
                className="shrink-0 text-accent-primary"
              />
              <span className="text-text-inverse/80">
                Lun–Vie · 9:00–13:30 · 16:00–19:30
              </span>
            </div>
            <dl className="sr-only">
              {horario.map(({ dias, horas }) => (
                <div key={dias}>
                  <dt>{dias}</dt>
                  <dd>{horas}</dd>
                </div>
              ))}
            </dl>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Vaqueroil+C.+Calahorra+12+26006+Logro%C3%B1o"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-text-inverse/25 px-4 py-2.5 text-sm font-medium uppercase transition hover:bg-text-inverse/10"
            >
              <Navigation size={16} aria-hidden="true" />
              Cómo llegar
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-text-inverse/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-8 py-6 text-sm text-text-inverse/50 md:flex-row md:px-15">
          <p>© {year} Vaqueroil · Logroño, La Rioja</p>
          <div className="flex items-center gap-5">
            <Link href="/legal" className="transition-colors hover:text-text-inverse">
              Aviso legal
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-text-inverse/35 transition-colors hover:text-text-inverse"
            >
              Acceso empleados
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import BrandButton from "./ui/BrandButton";
import CookieSettingsButton from "./cookies/CookieSettingsButton";
import Reveal from "@/components/animations/Reveal";
import StaggerGroup from "@/components/animations/StaggerGroup";

const exploreLinks = [
  { label: "Servicios", href: "/services" },
  { label: "Pedir cita", href: "/request-appointment-quote" },
  { label: "Sobre nosotros", href: "/about-us" },
  { label: "Contacto", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark bg-felt text-text-inverse">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-14 md:px-15 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:gap-10">
          {/* Marca */}
          <Reveal>
            <div className="flex flex-col items-start gap-5">
              <Link href="/" aria-label="Vaqueroil - inicio">
                <Image
                  src="/logo.png"
                  alt="Vaqueroil, taller multimarca en Logroño"
                  width={200}
                  height={64}
                  className="h-auto w-36 sm:w-44"
                />
              </Link>
              <p className="max-w-xs text-base leading-relaxed text-text-inverse/70 sm:text-lg">
                Tu vehículo, en las mejores manos. Mantenimiento y reparación
                profesional en Logroño.
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center [&>a:first-child]:justify-center">
                <BrandButton
                  link="/request-appointment-quote"
                  text="Pedir cita"
                />
                <a
                  href="tel:+34941047695"
                  className="flex items-center justify-center gap-2 rounded-lg border border-text-inverse/25 px-4 py-3 text-sm font-medium transition hover:border-accent-primary hover:text-accent-primary"
                >
                  <Phone size={16} aria-hidden="true" />
                  941 04 76 95
                </a>
              </div>
            </div>
          </Reveal>

          {/* Explorar */}
          <Reveal delay={0.1}>
            <nav aria-label="Explorar">
              <h2 className="font-link text-sm uppercase tracking-widest text-accent-primary">
                Explorar
              </h2>
              <StaggerGroup stagger={0.06} y={14}>
                <ul className="mt-5 flex flex-col gap-1">
                  {exploreLinks.map(({ label, href }) => (
                    <li key={href + label} data-stagger>
                      <Link
                        href={href}
                        className="inline-block py-1 text-text-inverse/75 transition-colors hover:text-accent-primary"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </StaggerGroup>
            </nav>
          </Reveal>
        </div>
      </div>

      <div className="border-t border-text-inverse/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center text-sm text-text-inverse/50 sm:px-8 md:flex-row md:px-15 md:text-left">
          <p>© {year} Vaqueroil · Logroño, La Rioja</p>
          <div className="flex items-center gap-5">
            <Link
              href="/legal"
              className="transition-colors hover:text-text-inverse"
            >
              Aviso legal
            </Link>
            <CookieSettingsButton />
            <Link
              href="/admin/dashboard"
              className="text-text-inverse/35 transition-colors hover:text-text-inverse"
            >
              Acceso empleados
            </Link>
          </div>
        </div>
        <p className="mx-auto w-full max-w-7xl px-5 pb-6 text-center text-xs leading-relaxed text-text-inverse/40 sm:px-8 md:px-15">
          Página de demostración con fines de prueba: no es la web oficial del
          taller y su contenido (servicios, opiniones y datos mostrados) puede
          no corresponderse con la realidad.
        </p>
      </div>
    </footer>
  );
}

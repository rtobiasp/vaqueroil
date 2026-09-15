import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home, Phone, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Página no encontrada | Vaqueroil",
  description:
    "La página que buscas no existe o se ha movido. Vuelve al inicio o pide cita en Vaqueroil, tu taller de confianza en Logroño.",
};

const quickLinks = [
  { label: "Servicios", href: "/services" },
  { label: "Sobre nosotros", href: "/about-us" },
  { label: "Contacto", href: "/contact" },
  { label: "Pedir cita", href: "/request-appointment-quote" },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-bg-dark text-text-inverse">
      {/* Fondo */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/hero_background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
      </div>
      <div className="absolute inset-0 bg-bg-dark/45" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent"
        aria-hidden="true"
      />

      {/* Logo superior */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-6 sm:px-8">
        <Link href="/" aria-label="Vaqueroil - volver al inicio">
          <Image
            src="/logo.png"
            alt="Vaqueroil"
            width={180}
            height={58}
            priority
            className="h-auto w-36 rounded-xl bg-bg-dark/60 p-1.5 sm:w-44"
          />
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-text-inverse/20 bg-bg-dark/60 px-4 py-2 font-link text-xs tracking-widest text-text-inverse/80 uppercase sm:flex">
          <Wrench size={14} aria-hidden="true" className="text-accent-primary" />
          Error 404
        </span>
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <p className="flex items-center gap-2 rounded-full border border-text-inverse/20 bg-bg-dark/60 px-4 py-2 font-link text-xs tracking-widest text-text-inverse/80 uppercase sm:hidden">
          <Wrench size={14} aria-hidden="true" className="text-accent-primary" />
          Error 404
        </p>

        <p
          aria-hidden="true"
          className="mt-6 font-body text-[96px] leading-none font-extrabold tracking-tighter select-none sm:text-[180px] md:text-[220px]"
        >
          4<span className="text-accent-primary">0</span>4
        </p>

        <h1 className="mt-2 max-w-2xl font-body text-3xl leading-tight font-bold text-balance sm:text-4xl md:text-5xl">
          Te has salido de la carretera.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-text-inverse/75 sm:text-lg">
          La página que buscas no existe, se ha movido o el enlace está
          averiado. No te preocupes: en Vaqueroil lo dejamos todo a punto.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-6 py-3.5 text-sm font-semibold uppercase transition-colors duration-200 hover:bg-accent-primary-hover"
          >
            <Home size={18} aria-hidden="true" />
            Volver al inicio
          </Link>
          <Link
            href="/request-appointment-quote"
            className="flex items-center justify-center gap-2 rounded-lg border border-text-inverse/25 bg-bg-dark/60 px-6 py-3.5 text-sm font-semibold uppercase transition hover:border-accent-primary hover:text-accent-primary"
          >
            <ArrowLeft size={18} aria-hidden="true" className="rotate-180" />
            Pedir cita
          </Link>
        </div>

        <a
          href="tel:+34941047695"
          className="mt-6 flex items-center gap-2 text-sm text-text-inverse/70 transition-colors hover:text-accent-primary"
        >
          <Phone size={16} aria-hidden="true" />
          ¿Prefieres llamar? 941 04 76 95
        </a>

        <nav
          aria-label="Enlaces útiles"
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-text-inverse/10 pt-6"
        >
          {quickLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-link text-sm text-text-inverse/60 transition-colors hover:text-text-inverse"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="relative z-10 pb-6 text-center font-link text-xs text-text-inverse/40">
        Vaqueroil · Logroño, La Rioja
      </p>
    </main>
  );
}

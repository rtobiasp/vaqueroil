"use client";

import Image from "next/image";
import Link from "next/link";
import logo_img from "@/public/logo.png";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap, useGSAP, isReducedMotion } from "@/lib/gsap";

const links = [
  { label: "SERVICIOS", href: "/services" },
  { label: "CONTACTO", href: "/contact" },
  { label: "SOBRE NOSOTROS", href: "/about-us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || isReducedMotion()) return;
      const tween = gsap.fromTo(
        root.current,
        { autoAlpha: 0, y: -18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.05 },
      );
      return () => {
        tween.kill();
      };
    },
    { scope: root },
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled((current) =>
        current ? window.scrollY > 20 : window.scrollY > 60,
      );
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={root}
      className={`sticky top-3 z-50 flex h-20 w-full items-center justify-between px-4 text-text-inverse transition-colors duration-300 sm:top-5 sm:px-8 lg:px-15`}
    >
      <Link href="/" className="shrink-0" aria-label="Vaqueroil - inicio">
        <Image
          src={logo_img}
          alt="Logo principal del sitio web"
          loading="eager"
          className={`h-auto max-h-full rounded-xl transition-all duration-300 ${
            scrolled ? "w-40 bg-bg-dark p-2 " : "w-50"
          }`}
        />
      </Link>
      {/* Desktop nav */}
      <nav
        aria-label="Navegación principal"
        className="hidden h-[70%] rounded-xl bg-bg-light p-1 text-text-main lg:block"
      >
        <ul className="flex h-full flex-row gap-1">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="flex h-full items-center justify-between rounded-xl px-6 py-1 transition-colors duration-200 hover:bg-accent-primary hover:text-text-inverse"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="/request-appointment-quote"
              className="flex h-full items-center justify-between rounded-xl bg-bg-dark px-6 py-1 text-text-inverse transition-colors duration-200 hover:bg-accent-primary"
            >
              RESERVAR
            </a>
          </li>
        </ul>
      </nav>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-light text-text-main motion-safe:transition-transform motion-safe:active:scale-95 lg:hidden"
      >
        <span className="relative block h-5.5 w-5.5" aria-hidden="true">
          <Menu
            size={22}
            className={`absolute inset-0 motion-safe:transition-all motion-safe:duration-300 ${
              open
                ? "scale-50 rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
          />
          <X
            size={22}
            className={`absolute inset-0 motion-safe:transition-all motion-safe:duration-300 ${
              open
                ? "scale-100 rotate-0 opacity-100"
                : "scale-50 -rotate-90 opacity-0"
            }`}
          />
        </span>
      </button>
      {/* Mobile nav */}
      <nav
        aria-label="Navegación móvil"
        aria-hidden={!open}
        className={`absolute inset-x-4 top-full mt-2 origin-top overflow-hidden rounded-2xl bg-bg-light text-text-main shadow-xl motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out lg:hidden ${
          open
            ? "visible max-h-105 scale-100 translate-y-0 opacity-100"
            : "invisible max-h-0 scale-[0.98] -translate-y-2 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-2">
          {links.map((link, i) => (
            <li
              key={link.label}
              style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
              className={`motion-safe:transition-all motion-safe:duration-300 ${
                open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
              }`}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="block rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-accent-primary hover:text-text-inverse"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            style={{
              transitionDelay: open ? `${100 + links.length * 60}ms` : "0ms",
            }}
            className={`mt-1 border-t border-text-main/10 pt-2 motion-safe:transition-all motion-safe:duration-300 ${
              open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            }`}
          >
            <a
              href="/request-appointment-quote"
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
              className="block rounded-xl bg-bg-dark px-4 py-3 text-center text-sm font-medium text-text-inverse transition-colors hover:bg-accent-primary"
            >
              RESERVAR
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

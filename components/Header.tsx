"use client";

import Image from "next/image";
import logo_img from "@/public/logo.png";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
      className={`sticky top-5 z-50 flex h-20 w-full items-center justify-between text-text-inverse px-15 transition-colors duration-300`}
    >
      <a href="/">
        <Image
          src={logo_img}
          alt="Logo principal del sitio web"
          loading="eager"
          className={`h-auto max-h-full rounded-xl transition-all duration-300 ${
            scrolled ? "w-40 bg-bg-dark p-2 " : "w-50"
          }`}
        />
      </a>
      <nav className="h-[70%] p-1 rounded-xl bg-bg-light text-text-main">
        <ul className="flex flex-row gap-1 h-full">
          <li>
            <a
              href="/request-appointment-quote"
              className="flex justify-between items-center rounded-xl py-1 px-6 h-full transition-colors duration-200 hover:bg-accent-primary hover:text-text-inverse"
            >
              SERVICIOS
            </a>
          </li>
          <li>
            <a
              href="/request-appointment-quote"
              className="flex justify-between items-center rounded-xl py-1 px-6 h-full transition-colors duration-200 hover:bg-accent-primary hover:text-text-inverse"
            >
              CONTACTO
            </a>
          </li>
          <li>
            <a
              href="/request-appointment-quote"
              className="flex justify-between items-center rounded-xl py-1 px-6 h-full transition-colors duration-200  hover:bg-accent-primary hover:text-text-inverse"
            >
              SOBRE NOSOTROS
            </a>
          </li>
          <li>
            <a
              href="/request-appointment-quote"
              className="flex justify-between items-center rounded-xl py-1 px-6 h-full transition-colors duration-200 bg-bg-dark text-text-inverse hover:bg-accent-primary"
            >
              RESERVAR
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

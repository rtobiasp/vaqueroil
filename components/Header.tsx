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
      className={`sticky top-0 z-50 flex h-20 items-center justify-between px-8 transition-colors duration-300 ${
        scrolled ? "bg-accent-foreground/95 shadow-xl" : "bg-transparent"
      }`}
    >
      <a href="/">
        <Image
          src={logo_img}
          alt="Logo principal del sitio web"
          className={`h-auto max-h-full transition-all duration-300 ${
            scrolled ? "w-40" : "w-50"
          }`}
        />
      </a>
      <nav>
        <ul className="flex flex-row gap-3">
          <li>
            <a href="">ELEMENTO 1</a>
          </li>
          <li>
            <a href="">ELEMENTO 1</a>
          </li>
        </ul>
      </nav>
      <div>BOTON RESERVAR</div>
    </header>
  );
}

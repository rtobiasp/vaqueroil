"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const labels: Record<string, string> = {
    "about-us": "Nosotros",
    services: "Servicios",
    contact: "Contacto",
    legal: "Aviso legal",
    "request-appointment-quote": "Pedir cita",
    admin: "Administración",
    dashboard: "Panel",
    appointments: "Citas",
    cars: "Vehículos",
    users: "Usuarios",
  };

  // Limpiar y separar la ruta (ej: /productos/categoria/1 -> ['productos', 'categoria', '1'])
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Migas de pan"
      className="inline-flex max-w-full items-center py-1.5 pr-4 pl-4"
    >
      <ol className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium tracking-wide whitespace-nowrap text-white/75">
        <li className="shrink-0">
          <Link
            href="/"
            className="inline-block rounded-full px-2 py-1 transition-colors hover:text-white"
          >
            Inicio
          </Link>
        </li>
        {segments.map((segment, index) => {
          // Construir la URL acumulativa para cada paso
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          // Formatear el texto: usar etiqueta en español si existe,
          // si no reemplazar guiones y capitalizar
          const decoded = decodeURIComponent(segment);
          const formattedName =
            labels[segment] ??
            decoded.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

          return (
            <React.Fragment key={href}>
              <span
                aria-hidden="true"
                className="shrink-0 text-white/40 select-none"
              >
                /
              </span>
              <li className="min-w-0 flex items-center justify-center">
                {isLast ? (
                  <span
                    className="inline-block max-w-[40vw] truncate rounded-full bg-white/15 px-2.5 py-0.5 font-semibold text-white sm:max-w-none"
                    aria-current="page"
                  >
                    {formattedName}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="inline-block rounded-full px-2 py-1 transition-colors hover:text-white"
                  >
                    {formattedName}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

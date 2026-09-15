import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import Link from "next/link";
import type { ServicioFila } from "./actions";
import { formatoPrecio } from "./status";
import { AccionesServicio } from "./row-actions";

type Props = {
  servicios: ServicioFila[];
  totalMostrados: number;
  conFiltroAtras: boolean;
  hrefPrimera: string;
  hrefSiguiente: string | null;
  haySiguiente: boolean;
};

export function ServicesGrid({
  servicios,
  totalMostrados,
  conFiltroAtras,
  hrefPrimera,
  hrefSiguiente,
  haySiguiente,
}: Props) {
  return (
    <section className="min-w-0">
      {servicios.length === 0 ? (
        <p className="rounded-2xl border border-black/5 bg-white px-4 py-8 text-center text-sm text-text-main/60 shadow-sm">
          Sin resultados para los filtros aplicados.
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {servicios.map((servicio) => (
          <article
            key={servicio.id}
            className="flex min-w-0 flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-lg bg-bg-dark p-2 text-text-inverse">
                  <Wrench size={18} />
                </span>
                <h2 className="min-w-0 truncate text-sm font-semibold sm:text-base">
                  {servicio.name}
                </h2>
              </div>
              <span className="shrink-0 rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium whitespace-nowrap">
                {servicio.citas} {servicio.citas === 1 ? "cita" : "citas"}
              </span>
            </div>

            <p className="text-2xl font-bold sm:text-3xl">
              {formatoPrecio(servicio.price)}
            </p>
            {servicio.description ? (
              <p className="text-sm text-text-main/60">{servicio.description}</p>
            ) : (
              <p className="text-sm text-text-main/40 italic">Sin descripción.</p>
            )}

            <div className="mt-auto border-t border-black/5 pt-3">
              <AccionesServicio servicio={servicio} />
            </div>
          </article>
        ))}
      </div>

      <footer className="mt-4 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 text-xs text-text-main/60 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>Mostrando {totalMostrados} servicios</p>
        <div className="flex items-center gap-2">
          {conFiltroAtras ? (
            <Link
              href={hrefPrimera}
              className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
            >
              <ChevronLeft size={14} /> Primera
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium opacity-50">
              <ChevronLeft size={14} /> Primera
            </span>
          )}
          {haySiguiente && hrefSiguiente ? (
            <Link
              href={hrefSiguiente}
              className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
            >
              Siguiente <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium opacity-50">
              Siguiente <ChevronRight size={14} />
            </span>
          )}
        </div>
      </footer>
    </section>
  );
}

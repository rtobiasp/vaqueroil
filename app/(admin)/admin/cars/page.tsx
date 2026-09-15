import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCars, getCarSummary } from "./actions";
import { CarsGrid } from "./cars-grid";
import { FiltrosCoches } from "./filters";
import { ESTADOS } from "./status";
import { SummaryCards } from "./summary-cards";
import { NuevoCocheButton } from "./create-button";

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const primero = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const afterParam = primero(params.after);
  const q = (primero(params.q) ?? "").trim();
  const estadoParam = (primero(params.estado) ?? "").trim();

  const estadoActual = ESTADOS.some((e) => e.valor === estadoParam)
    ? estadoParam
    : "";

  const [{ items: coches, nextCursor, hasNext }, resumen] = await Promise.all([
    getCars({
      after: afterParam,
      q,
      estado: estadoActual === "ALL" ? undefined : estadoActual || undefined,
    }),
    getCarSummary(),
  ]);

  const baseQuery = new URLSearchParams();
  if (q) baseQuery.set("q", q);
  if (estadoActual && estadoActual !== "ALL")
    baseQuery.set("estado", estadoActual);
  const qsBase = baseQuery.toString();
  const hrefPrimera = qsBase ? `/admin/cars?${qsBase}` : "/admin/cars";
  const hrefSiguiente =
    nextCursor != null
      ? `/admin/cars?${new URLSearchParams({
          ...Object.fromEntries(baseQuery),
          after: nextCursor,
        }).toString()}`
      : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-text-inverse/60 sm:text-sm">Gestión</p>
          <h1 className="text-2xl font-bold text-text-inverse sm:text-3xl">
            Coches
          </h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Vehículos registrados, dueños y estado en el taller
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <NuevoCocheButton />
        </div>
      </div>

      <SummaryCards resumen={resumen} />

      <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
        <FiltrosCoches estados={ESTADOS} estadoActual={estadoActual} />
      </section>

      <CarsGrid coches={coches} />

      <footer className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 text-xs text-text-main/60 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>Mostrando {coches.length} coches</p>
        <div className="flex items-center gap-2">
          {conFiltroAtras(hrefPrimera, afterParam)}
          {siguiente(hrefSiguiente, hasNext)}
        </div>
      </footer>
    </div>
  );
}

function conFiltroAtras(hrefPrimera: string, afterParam: string | undefined) {
  if (afterParam) {
    return (
      <Link
        href={hrefPrimera}
        className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
      >
        <ChevronLeft size={14} /> Primera
      </Link>
    );
  }
  return (
    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium opacity-50">
      <ChevronLeft size={14} /> Primera
    </span>
  );
}

function siguiente(hrefSiguiente: string | null, hasNext: boolean) {
  if (hasNext && hrefSiguiente) {
    return (
      <Link
        href={hrefSiguiente}
        className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
      >
        Siguiente <ChevronRight size={14} />
      </Link>
    );
  }
  return (
    <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium opacity-50">
      Siguiente <ChevronRight size={14} />
    </span>
  );
}

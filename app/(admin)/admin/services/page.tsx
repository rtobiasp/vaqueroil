import { getServices, getServiceSummary } from "./actions";
import { ServicesGrid } from "./services-grid";
import { FiltrosServicios } from "./filters";
import { FILTROS } from "./status";
import { SummaryCards } from "./summary-cards";
import { NuevoServicioButton } from "./create-button";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const primero = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const afterParam = primero(params.after);
  const q = (primero(params.q) ?? "").trim();
  const filtroParam = (primero(params.filtro) ?? "").trim();

  const filtroActual = FILTROS.some((f) => f.valor === filtroParam)
    ? filtroParam
    : "";

  const [{ items: servicios, nextCursor, hasNext }, resumen] =
    await Promise.all([
      getServices({
        after: afterParam,
        q,
        filtro: filtroActual === "ALL" ? undefined : filtroActual || undefined,
      }),
      getServiceSummary(),
    ]);

  const baseQuery = new URLSearchParams();
  if (q) baseQuery.set("q", q);
  if (filtroActual && filtroActual !== "ALL")
    baseQuery.set("filtro", filtroActual);
  const qsBase = baseQuery.toString();
  const hrefPrimera = qsBase ? `/admin/services?${qsBase}` : "/admin/services";
  const hrefSiguiente =
    nextCursor != null
      ? `/admin/services?${new URLSearchParams({
          ...Object.fromEntries(baseQuery),
          after: nextCursor,
        }).toString()}`
      : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-text-inverse/60 sm:text-sm">Catálogo</p>
          <h1 className="text-2xl font-bold text-text-inverse sm:text-3xl">
            Servicios
          </h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Precios, descripciones y citas de cada servicio
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <NuevoServicioButton />
        </div>
      </div>

      <SummaryCards resumen={resumen} />

      <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
        <FiltrosServicios filtros={FILTROS} filtroActual={filtroActual} />
      </section>

      <ServicesGrid
        servicios={servicios}
        totalMostrados={servicios.length}
        conFiltroAtras={Boolean(afterParam)}
        hrefPrimera={hrefPrimera}
        hrefSiguiente={hrefSiguiente}
        haySiguiente={hasNext}
      />

      <p className="text-xs text-text-inverse/50 sm:text-sm">
        Los cambios de precio solo se aplican a las citas nuevas; el historial
        conserva el precio original.
      </p>
    </div>
  );
}

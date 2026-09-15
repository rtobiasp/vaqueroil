import { Plus } from "lucide-react";
import { getAppointments, getAppointmentSummary } from "./actions";
import { AppointmentsTable } from "./appointments-table";
import { FiltrosCitas } from "./filters";
import { ESTADOS } from "./status";
import { SummaryCards } from "./summary-cards";

export default async function AppointmentsPage({
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
  const fechaParam = (primero(params.fecha) ?? "").trim();

  const estadoActual = ESTADOS.some((e) => e.valor === estadoParam)
    ? estadoParam
    : "";

  const [{ items: citas, nextCursor, hasNext }, resumen] = await Promise.all([
    getAppointments({
      after: afterParam,
      q,
      estado: estadoActual === "ALL" ? undefined : estadoActual || undefined,
      fecha: fechaParam || undefined,
    }),
    getAppointmentSummary(),
  ]);

  const baseQuery = new URLSearchParams();
  if (q) baseQuery.set("q", q);
  if (estadoActual && estadoActual !== "ALL")
    baseQuery.set("estado", estadoActual);
  if (fechaParam) baseQuery.set("fecha", fechaParam);
  const qsBase = baseQuery.toString();
  const hrefPrimera = qsBase
    ? `/admin/appointments?${qsBase}`
    : "/admin/appointments";
  const hrefSiguiente =
    nextCursor != null
      ? `/admin/appointments?${new URLSearchParams({
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
            Citas
          </h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Planifica, confirma y sigue cada cita del taller
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-bg-dark transition-colors hover:bg-accent-primary-hover hover:text-text-inverse sm:w-auto"
          >
            <Plus size={16} /> Nueva cita
          </button>
        </div>
      </div>

      <SummaryCards resumen={resumen} />

      <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
        <FiltrosCitas estados={ESTADOS} estadoActual={estadoActual} />
      </section>

      <AppointmentsTable
        citas={citas}
        totalMostradas={citas.length}
        conFiltroAtras={Boolean(afterParam)}
        hrefPrimera={hrefPrimera}
        hrefSiguiente={hrefSiguiente}
        haySiguiente={hasNext}
      />
    </div>
  );
}

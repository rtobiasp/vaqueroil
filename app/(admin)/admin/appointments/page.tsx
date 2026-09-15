import {
  Bell,
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { getAppointments } from "./actions";

// TODO(funcionalidad): cablear búsqueda, filtro por estado/fecha,
// y acciones (confirmar / iniciar / completar / cancelar).
// Solo visual: sin handlers, sin server actions.

type EstadoCita =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const ESTADOS: { valor: EstadoCita | "ALL"; etiqueta: string }[] = [
  { valor: "ALL", etiqueta: "Todas" },
  { valor: "PENDING", etiqueta: "Pendientes" },
  { valor: "CONFIRMED", etiqueta: "Confirmadas" },
  { valor: "IN_PROGRESS", etiqueta: "En taller" },
  { valor: "COMPLETED", etiqueta: "Completadas" },
  { valor: "CANCELLED", etiqueta: "Canceladas" },
];

const ESTILO_ESTADO: Record<EstadoCita, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  CONFIRMED: "border-sky-200 bg-sky-50 text-sky-800",
  IN_PROGRESS: "border-violet-200 bg-violet-50 text-violet-800",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-black/10 bg-bg-light text-text-main/60",
};

const ETIQUETA_ESTADO: Record<EstadoCita, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En taller",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

const RESUMEN = [
  { titulo: "Citas hoy", valor: "6", icono: CalendarDays },
  { titulo: "Pendientes", valor: "3", icono: Bell },
  { titulo: "En taller", valor: "2", icono: Car },
  { titulo: "Huecos libres", valor: "4", icono: Clock },
];

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const afterParam = Array.isArray(params.after)
    ? params.after[0]
    : params.after;

  const { items: citas, nextCursor, hasNext } =
    await getAppointments(afterParam);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      {/* Cabecera */}
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary-hover sm:w-auto"
          >
            <Plus size={16} /> Nueva cita
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {RESUMEN.map((item) => (
          <div
            key={item.titulo}
            className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-medium text-text-main/60">
                {item.titulo}
              </p>
              <item.icono size={20} className="shrink-0 text-accent-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">{item.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-main/40"
            />
            <input
              type="search"
              placeholder="Buscar por cliente, matrícula o servicio…"
              className="w-full rounded-md border border-black/10 bg-bg-light py-2 pr-3 pl-10 text-sm text-text-main placeholder:text-text-main/40 focus:border-accent-primary focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="shrink-0 text-text-main/60">Fecha</span>
            <input
              type="date"
              className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 text-sm text-text-main focus:border-accent-primary focus:outline-none lg:w-auto"
            />
          </label>
        </div>
        {/* TODO(funcionalidad): convertir en filtro real por estado */}
        <div className="mt-3 flex flex-wrap gap-2">
          {ESTADOS.map((estado, i) => (
            <span
              key={estado.valor}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${
                i === 0
                  ? "border-bg-dark bg-bg-dark text-text-inverse"
                  : "border-black/10 bg-bg-light text-text-main hover:border-black/20"
              }`}
            >
              {estado.etiqueta}
            </span>
          ))}
        </div>
      </section>

      {/* Tabla */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-black/5 bg-white text-text-main shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs text-text-main/60 uppercase">
                <th className="px-4 py-3 font-medium sm:px-5">Cliente</th>
                <th className="px-4 py-3 font-medium">Coche</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium sm:pr-5">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {citas.map((cita) => (
                <tr key={cita.id} className="align-top hover:bg-bg-light/60">
                  <td className="px-4 py-3 sm:px-5">
                    <p className="font-semibold">{cita.userName}</p>
                    <p className="text-xs text-text-main/60">
                      {cita.userPhone ?? cita.userEmail}
                    </p>
                    {cita.notes ? (
                      <p className="mt-1 max-w-55 truncate text-xs text-text-main/60 italic">
                        {cita.notes}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md border border-black/10 bg-bg-light px-2 py-0.5 font-mono text-xs font-bold">
                      {cita.vehiclePlate}
                    </span>
                    <p className="mt-1 text-xs text-text-main/60">
                      {cita.vehicleBrand} {cita.vehicleModel}
                    </p>
                  </td>
                  <td className="px-4 py-3">{cita.serviceName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium">
                      {cita.fechaInicio.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-text-main/60">
                      {cita.fechaInicio.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${ESTILO_ESTADO[cita.status]}`}
                    >
                      {ETIQUETA_ESTADO[cita.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:pr-5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        title="Ver detalle"
                        aria-label={`Ver cita de ${cita.userName}`}
                        className="rounded-md border border-black/10 p-1.5 text-text-main/70 transition-colors hover:bg-bg-light hover:text-text-main"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        title="Editar"
                        aria-label={`Editar cita de ${cita.userName}`}
                        className="rounded-md border border-black/10 p-1.5 text-text-main/70 transition-colors hover:bg-bg-light hover:text-text-main"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title="Confirmar"
                        aria-label={`Confirmar cita de ${cita.userName}`}
                        className="rounded-md border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        title="Cancelar"
                        aria-label={`Cancelar cita de ${cita.userName}`}
                        className="rounded-md border border-red-200 bg-red-50 p-1.5 text-red-700 transition-colors hover:bg-red-100"
                      >
                        <X size={16} />
                      </button>
                      <button
                        type="button"
                        title="Eliminar"
                        aria-label={`Eliminar cita de ${cita.userName}`}
                        className="hidden rounded-md border border-black/10 p-1.5 text-text-main/70 transition-colors hover:bg-bg-light hover:text-text-main sm:block"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación por cursor */}
        <footer className="flex flex-col gap-3 border-t border-black/5 px-4 py-3 text-xs text-text-main/60 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p>Mostrando {citas.length} citas</p>
          <div className="flex items-center gap-2">
            {afterParam ? (
              <Link
                href="/admin/appointments"
                className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
              >
                <ChevronLeft size={14} /> Primera
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium opacity-50">
                <ChevronLeft size={14} /> Primera
              </span>
            )}
            {hasNext && nextCursor ? (
              <Link
                href={`/admin/appointments?after=${nextCursor}`}
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
    </div>
  );
}

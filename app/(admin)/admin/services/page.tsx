import {
  CalendarDays,
  Euro,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Wrench,
} from "lucide-react";

// TODO(funcionalidad): sustituir MOCK_SERVICIOS por lectura a BBDD (services +
// conteo de appointments) y cablear búsqueda, interruptor activo/inactivo,
// crear / editar / eliminar y reordenar.
// Solo visual: sin handlers, sin server actions.

type ServicioMock = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  citas: number;
  activo: boolean;
  destacado?: boolean;
};

const MOCK_SERVICIOS: ServicioMock[] = [
  {
    id: "1",
    nombre: "Cambio de aceite",
    descripcion: "Aceite sintético, filtro y revisión de 15 puntos.",
    precio: "59,95 €",
    citas: 24,
    activo: true,
    destacado: true,
  },
  {
    id: "2",
    nombre: "Revisión completa",
    descripcion: "Diagnóstico, frenos, neumáticos, luces y niveles.",
    precio: "89,00 €",
    citas: 18,
    activo: true,
    destacado: true,
  },
  {
    id: "3",
    nombre: "Pastillas de freno",
    descripcion: "Sustitución por eje con comprobación de discos.",
    precio: "120,00 €",
    citas: 12,
    activo: true,
  },
  {
    id: "4",
    nombre: "Distribución",
    descripcion: "Kit completo con bomba de agua y mano de obra.",
    precio: "450,00 €",
    citas: 6,
    activo: true,
  },
  {
    id: "5",
    nombre: "Aire acondicionado",
    descripcion: "Recarga de gas, limpieza de circuito y filtro.",
    precio: "75,00 €",
    citas: 9,
    activo: true,
  },
  {
    id: "6",
    nombre: "Pre-ITV",
    descripcion: "Inspección previa y gestión de cita en estación.",
    precio: "39,00 €",
    citas: 4,
    activo: false,
  },
];

const RESUMEN = [
  { titulo: "Servicios activos", valor: "8", icono: Wrench },
  { titulo: "Precio medio", valor: "112 €", icono: Euro },
  { titulo: "Más pedido", valor: "Aceite", icono: TrendingUp },
  { titulo: "Citas este mes", valor: "32", icono: CalendarDays },
];

export default function AdminServicesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-text-inverse/60 sm:text-sm">Catálogo</p>
          <h1 className="text-2xl font-bold text-text-inverse sm:text-3xl">
            Servicios
          </h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Precios, descripciones y disponibilidad de cada servicio
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary-hover sm:w-auto"
          >
            <Plus size={16} /> Nuevo servicio
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

      {/* Buscador */}
      <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-main/40"
            />
            <input
              type="search"
              placeholder="Buscar servicios por nombre o descripción…"
              className="w-full rounded-md border border-black/10 bg-bg-light py-2 pr-3 pl-10 text-sm text-text-main placeholder:text-text-main/40 focus:border-accent-primary focus:outline-none"
            />
          </label>
          {/* TODO(funcionalidad): convertir en filtro real por estado */}
          <div className="flex flex-wrap gap-2">
            {["Todos", "Activos", "Inactivos", "Destacados"].map((f, i) => (
              <span
                key={f}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${
                  i === 0
                    ? "border-bg-dark bg-bg-dark text-text-inverse"
                    : "border-black/10 bg-bg-light text-text-main hover:border-black/20"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_SERVICIOS.map((servicio) => (
          <article
            key={servicio.id}
            className={`flex min-w-0 flex-col gap-3 rounded-2xl border bg-white p-4 text-text-main shadow-sm sm:p-5 ${
              servicio.activo ? "border-black/5" : "border-black/5 opacity-75"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-lg bg-bg-dark p-2 text-text-inverse">
                  <Wrench size={18} />
                </span>
                <h2 className="min-w-0 truncate text-sm font-semibold sm:text-base">
                  {servicio.nombre}
                </h2>
              </div>
              {/* TODO(funcionalidad): cablear interruptor activo/inactivo */}
              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                  servicio.activo
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-black/10 bg-bg-light text-text-main/60"
                }`}
              >
                {servicio.activo ? "Activo" : "Inactivo"}
              </span>
            </div>

            <p className="text-2xl font-bold sm:text-3xl">{servicio.precio}</p>
            <p className="text-sm text-text-main/60">{servicio.descripcion}</p>

            <div className="flex flex-wrap items-center gap-2 border-t border-black/5 pt-3 text-xs">
              <span className="rounded-full border border-black/10 bg-bg-light px-3 py-1 font-medium">
                {servicio.citas} citas
              </span>
              {servicio.destacado ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-medium text-amber-800">
                  Destacado
                </span>
              ) : null}
            </div>

            <div className="mt-auto flex gap-2 border-t border-black/5 pt-3">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-bg-dark px-3 py-2 text-xs font-medium text-text-inverse transition-opacity hover:opacity-90"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                type="button"
                title="Eliminar"
                aria-label={`Eliminar ${servicio.nombre}`}
                className="rounded-md border border-black/10 p-2 text-text-main/70 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Nota inferior */}
      <p className="text-xs text-text-inverse/50 sm:text-sm">
        Los cambios de precio solo se aplican a las citas nuevas; el historial
        conserva el precio original.
      </p>
    </div>
  );
}

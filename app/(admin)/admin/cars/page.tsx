import {
  CalendarDays,
  Car,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wrench,
} from "lucide-react";

// TODO(funcionalidad): sustituir MOCK_COCHES por lectura a BBDD (vehicles +
// join users/appointments para dueño y estado) y cablear búsqueda, filtros,
// paginación y acciones (ver / editar / eliminar).
// Solo visual: sin handlers, sin server actions.

type CocheMock = {
  id: string;
  matricula: string;
  marca: string;
  modelo: string;
  ano: number;
  vin: string;
  dueno: string;
  estado: "En taller" | "Con cita" | "Disponible";
  proximaCita: string;
};

const MOCK_COCHES: CocheMock[] = [
  {
    id: "1",
    matricula: "1234 ABC",
    marca: "BMW",
    modelo: "320d",
    ano: 2019,
    vin: "WBA8H3105K1234567",
    dueno: "Rubén Vaquero",
    estado: "En taller",
    proximaCita: "Hoy 09:00",
  },
  {
    id: "2",
    matricula: "5678 DEF",
    marca: "Seat",
    modelo: "León",
    ano: 2021,
    vin: "VSSZZZ5FZMR654321",
    dueno: "María López",
    estado: "En taller",
    proximaCita: "Hoy 10:30",
  },
  {
    id: "3",
    matricula: "9012 GHI",
    marca: "Audi",
    modelo: "A4",
    ano: 2018,
    vin: "WAUZZZ8K8JA098765",
    dueno: "Javier Ruiz",
    estado: "Con cita",
    proximaCita: "Mañana 12:00",
  },
  {
    id: "4",
    matricula: "3456 JKL",
    marca: "Volkswagen",
    modelo: "Golf",
    ano: 2020,
    vin: "WVWZZZAUZLW112233",
    dueno: "Lucía Fernández",
    estado: "Con cita",
    proximaCita: "18 sept 09:00",
  },
  {
    id: "5",
    matricula: "7890 MNO",
    marca: "Peugeot",
    modelo: "3008",
    ano: 2022,
    vin: "VF3MCYHZKMS445566",
    dueno: "Carlos Méndez",
    estado: "Disponible",
    proximaCita: "Sin citas",
  },
  {
    id: "6",
    matricula: "2345 PQR",
    marca: "Renault",
    modelo: "Clio",
    ano: 2017,
    vin: "VF15R040A61234567",
    dueno: "Ana Torres",
    estado: "Disponible",
    proximaCita: "Sin citas",
  },
];

const ESTILO_ESTADO: Record<CocheMock["estado"], string> = {
  "En taller": "border-violet-200 bg-violet-50 text-violet-800",
  "Con cita": "border-sky-200 bg-sky-50 text-sky-800",
  Disponible: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const RESUMEN = [
  { titulo: "Total coches", valor: "48", icono: Car },
  { titulo: "En taller", valor: "2", icono: Wrench },
  { titulo: "Con cita próxima", valor: "7", icono: CalendarDays },
  { titulo: "Sin actividad", valor: "39", icono: Search },
];

export default function CarsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      {/* Cabecera */}
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
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary-hover sm:w-auto"
          >
            <Plus size={16} /> Nuevo coche
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
              placeholder="Buscar por matrícula, marca, modelo o dueño…"
              className="w-full rounded-md border border-black/10 bg-bg-light py-2 pr-3 pl-10 text-sm text-text-main placeholder:text-text-main/40 focus:border-accent-primary focus:outline-none"
            />
          </label>
          {/* TODO(funcionalidad): convertir en filtro real por estado */}
          <div className="flex flex-wrap gap-2">
            {["Todos", "En taller", "Con cita", "Disponibles"].map((f, i) => (
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

      {/* Grid de coches */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_COCHES.map((coche) => (
          <article
            key={coche.id}
            className="flex min-w-0 flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-lg bg-bg-dark p-2 text-text-inverse">
                  <Car size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold sm:text-base">
                    {coche.marca} {coche.modelo}
                  </p>
                  <p className="text-xs text-text-main/60">{coche.ano}</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${ESTILO_ESTADO[coche.estado]}`}
              >
                {coche.estado}
              </span>
            </div>

            <p className="inline-flex w-fit rounded-md border border-black/10 bg-bg-light px-2.5 py-1 font-mono text-sm font-bold tracking-wide">
              {coche.matricula}
            </p>

            <dl className="flex flex-col gap-1.5 border-t border-black/5 pt-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-text-main/60">Dueño</dt>
                <dd className="truncate font-medium">{coche.dueno}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-main/60">VIN</dt>
                <dd className="truncate font-mono text-xs">{coche.vin}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-main/60">Próxima cita</dt>
                <dd className="font-medium">{coche.proximaCita}</dd>
              </div>
            </dl>

            <div className="mt-auto flex gap-2 border-t border-black/5 pt-3">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-black/10 px-3 py-2 text-xs font-medium text-text-main transition-colors hover:bg-bg-light"
              >
                <Eye size={14} /> Ver
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-black/10 px-3 py-2 text-xs font-medium text-text-main transition-colors hover:bg-bg-light"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                type="button"
                title="Eliminar"
                aria-label={`Eliminar ${coche.matricula}`}
                className="rounded-md border border-black/10 p-2 text-text-main/70 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Paginación visual */}
      <footer className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white px-4 py-3 text-xs text-text-main shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>Mostrando 6 de 48 coches</p>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-bg-dark px-3 py-1.5 font-bold text-text-inverse">
            1
          </span>
          <span className="px-2 text-text-main/60">2</span>
          <span className="px-2 text-text-main/60">3</span>
          <span className="text-text-main/40">…</span>
          <span className="px-2 text-text-main/60">8</span>
        </div>
      </footer>
    </div>
  );
}

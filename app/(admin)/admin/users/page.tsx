import {
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

// TODO(funcionalidad): sustituir MOCK_USUARIOS por lectura a BBDD (users +
// conteo de vehicles/appointments y última visita) y cablear búsqueda,
// ordenación, paginación y acciones (ver / editar / eliminar / nuevo).
// Solo visual: sin handlers, sin server actions.

type UsuarioMock = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  coches: number;
  citas: number;
  ultimaVisita: string;
  matriculaPrincipal: string;
};

const MOCK_USUARIOS: UsuarioMock[] = [
  {
    id: "1",
    nombre: "Rubén Vaquero",
    email: "ruben@ejemplo.com",
    telefono: "612 345 678",
    coches: 2,
    citas: 8,
    ultimaVisita: "Hoy",
    matriculaPrincipal: "1234 ABC",
  },
  {
    id: "2",
    nombre: "María López",
    email: "maria.lopez@ejemplo.com",
    telefono: "600 111 222",
    coches: 1,
    citas: 5,
    ultimaVisita: "Hoy",
    matriculaPrincipal: "5678 DEF",
  },
  {
    id: "3",
    nombre: "Javier Ruiz",
    email: "javier.ruiz@ejemplo.com",
    telefono: "655 400 300",
    coches: 1,
    citas: 3,
    ultimaVisita: "Ayer",
    matriculaPrincipal: "9012 GHI",
  },
  {
    id: "4",
    nombre: "Lucía Fernández",
    email: "lucia.f@ejemplo.com",
    telefono: "699 876 543",
    coches: 2,
    citas: 6,
    ultimaVisita: "12 sept",
    matriculaPrincipal: "3456 JKL",
  },
  {
    id: "5",
    nombre: "Carlos Méndez",
    email: "carlos.m@ejemplo.com",
    telefono: "611 222 333",
    coches: 1,
    citas: 2,
    ultimaVisita: "8 sept",
    matriculaPrincipal: "7890 MNO",
  },
  {
    id: "6",
    nombre: "Ana Torres",
    email: "ana.torres@ejemplo.com",
    telefono: "640 555 666",
    coches: 1,
    citas: 1,
    ultimaVisita: "2 sept",
    matriculaPrincipal: "2345 PQR",
  },
];

const RESUMEN = [
  { titulo: "Total clientes", valor: "126", icono: Users },
  { titulo: "Nuevos este mes", valor: "9", icono: UserPlus },
  { titulo: "Coches registrados", valor: "148", icono: Car },
  { titulo: "Con cita próxima", valor: "14", icono: CalendarDays },
];

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UsersPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-text-inverse/60 sm:text-sm">Gestión</p>
          <h1 className="text-2xl font-bold text-text-inverse sm:text-3xl">
            Clientes
          </h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Fichas de cliente con sus coches y su historial de citas
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary-hover sm:w-auto"
          >
            <Plus size={16} /> Nuevo cliente
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
              placeholder="Buscar por nombre, email, teléfono o matrícula…"
              className="w-full rounded-md border border-black/10 bg-bg-light py-2 pr-3 pl-10 text-sm text-text-main placeholder:text-text-main/40 focus:border-accent-primary focus:outline-none"
            />
          </label>
          {/* TODO(funcionalidad): convertir en ordenación real */}
          <div className="flex flex-wrap gap-2">
            {["Recientes", "Más citas", "A–Z"].map((f, i) => (
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

      {/* Tabla */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-black/5 bg-white text-text-main shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-3xl text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-xs text-text-main/60 uppercase">
                <th className="px-4 py-3 font-medium sm:px-5">Cliente</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Coches</th>
                <th className="px-4 py-3 font-medium">Citas</th>
                <th className="px-4 py-3 font-medium">Última visita</th>
                <th className="px-4 py-3 text-right font-medium sm:pr-5">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {MOCK_USUARIOS.map((usuario) => (
                <tr key={usuario.id} className="align-top hover:bg-bg-light/60">
                  <td className="px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-dark text-xs font-bold text-text-inverse">
                        {iniciales(usuario.nombre)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {usuario.nombre}
                        </p>
                        <p className="truncate text-xs text-text-main/60">
                          {usuario.matriculaPrincipal}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="truncate">{usuario.email}</p>
                    <p className="text-xs text-text-main/60">
                      {usuario.telefono}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium whitespace-nowrap">
                      {usuario.coches}{" "}
                      {usuario.coches === 1 ? "coche" : "coches"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium whitespace-nowrap">
                      {usuario.citas} {usuario.citas === 1 ? "cita" : "citas"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {usuario.ultimaVisita}
                  </td>
                  <td className="px-4 py-3 sm:pr-5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        title="Ver ficha"
                        aria-label={`Ver ficha de ${usuario.nombre}`}
                        className="rounded-md border border-black/10 p-1.5 text-text-main/70 transition-colors hover:bg-bg-light hover:text-text-main"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        title="Editar"
                        aria-label={`Editar a ${usuario.nombre}`}
                        className="rounded-md border border-black/10 p-1.5 text-text-main/70 transition-colors hover:bg-bg-light hover:text-text-main"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title="Eliminar"
                        aria-label={`Eliminar a ${usuario.nombre}`}
                        className="rounded-md border border-black/10 p-1.5 text-text-main/70 transition-colors hover:bg-red-50 hover:text-red-700"
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

        {/* Paginación visual */}
        <footer className="flex flex-col gap-3 border-t border-black/5 px-4 py-3 text-xs text-text-main/60 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p>Mostrando 6 de 126 clientes</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <span className="rounded-md bg-bg-dark px-3 py-1.5 font-bold text-text-inverse">
              1
            </span>
            <span className="px-2">2</span>
            <span className="px-2">3</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

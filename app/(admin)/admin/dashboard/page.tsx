import {
  CalendarDays,
  Car,
  Clock,
  Users,
  Wrench,
  Bell,
  Euro,
  Plus,
  CircleAlert,
} from "lucide-react";
import Card from "./Card";
import {
  getAllAppointments,
  getAvisos,
  getCitasHoy,
  getCochesEnTaller,
  getIngresosDelMes,
  getProximasCitas,
  getServiciosTop,
  getSolicitudesPendientes,
  getUltimosClientes,
  type CitaConDetalles,
} from "./actions";
import { getAvailableSlotsForDate } from "@/app/(public)/request-appointment-quote/actions";
import { madridDateKey } from "@/lib/schedule";

// force-dynamic: la página se renderiza en cada visita (para `new Date()` actual),
// pero `getAllAppointments()` sigue servida desde Data Cache hasta `revalidateTag`.
export const dynamic = "force-dynamic";

function formatearHora(fecha: Date) {
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
}

function formatearFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
}

const textoVacio = "py-6 text-center text-sm text-text-main/60";

function lineaCita(cita: CitaConDetalles, mostrarFecha = false) {
  return (
    <li
      key={cita.id}
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-14 shrink-0 rounded-md border border-black/10 bg-bg-light px-2 py-1 text-center text-sm font-bold text-text-main">
          {mostrarFecha
            ? formatearFecha(cita.fechaInicio)
            : formatearHora(cita.fechaInicio)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {cita.clienteNombre ?? "Sin cliente"}
          </p>
          <p className="truncate text-xs text-text-main/60">
            {cita.matricula ?? "Sin matrícula"}
            {cita.cocheMarca ? ` · ${cita.cocheMarca}` : ""}
            {cita.cocheModelo ? ` ${cita.cocheModelo}` : ""} ·{" "}
            {cita.servicioNombre ?? "Sin servicio"}
          </p>
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium text-text-main">
        {cita.status}
      </span>
    </li>
  );
}

export default async function Dashboard() {
  // 1. Una sola lectura: todos los appointments con sus relaciones.
  const todasLasCitas: CitaConDetalles[] = await getAllAppointments();

  const nowDate = new Date();

  // 2. Derivar cada dato con funciones auxiliares puras.
  const citasHoy = getCitasHoy(todasLasCitas, nowDate);
  const pendientes = getSolicitudesPendientes(todasLasCitas);
  const enTaller = getCochesEnTaller(todasLasCitas);
  const proximas = getProximasCitas(todasLasCitas, nowDate);
  const serviciosTop = getServiciosTop(todasLasCitas);
  const ingresos = getIngresosDelMes(todasLasCitas, nowDate);
  const avisos = getAvisos(todasLasCitas, nowDate);
  const ultimos = getUltimosClientes(todasLasCitas);

  const huecosLibres = (
    await getAvailableSlotsForDate(madridDateKey(nowDate), citasHoy)
  ).length;

  const resumen = [
    {
      titulo: "Citas hoy",
      valor: citasHoy.length,
      icono: CalendarDays,
    },
    {
      titulo: "Huecos libres",
      valor: huecosLibres,
      icono: Clock,
    },
    {
      titulo: "Coches en taller",
      valor: enTaller.length,
      icono: Car,
    },
    {
      titulo: "Pendientes",
      valor: pendientes.length,
      icono: Bell,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-text-inverse/60 sm:text-sm">
            Viernes 12 de septiembre
          </p>
          <h1 className="text-2xl font-bold text-text-inverse sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Resumen del taller de un vistazo
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-bg-dark hover:bg-accent-primary-hover hover:text-text-inverse sm:w-auto">
            <Plus size={16} /> Nueva cita
          </span>
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white px-4 py-2 text-sm font-medium text-text-main sm:w-auto">
            <Wrench size={16} /> Nuevo servicio
          </span>
        </div>
      </div>

      {/* Resumen del día */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {resumen.map((item) => (
          <div
            key={item.titulo}
            className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-sm font-medium text-text-main/60">
                {item.titulo}
              </p>
              <item.icono size={20} aria-hidden="true" className="shrink-0 text-accent-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">{item.valor}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        {/* Citas de hoy */}
        <Card titulo="Citas de hoy" icono={CalendarDays}>
          {citasHoy.length === 0 ? (
            <p className={textoVacio}>No hay citas para hoy.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5">
              {citasHoy.map((cita) => lineaCita(cita))}
            </ul>
          )}
        </Card>

        {/* Solicitudes pendientes */}
        <Card titulo="Solicitudes pendientes" icono={Bell}>
          {pendientes.length === 0 ? (
            <p className={textoVacio}>No hay solicitudes pendientes.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5">
              {pendientes.map((cita) => lineaCita(cita, true))}
            </ul>
          )}
        </Card>

        {/* Coches en taller */}
        <Card titulo="Coches en el taller" icono={Car}>
          {enTaller.length === 0 ? (
            <p className={textoVacio}>No hay coches en el taller.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5">
              {enTaller.map((cita) => lineaCita(cita, true))}
            </ul>
          )}
        </Card>

        {/* Próximas citas */}
        <Card titulo="Próximas citas" icono={Clock}>
          {proximas.length === 0 ? (
            <p className={textoVacio}>No hay próximas citas.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5">
              {proximas.map((cita) => lineaCita(cita, true))}
            </ul>
          )}
        </Card>

        {/* Servicios más pedidos */}
        <Card titulo="Servicios más pedidos" icono={Wrench}>
          {serviciosTop.length === 0 ? (
            <p className={textoVacio}>Sin datos de servicios.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5">
              {serviciosTop.map((servicio) => (
                <li
                  key={servicio.nombre}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <p className="truncate text-sm font-semibold">
                    {servicio.nombre}
                  </p>
                  <span className="shrink-0 rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium text-text-main">
                    {servicio.citas} citas
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Ingresos + avisos */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
          <Card titulo="Ingresos del mes" icono={Euro}>
            <p className="text-2xl font-bold sm:text-3xl">
              {ingresos.total.toFixed(2)} €
            </p>
            <p className="mt-1 text-xs sm:text-sm text-text-main/60">
              {ingresos.numCitas === 0
                ? "Sin datos"
                : `${ingresos.numCitas} cita(s) completadas este mes`}
            </p>
            {ingresos.numCitas === 0 ? (
              <p className={textoVacio}>No hay ingresos registrados.</p>
            ) : null}
          </Card>

          <Card titulo="Avisos" icono={CircleAlert}>
            {avisos.length === 0 ? (
              <p className={textoVacio}>No hay avisos.</p>
            ) : (
              <ul className="flex list-disc flex-col gap-2 pl-5 text-sm">
                {avisos.map((aviso) => (
                  <li key={aviso}>{aviso}</li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {/* Últimos clientes */}
      <Card titulo="Últimos clientes y coches" icono={Users}>
        {ultimos.length === 0 ? (
          <p className={textoVacio}>No hay clientes recientes.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-black/5">
            {ultimos.map((ultimo) => (
              <li
                key={`${ultimo.nombre}-${ultimo.dato}`}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {ultimo.nombre}
                  </p>
                  <p className="truncate text-xs text-text-main/60">
                    {ultimo.dato}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium text-text-main">
                  {ultimo.tipo}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

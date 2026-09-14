import {
  CalendarDays,
  Car,
  Clock,
  Users,
  Wrench,
  Bell,
  Euro,
  Plus,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import Card from "./Card";
import { getCitasHoy } from "./actions";

export const dynamic = "force-dynamic";

const resumen = [
  {
    titulo: "Citas hoy",
    valor: "8",
    detalle: "4 por la mañana · 4 por la tarde",
    icono: CalendarDays,
  },
  {
    titulo: "Huecos libres",
    valor: "4",
    detalle: "de 12 huecos totales",
    icono: Clock,
  },
  {
    titulo: "Coches en taller",
    valor: "3",
    detalle: "2 en curso · 1 esperando",
    icono: Car,
  },
  {
    titulo: "Pendientes",
    valor: "5",
    detalle: "solicitudes por confirmar",
    icono: Bell,
  },
];

const pendientes = [
  {
    cliente: "Lucía Fernández",
    servicio: "Distribución",
    fecha: "Mañana 09:00",
    espera: "hace 2 h",
  },
  {
    cliente: "Diego Sanz",
    servicio: "Aire acondicionado",
    fecha: "Mañana 10:30",
    espera: "hace 5 h",
  },
  {
    cliente: "Elena Mora",
    servicio: "Embrague",
    fecha: "Miércoles 09:45",
    espera: "hace 1 día",
  },
];

const enTaller = [
  {
    matricula: "1234 ABC",
    coche: "Seat León",
    servicio: "Cambio de aceite",
    desde: "09:00",
    estado: "En curso",
  },
  {
    matricula: "4321 ZXY",
    coche: "Audi A3",
    servicio: "Frenos",
    desde: "08:30",
    estado: "En curso",
  },
  {
    matricula: "8765 QWE",
    coche: "Renault Clio",
    servicio: "Revisión",
    desde: "10:00",
    estado: "Esperando",
  },
];

const proximas = [
  {
    dia: "Mar 12",
    hora: "09:00",
    cliente: "Pablo Gil",
    servicio: "ITV pre-inspección",
  },
  {
    dia: "Mar 12",
    hora: "11:15",
    cliente: "Sara Vidal",
    servicio: "Cambio de aceite",
  },
  {
    dia: "Mié 13",
    hora: "09:45",
    cliente: "Iván Castro",
    servicio: "Neumáticos",
  },
  { dia: "Mié 13", hora: "12:00", cliente: "Nora Sala", servicio: "Frenos" },
];

const serviciosTop = [
  { nombre: "Cambio de aceite", citas: 32, porcentaje: "80%" },
  { nombre: "Frenos", citas: 24, porcentaje: "60%" },
  { nombre: "Revisión", citas: 18, porcentaje: "45%" },
  { nombre: "Neumáticos", citas: 12, porcentaje: "30%" },
];

const avisos = [
  "2 cancelaciones esta semana",
  "Jueves solo quedan 2 huecos libres",
  "1 cita sin vehículo asignado",
];

const ultimos = [
  {
    nombre: "Nora Sala",
    dato: "Toyota Corolla · 1122 BNM",
    tipo: "Cliente nuevo",
  },
  { nombre: "Iván Castro", dato: "Kia Ceed · 3344 CCP", tipo: "Coche nuevo" },
  {
    nombre: "Sara Vidal",
    dato: "sara@email.com · 600 123 456",
    tipo: "Cliente nuevo",
  },
];

type CitaHoy = Awaited<ReturnType<typeof getCitasHoy>>[number];

function formatearHora(fecha: Date) {
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Dashboard() {
  const citasHoy: CitaHoy[] = await getCitasHoy();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-text-inverse/60 sm:text-sm">
            Viernes 12 de septiembre
          </p>
          <h1 className="text-2xl font-bold text-text-inverse sm:text-3xl">Dashboard</h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Resumen del taller de un vistazo
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white sm:w-auto">
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
              <item.icono size={20} className="shrink-0 text-accent-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">{item.valor}</p>
            <p className="mt-1 text-xs text-text-main/60">{item.detalle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        {/* Citas de hoy */}
        <Card titulo="Citas de hoy" icono={CalendarDays}>
          {citasHoy.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-main/60">
              No hay citas para hoy.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-black/5">
              {citasHoy.map((cita) => (
                <li
                  key={cita.id}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="w-14 shrink-0 rounded-md border border-black/10 bg-bg-light px-2 py-1 text-center text-sm font-bold text-text-main">
                      {formatearHora(cita.fechaInicio)}
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
              ))}
            </ul>
          )}
        </Card>

        {/* Solicitudes pendientes */}
        <Card titulo="Solicitudes pendientes" icono={Bell}>
          <ul className="flex flex-col gap-3">
            {pendientes.map((item) => (
              <li
                key={item.cliente}
                className="min-w-0 rounded-xl border border-black/5 bg-bg-light p-3 sm:p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-sm font-semibold">{item.cliente}</p>
                  <span className="shrink-0 text-xs text-text-main/60">
                    {item.espera}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-main/70">
                  {item.servicio} · {item.fecha}
                </p>
                <div className="mt-3 flex flex-col gap-2 min-[420px]:flex-row">
                  <span className="inline-flex items-center justify-center rounded-md bg-accent-primary px-3 py-1.5 text-xs font-semibold text-white">
                    Confirmar
                  </span>
                  <span className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-medium">
                    Rechazar
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Coches en taller */}
        <Card titulo="Coches en el taller" icono={Car}>
          <ul className="flex flex-col divide-y divide-black/5">
            {enTaller.map((coche) => (
              <li
                key={coche.matricula}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{coche.matricula}</p>
                  <p className="truncate text-xs text-text-main/60">
                    {coche.coche} · {coche.servicio}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium">Desde {coche.desde}</p>
                  <p className="text-xs text-text-main/60">{coche.estado}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Próximas citas */}
        <Card titulo="Próximas citas" icono={Clock}>
          <ul className="flex flex-col divide-y divide-black/5">
            {proximas.map((cita) => (
              <li
                key={`${cita.dia}-${cita.hora}`}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="shrink-0 rounded-md bg-bg-dark px-2.5 py-1 text-xs font-bold text-text-inverse">
                    {cita.dia}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{cita.cliente}</p>
                    <p className="truncate text-xs text-text-main/60">{cita.servicio}</p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold">{cita.hora}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Servicios más pedidos */}
        <Card titulo="Servicios más pedidos" icono={Wrench}>
          <ul className="flex flex-col gap-4">
            {serviciosTop.map((servicio) => (
              <li key={servicio.nombre} className="min-w-0">
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate font-medium">{servicio.nombre}</span>
                  <span className="shrink-0 text-text-main/60">
                    {servicio.citas} citas
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-accent-primary"
                    style={{ width: servicio.porcentaje }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Ingresos + avisos */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
          <Card titulo="Ingresos del mes" icono={Euro}>
            <p className="text-2xl font-bold sm:text-3xl">4.850 €</p>
            <p className="mt-1 text-xs sm:text-sm text-text-main/60">
              Septiembre · 62 servicios completados
            </p>
            <div className="mt-4 flex h-20 items-end gap-1.5 rounded-xl bg-bg-light p-2 sm:h-24 sm:gap-2 sm:p-3">
              {["40%", "65%", "50%", "80%", "70%", "95%", "60%"].map(
                (altura, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-md bg-bg-dark"
                    style={{ height: altura }}
                  />
                ),
              )}
            </div>
            <p className="mt-2 text-xs text-text-main/60">Últimos 7 días</p>
          </Card>

          <Card titulo="Avisos" icono={CircleAlert}>
            <ul className="flex flex-col gap-2">
              {avisos.map((aviso) => (
                <li
                  key={aviso}
                  className="flex items-start gap-2 rounded-lg bg-bg-light p-3 text-sm"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-accent-primary"
                  />
                  {aviso}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Últimos clientes */}
      <Card titulo="Últimos clientes y coches" icono={Users}>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ultimos.map((item) => (
            <li
              key={item.nombre}
              className="min-w-0 rounded-xl border border-black/5 bg-bg-light p-3 sm:p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-primary">
                {item.tipo}
              </p>
              <p className="mt-1 truncate text-sm font-bold">{item.nombre}</p>
              <p className="truncate text-xs text-text-main/60">{item.dato}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

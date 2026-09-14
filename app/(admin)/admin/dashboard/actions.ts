import { db } from "@/src/db";
import { appointments, services, users, vehicles } from "@/src/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import {
  madridDateKey,
  madridDayRangeUtc,
  madridParts,
} from "@/lib/schedule";

// Tag compartido para invalidar el dashboard cuando cambien los appointments.
// En Server Actions: `updateTag(APPOINTMENTS_CACHE_TAG)`.
// Fuera de ellas (Route Handlers): `revalidateTag(APPOINTMENTS_CACHE_TAG, "max")`.
export const APPOINTMENTS_CACHE_TAG = "appointments";

// ---------------------------------------------------------------------------
// 1. Única lectura a BBDD: todos los appointments con sus relaciones.
//    Cacheada entre visitas; solo se recarga con `revalidateTag` o `revalidate`.
// ---------------------------------------------------------------------------

async function fetchAllAppointmentsFromDb() {
  return db
    .select({
      ...getTableColumns(appointments),
      clienteNombre: users.fullName,
      servicioNombre: services.name,
      servicioPrecio: services.price,
      matricula: vehicles.licensePlate,
      cocheMarca: vehicles.brand,
      cocheModelo: vehicles.model,
    })
    .from(appointments)
    .leftJoin(users, eq(appointments.user, users.id))
    .leftJoin(services, eq(appointments.service, services.id))
    .leftJoin(vehicles, eq(appointments.vehicle, vehicles.id))
    .orderBy(asc(appointments.fechaInicio));
}

const getCachedAppointmentsRaw = unstable_cache(
  fetchAllAppointmentsFromDb,
  ["dashboard-all-appointments"],
  {
    tags: [APPOINTMENTS_CACHE_TAG],
    // Sin `revalidate`: caché indefinida hasta invalidación manual.
    // Pon p. ej. `revalidate: 300` como red de seguridad (5 min).
  },
);

export async function getAllAppointments() {
  const rows = await getCachedAppointmentsRaw();
  // `unstable_cache` serializa el resultado: las fechas pueden volver
  // como string. Rehidratar a Date para que el dashboard siga funcionando.
  return rows.map((cita) => ({
    ...cita,
    fechaInicio:
      cita.fechaInicio instanceof Date
        ? cita.fechaInicio
        : new Date(cita.fechaInicio),
    fechaFin:
      cita.fechaFin instanceof Date ? cita.fechaFin : new Date(cita.fechaFin),
  }));
}

export type CitaConDetalles = Awaited<
  ReturnType<typeof getAllAppointments>
>[number];

// ---------------------------------------------------------------------------
// Utilidades de fecha (puras, sin BBDD)
// ---------------------------------------------------------------------------

function inicioDelDia(ref: Date) {
  // Límites del día en hora de Logroño, coherentes con los huecos del taller.
  // La clave siempre deriva de una fecha real, el fallback es inalcanzable.
  return madridDayRangeUtc(madridDateKey(ref))?.start ?? ref;
}

function finDelDia(ref: Date) {
  return madridDayRangeUtc(madridDateKey(ref))?.end ?? ref;
}

// ---------------------------------------------------------------------------
// 2. Funciones auxiliares: cada una deriva un dato del dashboard
//    a partir del array ya cargado en memoria.
// ---------------------------------------------------------------------------

/** Citas cuya fecha de inicio cae en el mismo día que `ref`. */
export function getCitasHoy(
  citas: CitaConDetalles[],
  ref: Date = new Date(),
): CitaConDetalles[] {
  const inicio = inicioDelDia(ref);
  const fin = finDelDia(ref);
  return citas.filter(
    (cita) => cita.fechaInicio >= inicio && cita.fechaInicio <= fin,
  );
}

/** Solicitudes pendientes de confirmar. */
export function getSolicitudesPendientes(
  citas: CitaConDetalles[],
): CitaConDetalles[] {
  return citas
    .filter((cita) => cita.status === "PENDING")
    .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
}

/** Coches actualmente en el taller. */
export function getCochesEnTaller(
  citas: CitaConDetalles[],
): CitaConDetalles[] {
  return citas
    .filter((cita) => cita.status === "IN_PROGRESS")
    .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
}

/** Próximas citas (futuras y no canceladas ni completadas). */
export function getProximasCitas(
  citas: CitaConDetalles[],
  ref: Date = new Date(),
  limite = 5,
): CitaConDetalles[] {
  return citas
    .filter(
      (cita) =>
        cita.fechaInicio > ref &&
        cita.status !== "CANCELLED" &&
        cita.status !== "COMPLETED",
    )
    .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime())
    .slice(0, limite);
}

/** Ranking de servicios más pedidos. */
export function getServiciosTop(
  citas: CitaConDetalles[],
  limite = 5,
): { nombre: string; citas: number }[] {
  const conteo = new Map<string, number>();

  for (const cita of citas) {
    if (cita.status === "CANCELLED") continue;
    const nombre = cita.servicioNombre ?? "Sin servicio";
    conteo.set(nombre, (conteo.get(nombre) ?? 0) + 1);
  }

  return [...conteo.entries()]
    .map(([nombre, cantidad]) => ({ nombre, citas: cantidad }))
    .sort((a, b) => b.citas - a.citas)
    .slice(0, limite);
}

/** Ingresos del mes de `ref` (solo citas COMPLETED con precio). */
export function getIngresosDelMes(
  citas: CitaConDetalles[],
  ref: Date = new Date(),
): { total: number; numCitas: number } {
  const refParts = madridParts(ref);
  const mismoMes = citas.filter((cita) => {
    if (cita.status !== "COMPLETED") return false;
    const partes = madridParts(cita.fechaInicio);
    return partes.month === refParts.month && partes.year === refParts.year;
  });

  const total = mismoMes.reduce(
    (acc, cita) => acc + Number(cita.servicioPrecio ?? 0),
    0,
  );

  return { total, numCitas: mismoMes.length };
}

/** Avisos generados a partir de los datos (sin BBDD). */
export function getAvisos(
  citas: CitaConDetalles[],
  ref: Date = new Date(),
): string[] {
  const avisos: string[] = [];

  const pendientes = getSolicitudesPendientes(citas);
  if (pendientes.length > 0) {
    avisos.push(
      `${pendientes.length} solicitud(es) pendientes de confirmar.`,
    );
  }

  const citasHoy = getCitasHoy(citas, ref);
  const sinDatos = citasHoy.filter(
    (cita) => !cita.clienteNombre || !cita.matricula || !cita.servicioNombre,
  );
  if (sinDatos.length > 0) {
    avisos.push(
      `${sinDatos.length} cita(s) de hoy con datos incompletos (cliente, matrícula o servicio).`,
    );
  }

  // Solapamientos de hoy: dos citas que se pisan en el tiempo.
  const ordenadas = [...citasHoy].sort(
    (a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime(),
  );
  const conSolape = ordenadas.some(
    (cita, i) =>
      i > 0 && cita.fechaInicio < ordenadas[i - 1].fechaFin,
  );
  if (conSolape) {
    avisos.push("Hay solapamientos en las citas de hoy. Revisa el planning.");
  }

  const enTaller = getCochesEnTaller(citas);
  if (enTaller.length > 0) {
    avisos.push(`${enTaller.length} coche(s) actualmente en el taller.`);
  }

  return avisos;
}

/** Últimos clientes/coches por fecha de cita descendente. */
export function getUltimosClientes(
  citas: CitaConDetalles[],
  limite = 5,
): { nombre: string; dato: string; tipo: string }[] {
  return [...citas]
    .sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime())
    .slice(0, limite)
    .map((cita) => ({
      nombre: cita.clienteNombre ?? "Sin cliente",
      dato: cita.matricula
        ? `${cita.matricula}${cita.cocheMarca ? ` · ${cita.cocheMarca}` : ""}${cita.cocheModelo ? ` ${cita.cocheModelo}` : ""}`
        : "Sin matrícula",
      tipo: cita.servicioNombre ?? "Sin servicio",
    }));
}

import { db } from "@/src/db";
import {
  appointment_status,
  appointments,
  services,
  users,
  vehicles,
} from "@/src/db/schema";
import {
  and,
  asc,
  count,
  eq,
  gt,
  gte,
  lt,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import {
  generateSlots,
  madridDateKey,
  madridDayRangeUtc,
  parseDateKey,
} from "@/lib/schedule";

const PAGE_SIZE = 10;

type Cursor = { fechaInicio: Date; id: string };

function decodeCursor(afterParam?: string): Cursor | undefined {
  if (!afterParam) return undefined;
  try {
    const parsed = JSON.parse(
      Buffer.from(afterParam, "base64url").toString("utf-8"),
    ) as { fechaInicio?: string; id?: string };
    if (typeof parsed.fechaInicio !== "string" || typeof parsed.id !== "string")
      return undefined;
    const fechaInicio = new Date(parsed.fechaInicio);
    if (Number.isNaN(fechaInicio.getTime())) return undefined;
    return { fechaInicio, id: parsed.id };
  } catch {
    return undefined;
  }
}

function encodeCursor(item: { fechaInicio: Date; id: string }): string {
  return Buffer.from(
    JSON.stringify({
      fechaInicio: item.fechaInicio.toISOString(),
      id: item.id,
    }),
  ).toString("base64url");
}

const ESTADOS_VALIDOS = appointment_status.enumValues;

type Filtros = {
  after?: string;
  q?: string;
  estado?: string;
  fecha?: string;
};

function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (m) => `\\${m}`);
}

export async function getAppointments(filtros: Filtros = {}) {
  const after = decodeCursor(filtros.after);
  const condiciones: SQL[] = [];

  if (after) {
    condiciones.push(
      or(
        gt(appointments.fechaInicio, after.fechaInicio),
        and(
          eq(appointments.fechaInicio, after.fechaInicio),
          gt(appointments.id, after.id),
        ),
      )!,
    );
  }

  const estado = filtros.estado?.trim();
  if (estado && (ESTADOS_VALIDOS as string[]).includes(estado)) {
    condiciones.push(
      eq(appointments.status, estado as (typeof ESTADOS_VALIDOS)[number]),
    );
  }

  const fecha = filtros.fecha?.trim();
  if (fecha && parseDateKey(fecha)) {
    const rango = madridDayRangeUtc(fecha);
    if (rango) {
      condiciones.push(gte(appointments.fechaInicio, rango.start));
      condiciones.push(lt(appointments.fechaInicio, rango.end));
    }
  }

  const q = filtros.q?.trim();
  if (q) {
    const patron = `%${escapeLike(q)}%`;
    const sinAcentos = (columna: unknown, valor: string) =>
      sql`extensions.unaccent(${columna}) ILIKE extensions.unaccent(${valor}) ESCAPE '\'`;
    condiciones.push(
      or(
        sinAcentos(users.fullName, patron),
        sinAcentos(vehicles.licensePlate, patron),
        sinAcentos(services.name, patron),
      )!,
    );
  }

  const rows = await db
    .select({
      id: appointments.id,
      fechaInicio: appointments.fechaInicio,
      fechaFin: appointments.fechaFin,
      status: appointments.status,
      notes: appointments.notes,
      userName: users.fullName,
      userEmail: users.email,
      userPhone: users.phone,
      vehiclePlate: vehicles.licensePlate,
      vehicleBrand: vehicles.brand,
      vehicleModel: vehicles.model,
      serviceName: services.name,
    })
    .from(appointments)
    .innerJoin(users, eq(appointments.user, users.id))
    .innerJoin(vehicles, eq(appointments.vehicle, vehicles.id))
    .innerJoin(services, eq(appointments.service, services.id))
    .where(condiciones.length > 0 ? and(...condiciones) : undefined)
    .orderBy(asc(appointments.fechaInicio), asc(appointments.id))
    .limit(PAGE_SIZE + 1);

  const hasNext = rows.length > PAGE_SIZE;
  const items = hasNext ? rows.slice(0, -1) : rows;
  const nextCursor =
    hasNext && items.length > 0 ? encodeCursor(items[items.length - 1]) : null;

  return { items, nextCursor, hasNext };
}

export type CitaFila = Awaited<ReturnType<typeof getAppointments>>["items"][number];

export type ResumenCitas = {
  hoy: number;
  pendientes: number;
  enTaller: number;
  huecosLibres: number;
};

export async function getAppointmentSummary(
  ref: Date = new Date(),
): Promise<ResumenCitas> {
  const claveHoy = madridDateKey(ref);
  const rangoHoy = madridDayRangeUtc(claveHoy);

  const [[pendientes], [enTaller], [hoy]] = await Promise.all([
    db
      .select({ valor: count() })
      .from(appointments)
      .where(eq(appointments.status, "PENDING")),
    db
      .select({ valor: count() })
      .from(appointments)
      .where(eq(appointments.status, "IN_PROGRESS")),
    rangoHoy
      ? db
          .select({ valor: count() })
          .from(appointments)
          .where(
            and(
              gte(appointments.fechaInicio, rangoHoy.start),
              lt(appointments.fechaInicio, rangoHoy.end),
              ne(appointments.status, "CANCELLED"),
            ),
          )
      : Promise.resolve([{ valor: 0 }]),
  ]);

  let huecosLibres = 0;
  if (rangoHoy) {
    const ocupadas = await db
      .select({
        fechaInicio: appointments.fechaInicio,
        fechaFin: appointments.fechaFin,
      })
      .from(appointments)
      .where(
        and(
          gte(appointments.fechaInicio, rangoHoy.start),
          lt(appointments.fechaInicio, rangoHoy.end),
          ne(appointments.status, "CANCELLED"),
        ),
      );
    huecosLibres = generateSlots(claveHoy, ref, ocupadas).length;
  }

  return {
    hoy: hoy?.valor ?? 0,
    pendientes: pendientes?.valor ?? 0,
    enTaller: enTaller?.valor ?? 0,
    huecosLibres,
  };
}

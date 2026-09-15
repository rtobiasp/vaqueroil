import { db } from "@/src/db";
import { appointments, users, vehicles } from "@/src/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  inArray,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type { EstadoCoche } from "./status";

const PAGE_SIZE = 9;

type Cursor = { licensePlate: string; id: string };

function decodeCursor(afterParam?: string): Cursor | undefined {
  if (!afterParam) return undefined;
  try {
    const parsed = JSON.parse(
      Buffer.from(afterParam, "base64url").toString("utf-8"),
    ) as { licensePlate?: string; id?: string };
    if (
      typeof parsed.licensePlate !== "string" ||
      typeof parsed.id !== "string"
    )
      return undefined;
    return { licensePlate: parsed.licensePlate, id: parsed.id };
  } catch {
    return undefined;
  }
}

function encodeCursor(item: { licensePlate: string; id: string }): string {
  return Buffer.from(
    JSON.stringify({ licensePlate: item.licensePlate, id: item.id }),
  ).toString("base64url");
}

function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (m) => `\\${m}`);
}

type Filtros = {
  after?: string;
  q?: string;
  estado?: string;
};

function sinAcentos(columna: unknown, valor: string) {
  return sql`extensions.unaccent(${columna}) ILIKE extensions.unaccent(${valor}) ESCAPE '\'`;
}

export type CocheFila = {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  vin: string | null;
  dueno: string | null;
  estado: EstadoCoche;
  proximaCita: Date | null;
  totalCitas: number;
};

export async function getCars(filtros: Filtros = {}) {
  const after = decodeCursor(filtros.after);
  const condiciones: SQL[] = [];

  if (after) {
    condiciones.push(
      or(
        gt(vehicles.licensePlate, after.licensePlate),
        and(
          eq(vehicles.licensePlate, after.licensePlate),
          gt(vehicles.id, after.id),
        ),
      )!,
    );
  }

  const q = filtros.q?.trim();
  if (q) {
    const patron = `%${escapeLike(q)}%`;
    // Dueño: vehículos con alguna cita cuyo cliente coincida.
    const vehiculosDelDueno = db
      .selectDistinct({ vehicle: appointments.vehicle })
      .from(appointments)
      .innerJoin(users, eq(appointments.user, users.id))
      .where(sinAcentos(users.fullName, patron));
    condiciones.push(
      or(
        sinAcentos(vehicles.licensePlate, patron),
        sinAcentos(vehicles.brand, patron),
        sinAcentos(vehicles.model, patron),
        sinAcentos(vehicles.vin, patron),
        inArray(vehicles.id, vehiculosDelDueno),
      )!,
    );
  }

  // Se lee una página extra: el filtro por estado se calcula en memoria
  // (deriva de appointments) y puede descartar filas.
  const rows = await db
    .select({
      id: vehicles.id,
      licensePlate: vehicles.licensePlate,
      brand: vehicles.brand,
      model: vehicles.model,
      year: vehicles.year,
      vin: vehicles.vin,
    })
    .from(vehicles)
    .where(condiciones.length > 0 ? and(...condiciones) : undefined)
    .orderBy(asc(vehicles.licensePlate), asc(vehicles.id))
    .limit(PAGE_SIZE + 1);

  const hasNextRaw = rows.length > PAGE_SIZE;
  const page = hasNextRaw ? rows.slice(0, -1) : rows;

  const items = await enriquecer(page);

  const estado = filtros.estado?.trim();
  const filtrados =
    estado && estado !== "ALL"
      ? items.filter((c) => c.estado === estado)
      : items;

  const hasNext = hasNextRaw;
  const last = filtrados[filtrados.length - 1];
  const nextCursor = hasNext && last ? encodeCursor(last) : null;

  return { items: filtrados, nextCursor, hasNext };
}

async function enriquecer(
  page: {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    vin: string | null;
  }[],
): Promise<CocheFila[]> {
  if (page.length === 0) return [];
  const ids = page.map((v) => v.id);

  const citas = await db
    .select({
      vehicle: appointments.vehicle,
      status: appointments.status,
      fechaInicio: appointments.fechaInicio,
      userName: users.fullName,
    })
    .from(appointments)
    .innerJoin(users, eq(appointments.user, users.id))
    .where(inArray(appointments.vehicle, ids))
    .orderBy(desc(appointments.fechaInicio));

  const ahora = new Date();
  return page.map((v) => {
    const suyas = citas.filter((c) => c.vehicle === v.id);
    const enTaller = suyas.some((c) => c.status === "IN_PROGRESS");
    const futuras = suyas
      .filter(
        (c) =>
          c.fechaInicio >= ahora &&
          (c.status === "PENDING" || c.status === "CONFIRMED"),
      )
      .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
    const estado: EstadoCoche = enTaller
      ? "EN_TALLER"
      : futuras.length > 0
        ? "CON_CITA"
        : "DISPONIBLE";
    return {
      ...v,
      dueno: suyas[0]?.userName ?? null,
      estado,
      proximaCita: futuras[0]?.fechaInicio ?? null,
      totalCitas: suyas.filter((c) => c.status !== "CANCELLED").length,
    };
  });
}

export type ResumenCoches = {
  total: number;
  enTaller: number;
  conCita: number;
  sinActividad: number;
};

export async function getCarSummary(): Promise<ResumenCoches> {
  const [total] = await db.select({ valor: count() }).from(vehicles);

  const [enTaller, conCita] = await Promise.all([
    db
      .selectDistinct({ vehicle: appointments.vehicle })
      .from(appointments)
      .where(eq(appointments.status, "IN_PROGRESS")),
    db
      .selectDistinct({ vehicle: appointments.vehicle })
      .from(appointments)
      .where(
        and(
          inArray(appointments.status, ["PENDING", "CONFIRMED"]),
          gt(appointments.fechaInicio, new Date()),
        ),
      ),
  ]);

  const setTaller = new Set(enTaller.map((r) => r.vehicle));
  const setCita = new Set(conCita.map((r) => r.vehicle));
  const conActividad = new Set([...setTaller, ...setCita]);

  return {
    total: total?.valor ?? 0,
    enTaller: setTaller.size,
    conCita: [...setCita].filter((v) => !setTaller.has(v)).length,
    sinActividad: Math.max(0, (total?.valor ?? 0) - conActividad.size),
  };
}

export async function getCarById(id: string) {
  const [vehiculo] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))
    .limit(1);
  if (!vehiculo) return null;
  const [enriquecido] = await enriquecer([vehiculo]);
  const historial = await db
    .select({
      id: appointments.id,
      fechaInicio: appointments.fechaInicio,
      status: appointments.status,
      service: appointments.service,
      userName: users.fullName,
    })
    .from(appointments)
    .innerJoin(users, eq(appointments.user, users.id))
    .where(
      and(
        eq(appointments.vehicle, id),
        ne(appointments.status, "CANCELLED"),
      ),
    )
    .orderBy(desc(appointments.fechaInicio))
    .limit(5);
  return { coche: enriquecido!, historial };
}

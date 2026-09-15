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
import type { OrdenUsuario } from "./status";

const PAGE_SIZE = 10;

type Cursor = { fullName: string; id: string };

function decodeCursor(afterParam?: string): Cursor | undefined {
  if (!afterParam) return undefined;
  try {
    const parsed = JSON.parse(
      Buffer.from(afterParam, "base64url").toString("utf-8"),
    ) as { fullName?: string; id?: string };
    if (typeof parsed.fullName !== "string" || typeof parsed.id !== "string")
      return undefined;
    return { fullName: parsed.fullName, id: parsed.id };
  } catch {
    return undefined;
  }
}

function encodeCursor(item: { fullName: string; id: string }): string {
  return Buffer.from(
    JSON.stringify({ fullName: item.fullName, id: item.id }),
  ).toString("base64url");
}

function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (m) => `\\${m}`);
}

type Filtros = {
  after?: string;
  q?: string;
  orden?: OrdenUsuario;
};

function sinAcentos(columna: unknown, valor: string) {
  return sql`extensions.unaccent(${columna}) ILIKE extensions.unaccent(${valor}) ESCAPE '\'`;
}

export type UsuarioFila = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  coches: number;
  citas: number;
  ultimaVisita: Date | null;
  matriculaPrincipal: string | null;
};

export async function getUsers(filtros: Filtros = {}) {
  const after = decodeCursor(filtros.after);
  const condiciones: SQL[] = [];

  if (after) {
    condiciones.push(
      or(
        gt(users.fullName, after.fullName),
        and(eq(users.fullName, after.fullName), gt(users.id, after.id)),
      )!,
    );
  }

  const q = filtros.q?.trim();
  if (q) {
    const patron = `%${escapeLike(q)}%`;
    // Matrícula: clientes con alguna cita en un vehículo coincidente.
    const porMatricula = db
      .selectDistinct({ user: appointments.user })
      .from(appointments)
      .innerJoin(vehicles, eq(appointments.vehicle, vehicles.id))
      .where(sinAcentos(vehicles.licensePlate, patron));
    condiciones.push(
      or(
        sinAcentos(users.fullName, patron),
        sinAcentos(users.email, patron),
        sinAcentos(users.phone, patron),
        inArray(users.id, porMatricula),
      )!,
    );
  }

  const rows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
    })
    .from(users)
    .where(condiciones.length > 0 ? and(...condiciones) : undefined)
    .orderBy(asc(users.fullName), asc(users.id))
    .limit(PAGE_SIZE + 1);

  const hasNextRaw = rows.length > PAGE_SIZE;
  const page = hasNextRaw ? rows.slice(0, -1) : rows;

  let items = await enriquecer(page);

  const orden = filtros.orden ?? "RECIENTES";
  if (orden === "MAS_CITAS") {
    items = [...items].sort((a, b) => b.citas - a.citas);
  } else if (orden === "AZ") {
    items = [...items].sort((a, b) =>
      a.fullName.localeCompare(b.fullName, "es"),
    );
  } else {
    items = [...items].sort((a, b) => {
      const ta = a.ultimaVisita?.getTime() ?? 0;
      const tb = b.ultimaVisita?.getTime() ?? 0;
      return tb - ta;
    });
  }

  const hasNext = hasNextRaw;
  const last = page[page.length - 1];
  const nextCursor = hasNext && last ? encodeCursor(last) : null;

  return { items, nextCursor, hasNext };
}

async function enriquecer(
  page: { id: string; fullName: string; email: string; phone: string | null }[],
): Promise<UsuarioFila[]> {
  if (page.length === 0) return [];
  const ids = page.map((u) => u.id);

  const citas = await db
    .select({
      user: appointments.user,
      vehicle: appointments.vehicle,
      fechaInicio: appointments.fechaInicio,
      status: appointments.status,
      licensePlate: vehicles.licensePlate,
    })
    .from(appointments)
    .innerJoin(vehicles, eq(appointments.vehicle, vehicles.id))
    .where(inArray(appointments.user, ids))
    .orderBy(desc(appointments.fechaInicio));

  return page.map((u) => {
    const suyas = citas.filter((c) => c.user === u.id);
    const validas = suyas.filter((c) => c.status !== "CANCELLED");
    const vehiculos = new Set(suyas.map((c) => c.vehicle));
    return {
      ...u,
      coches: vehiculos.size,
      citas: validas.length,
      ultimaVisita: suyas[0]?.fechaInicio ?? null,
      matriculaPrincipal: suyas[0]?.licensePlate ?? null,
    };
  });
}

export type ResumenUsuarios = {
  total: number;
  coches: number;
  conCitaProxima: number;
  citasTotales: number;
};

export async function getUserSummary(): Promise<ResumenUsuarios> {
  const [[total], [coches], [citas], proximas] = await Promise.all([
    db.select({ valor: count() }).from(users),
    db.select({ valor: count() }).from(vehicles),
    db
      .select({ valor: count() })
      .from(appointments)
      .where(ne(appointments.status, "CANCELLED")),
    db
      .selectDistinct({ user: appointments.user })
      .from(appointments)
      .where(
        and(
          inArray(appointments.status, ["PENDING", "CONFIRMED"]),
          gt(appointments.fechaInicio, new Date()),
        ),
      ),
  ]);

  return {
    total: total?.valor ?? 0,
    coches: coches?.valor ?? 0,
    conCitaProxima: proximas.length,
    citasTotales: citas?.valor ?? 0,
  };
}

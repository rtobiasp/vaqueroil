import { db } from "@/src/db";
import { appointments, services } from "@/src/db/schema";
import {
  and,
  asc,
  avg,
  count,
  eq,
  gt,
  gte,
  inArray,
  lt,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { madridDayRangeUtc, madridParts } from "@/lib/schedule";

const PAGE_SIZE = 9;

type Cursor = { name: string; id: string };

function decodeCursor(afterParam?: string): Cursor | undefined {
  if (!afterParam) return undefined;
  try {
    const parsed = JSON.parse(
      Buffer.from(afterParam, "base64url").toString("utf-8"),
    ) as { name?: string; id?: string };
    if (typeof parsed.name !== "string" || typeof parsed.id !== "string")
      return undefined;
    return { name: parsed.name, id: parsed.id };
  } catch {
    return undefined;
  }
}

function encodeCursor(item: { name: string; id: string }): string {
  return Buffer.from(
    JSON.stringify({ name: item.name, id: item.id }),
  ).toString("base64url");
}

function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (m) => `\\${m}`);
}

type Filtros = {
  after?: string;
  q?: string;
  filtro?: string;
};

export async function getServices(filtros: Filtros = {}) {
  const after = decodeCursor(filtros.after);
  const condiciones: SQL[] = [];

  if (after) {
    condiciones.push(
      or(
        gt(services.name, after.name),
        and(eq(services.name, after.name), gt(services.id, after.id)),
      )!,
    );
  }

  const q = filtros.q?.trim();
  if (q) {
    const patron = `%${escapeLike(q)}%`;
    const sinAcentos = (columna: unknown, valor: string) =>
      sql`extensions.unaccent(${columna}) ILIKE extensions.unaccent(${valor}) ESCAPE '\'`;
    condiciones.push(
      or(
        sinAcentos(services.name, patron),
        sinAcentos(services.description, patron),
      )!,
    );
  }

  // El filtro por actividad necesita el conteo de citas: se aplica en
  // memoria tras la lectura para no complicar la paginación con un join.
  const rows = await db
    .select({
      id: services.id,
      name: services.name,
      description: services.description,
      price: services.price,
    })
    .from(services)
    .where(condiciones.length > 0 ? and(...condiciones) : undefined)
    .orderBy(asc(services.name), asc(services.id))
    .limit(PAGE_SIZE + 1);

  const hasNextRaw = rows.length > PAGE_SIZE;
  const page = hasNextRaw ? rows.slice(0, -1) : rows;

  const conteos =
    page.length > 0
      ? await db
          .select({
            service: appointments.service,
            citas: count(),
          })
          .from(appointments)
          .where(
            and(
              inArray(
                appointments.service,
                page.map((s) => s.id),
              ),
              ne(appointments.status, "CANCELLED"),
            ),
          )
          .groupBy(appointments.service)
      : [];
  const porServicio = new Map(conteos.map((c) => [c.service, c.citas]));

  let items = page.map((s) => ({ ...s, citas: porServicio.get(s.id) ?? 0 }));

  const filtro = filtros.filtro?.trim();
  if (filtro === "CON_CITAS") items = items.filter((s) => s.citas > 0);
  else if (filtro === "SIN_CITAS") items = items.filter((s) => s.citas === 0);

  const hasNext = hasNextRaw;
  const nextCursor =
    hasNext && items.length > 0 ? encodeCursor(items[items.length - 1]) : null;

  return { items, nextCursor, hasNext };
}

export type ServicioFila = Awaited<ReturnType<typeof getServices>>["items"][number];

export type ResumenServicios = {
  total: number;
  precioMedio: number;
  masPedido: string;
  citasEsteMes: number;
};

export async function getServiceSummary(
  ref: Date = new Date(),
): Promise<ResumenServicios> {
  const [totalRow] = await db.select({ valor: count() }).from(services);
  const [medioRow] = await db.select({ valor: avg(services.price) }).from(services);
  const total = totalRow?.valor ?? 0;

  const partes = madridParts(ref);
  const claveMes = `${partes.year}-${String(partes.month).padStart(2, "0")}-01`;
  const rangoMes = madridDayRangeUtc(claveMes);
  // Primer día del mes siguiente en hora de Logroño.
  const mesSiguiente =
    partes.month === 12
      ? `${partes.year + 1}-01-01`
      : `${partes.year}-${String(partes.month + 1).padStart(2, "0")}-01`;
  const finMes = madridDayRangeUtc(mesSiguiente)?.start;

  let citasEsteMes = 0;
  let masPedido = "—";
  if (rangoMes && finMes) {
    const filas = await db
      .select({
        service: appointments.service,
        nombre: services.name,
        citas: count(),
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.service, services.id))
      .where(
        and(
          gte(appointments.fechaInicio, rangoMes.start),
          lt(appointments.fechaInicio, finMes),
          ne(appointments.status, "CANCELLED"),
        ),
      )
      .groupBy(appointments.service, services.name)
      .orderBy(sql`count(*) desc`)
      .limit(1);
    const top = filas[0];
    if (top) {
      masPedido = top.nombre ?? "—";
    }
    const [mesRow] = await db
      .select({ valor: count() })
      .from(appointments)
      .where(
        and(
          gte(appointments.fechaInicio, rangoMes.start),
          lt(appointments.fechaInicio, finMes),
          ne(appointments.status, "CANCELLED"),
        ),
      );
    citasEsteMes = mesRow?.valor ?? 0;
  }

  return {
    total,
    precioMedio: Number(medioRow?.valor ?? 0),
    masPedido,
    citasEsteMes,
  };
}

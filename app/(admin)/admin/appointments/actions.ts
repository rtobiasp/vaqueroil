import { db } from "@/src/db";
import { appointments, services, users, vehicles } from "@/src/db/schema";
import { and, asc, eq, gt, or } from "drizzle-orm";

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

export async function getAppointments(afterParam?: string) {
  const after = decodeCursor(afterParam);

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
    .where(
      after
        ? or(
            gt(appointments.fechaInicio, after.fechaInicio),
            and(
              eq(appointments.fechaInicio, after.fechaInicio),
              gt(appointments.id, after.id),
            ),
          )
        : undefined,
    )
    .orderBy(asc(appointments.fechaInicio), asc(appointments.id))
    .limit(PAGE_SIZE + 1); // +1 para saber si hay siguiente

  const hasNext = rows.length > PAGE_SIZE;
  const items = hasNext ? rows.slice(0, -1) : rows;
  const nextCursor =
    hasNext && items.length > 0 ? encodeCursor(items[items.length - 1]) : null;

  return { items, nextCursor, hasNext };
}

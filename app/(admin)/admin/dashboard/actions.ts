import { db } from "@/src/db";
import { appointments, services, users, vehicles } from "@/src/db/schema";
import { and, asc, eq, getTableColumns, gte, lte } from "drizzle-orm";

export const getCitasHoy = async () => {
  const inicioDelDia = new Date();
  inicioDelDia.setHours(0, 0, 0, 0);

  const finDelDia = new Date();
  finDelDia.setHours(23, 59, 59, 999);

  return db
    .select({
      ...getTableColumns(appointments),
      clienteNombre: users.fullName,
      servicioNombre: services.name,
      matricula: vehicles.licensePlate,
      cocheMarca: vehicles.brand,
      cocheModelo: vehicles.model,
    })
    .from(appointments)
    .leftJoin(users, eq(appointments.user, users.id))
    .leftJoin(services, eq(appointments.service, services.id))
    .leftJoin(vehicles, eq(appointments.vehicle, vehicles.id))
    .where(
      and(
        gte(appointments.fechaInicio, inicioDelDia),
        lte(appointments.fechaFin, finDelDia),
      ),
    )
    .orderBy(asc(appointments.fechaInicio));
};

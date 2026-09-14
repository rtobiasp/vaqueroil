"use server";

import { db } from "@/src/db";
import { appointments, services, users, vehicles } from "@/src/db/schema";
import { and, eq, gt, lt, ne, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { APPOINTMENTS_CACHE_TAG } from "@/app/(admin)/admin/dashboard/actions";
import {
  appointmentSchema,
  generateSlots,
  madridDayRangeUtc,
  normalizePhone,
  normalizePlate,
  normalizeVin,
  parseDateKey,
  validateSlot,
  type BusyInterval,
} from "@/lib/schedule";

export type AppointmentActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const SLOT_CONFLICT_MESSAGE = "El horario seleccionado ya no está disponible.";
const MISSING_SLOT_MESSAGE = "Elige un día y una hora disponible.";

export async function processAppointmentForm(
  _previousState: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const data = Object.fromEntries(formData);

  // Los inputs de fecha/hora son hidden: si llegan vacíos es que no se eligió
  // hueco en la UI. Mensaje claro en lugar del genérico de tipo fecha.
  const rawStart = data.appointment_start;
  const rawEnd = data.appointment_end;
  if (
    typeof rawStart !== "string" ||
    rawStart.trim() === "" ||
    typeof rawEnd !== "string" ||
    rawEnd.trim() === ""
  ) {
    return {
      success: false,
      message: MISSING_SLOT_MESSAGE,
      errors: { appointment_start: [MISSING_SLOT_MESSAGE] },
    };
  }

  const result = appointmentSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Revisa los campos indicados.",
    };
  }

  const values = result.data;
  const normalizedEmail = values.email;
  const normalizedPhone = normalizePhone(values.phone);
  const normalizedLicensePlate = normalizePlate(values.license_plate);

  // El servicio debe existir de verdad (un UUID inventado pasa el formato).
  const [existingService] = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.id, values.service))
    .limit(1);
  if (!existingService) {
    return {
      success: false,
      message: "Revisa los campos indicados.",
      errors: { service: ["El servicio seleccionado no existe."] },
    };
  }

  // Reglas de calendario en hora de Logroño: futuro, laborable, turnos,
  // rejilla de 45 min y antelación máxima. El DatePicker ya lo limita en la
  // UI, pero un POST directo no pasaría por él.
  const slotError = validateSlot(
    values.appointment_start,
    values.appointment_end,
  );
  if (slotError) {
    return {
      success: false,
      message: "Revisa los campos indicados.",
      errors: { [slotError.field]: [slotError.message] },
    };
  }

  try {
    await db.transaction(async (tx) => {
      const appointmentStart = values.appointment_start;
      const appointmentEnd = values.appointment_end;

      // Candado por hueco: dos reservas concurrentes del mismo slot se
      // serializan aquí; la segunda verá el conflicto y recibirá un error
      // amable en lugar de duplicar la cita. Huecos distintos no se bloquean.
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${`appt:${appointmentStart.toISOString()}`})::bigint)`,
      );

      const conflictingAppointments = await tx
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(
            lt(appointments.fechaInicio, appointmentEnd),
            gt(appointments.fechaFin, appointmentStart),
            // Las canceladas liberan el hueco.
            ne(appointments.status, "CANCELLED"),
          ),
        )
        .limit(1);

      if (conflictingAppointments.length > 0) {
        throw new Error(SLOT_CONFLICT_MESSAGE);
      }

      const [insertedUser] = await tx
        .insert(users)
        .values({
          fullName: values.full_name,
          email: normalizedEmail,
          phone: normalizedPhone,
        })
        .onConflictDoNothing()
        .returning({ id: users.id });
      let userId = insertedUser?.id;
      if (!userId) {
        const [user] = await tx
          .select({ id: users.id })
          .from(users)
          .where(sql`lower(${users.email}) = ${normalizedEmail}`)
          .limit(1);
        if (!user) {
          throw new Error("No se pudo guardar el usuario.");
        }
        userId = user.id;
        // Refresca los datos si el cliente ya existía (nuevo teléfono, etc.).
        await tx
          .update(users)
          .set({ fullName: values.full_name, phone: normalizedPhone })
          .where(eq(users.id, userId));
      }

      const [insertedVehicle] = await tx
        .insert(vehicles)
        .values({
          licensePlate: normalizedLicensePlate,
          brand: values.brand,
          model: values.model,
          year: values.year,
          vin: normalizeVin(values.vin),
        })
        .onConflictDoNothing({ target: vehicles.licensePlate })
        .returning({ id: vehicles.id });
      let vehicleId = insertedVehicle?.id;
      if (!vehicleId) {
        const [vehicle] = await tx
          .select({ id: vehicles.id })
          .from(vehicles)
          .where(eq(vehicles.licensePlate, normalizedLicensePlate))
          .limit(1);
        if (!vehicle) {
          throw new Error("No se pudo guardar el vehículo.");
        }
        vehicleId = vehicle.id;
        // Refresca los datos si la matrícula ya existía.
        await tx
          .update(vehicles)
          .set({
            brand: values.brand,
            model: values.model,
            year: values.year,
            vin: normalizeVin(values.vin),
          })
          .where(eq(vehicles.id, vehicleId));
      }

      await tx.insert(appointments).values({
        fechaFin: appointmentEnd,
        fechaInicio: appointmentStart,
        notes: values.notes || undefined,
        service: values.service,
        user: userId,
        vehicle: vehicleId,
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === SLOT_CONFLICT_MESSAGE) {
      return {
        success: false,
        message: error.message,
      };
    }
    console.error("Error al procesar la reserva:", error);
    return {
      success: false,
      message: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
    };
  }

  // Nueva cita creada: invalidar el caché del dashboard para no ver datos antiguos.
  // `updateTag` = invalidación inmediata dentro de una Server Action (Next 16).
  // Fuera de una Server Action (Route Handler, etc.) usa `revalidateTag(TAG, "max")`.
  updateTag(APPOINTMENTS_CACHE_TAG);

  return {
    success: true,
    message: "Solicitud enviada correctamente. Te contactaremos pronto.",
  };
}

type AppointmentProp = typeof appointments.$inferSelect;

/**
 * Huecos libres de un día ("YYYY-MM-DD" en hora de Logroño).
 * Turnos 9:00–13:30 y 16:00–19:30 en rejilla de 45 min; fines de semana
 * y días pasados devuelven []. Las citas CANCELLED no ocupan hueco.
 */
export async function getAvailableSlotsForDate(
  dateValue: string,
  existingAppointments?: AppointmentProp[],
) {
  if (!parseDateKey(dateValue)) {
    return [];
  }

  let appointmentsForDate: BusyInterval[];
  if (existingAppointments) {
    appointmentsForDate = existingAppointments.filter(
      (appointment) => appointment.status !== "CANCELLED",
    );
  } else {
    const range = madridDayRangeUtc(dateValue);
    if (!range) {
      return [];
    }

    appointmentsForDate = await db
      .select()
      .from(appointments)
      .where(
        and(
          lt(appointments.fechaInicio, range.end),
          gt(appointments.fechaFin, range.start),
          ne(appointments.status, "CANCELLED"),
        ),
      );
  }

  return generateSlots(dateValue, new Date(), appointmentsForDate);
}

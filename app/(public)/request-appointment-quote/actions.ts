"use server";

import { db } from "@/src/db";
import { appointments, users, vehicles } from "@/src/db/schema";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const SLOT_DURATION_MINUTES = 45;
const OPENING_HOUR = 9;
const CLOSING_HOUR = 18;

export type AppointmentActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const appointmentSchema = z
  .object({
    full_name: z.string().trim().min(2, "El nombre es obligatorio").max(100),
    email: z
      .email("Email con formato no váido.")
      .nonempty("Debes inroducir un email."),
    phone: z.string().trim().min(7, "El teléfono no es válido").max(30),
    service: z.uuid("El servicio no es válido"),
    license_plate: z
      .string()
      .trim()
      .min(1, "La matrícula es obligatoria")
      .max(20),
    brand: z.string().trim().min(1, "La marca es obligatoria").max(50),
    model: z.string().trim().min(1, "El modelo es obligatorio").max(50),
    year: z.coerce
      .number()
      .int()
      .min(1900, "El año no es válido")
      .max(new Date().getFullYear() + 1, "El año no es válido"),
    vin: z.string().trim().max(17, "El VIN no es válido").optional(),
    appointment_start: z.coerce.date("La hora de la cita es obligatoria"),
    notes: z
      .string()
      .trim()
      .max(1000, "Las notas son demasiado largas")
      .optional(),
    appointment_end: z.coerce.date("La hora de fin es obligatoria"),
  })
  .refine(
    (data) =>
      data.appointment_end.getTime() - data.appointment_start.getTime() ===
      SLOT_DURATION_MINUTES * 60_000,
    {
      path: ["appointment_end"],
      message: "La cita debe durar 45 minutos.",
    },
  );

export async function processAppointmentForm(
  _previousState: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const data = Object.fromEntries(formData);

  const result = appointmentSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Revisa los campos indicados.",
    };
  }

  const values = result.data;
  const normalizedEmail = values.email.trim().toLowerCase();
  const normalizedLicensePlate = values.license_plate.trim().toUpperCase();

  try {
    await db.transaction(async (tx) => {
      const [insertedUser] = await tx
        .insert(users)
        .values({
          fullName: values.full_name,
          email: normalizedEmail,
          phone: values.phone,
        })
        .onConflictDoNothing()
        .returning({ id: users.id });
      const [user] = insertedUser
        ? [insertedUser]
        : await tx
            .select({ id: users.id })
            .from(users)
            .where(sql`lower(${users.email}) = ${normalizedEmail}`)
            .limit(1);

      const [insertedVehicle] = await tx
        .insert(vehicles)
        .values({
          licensePlate: normalizedLicensePlate,
          brand: values.brand,
          model: values.model,
          year: values.year,
          vin: values.vin || undefined,
        })
        .onConflictDoNothing({ target: vehicles.licensePlate })
        .returning({ id: vehicles.id });
      const [vehicle] = insertedVehicle
        ? [insertedVehicle]
        : await tx
            .select({ id: vehicles.id })
            .from(vehicles)
            .where(eq(vehicles.licensePlate, normalizedLicensePlate))
            .limit(1);

      const appointmentStart = values.appointment_start;
      const appointmentEnd = values.appointment_end;
      const conflictingAppointments = await tx
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(
            lt(appointments.fechaInicio, appointmentEnd),
            gt(appointments.fechaFin, appointmentStart),
          ),
        )
        .limit(1);

      if (conflictingAppointments.length > 0) {
        throw new Error("El horario seleccionado ya no está disponible.");
      }

      await tx.insert(appointments).values({
        fechaFin: appointmentEnd,
        fechaInicio: appointmentStart,
        notes: values.notes || undefined,
        service: values.service,
        user: user.id,
        vehicle: vehicle.id,
      });
    });
  } catch {
    return {
      success: false,
      message: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
    };
  }
}

export async function getAvailableSlotsForDate(dateValue: string) {
  const start = new Date(`${dateValue}T00:00:00.000Z`);
  const end = new Date(`${dateValue}T23:59:59.999Z`);

  const appointmentsForDate = await db
    .select()
    .from(appointments)
    .where(
      and(lt(appointments.fechaInicio, end), gt(appointments.fechaFin, start)),
    );

  const slots: { value: string; endValue: string; label: string }[] = [];
  const firstSlot = new Date(
    `${dateValue}T${String(OPENING_HOUR).padStart(2, "0")}:00:00.000Z`,
  );
  const closingTime = new Date(
    `${dateValue}T${String(CLOSING_HOUR).padStart(2, "0")}:00:00.000Z`,
  );

  for (
    let slotStart = firstSlot;
    slotStart < closingTime;
    slotStart = new Date(slotStart.getTime() + SLOT_DURATION_MINUTES * 60_000)
  ) {
    const slotEnd = new Date(
      slotStart.getTime() + SLOT_DURATION_MINUTES * 60_000,
    );

    if (slotEnd > closingTime) {
      break;
    }

    const isOccupied = appointmentsForDate.some(
      (appointment) =>
        appointment.fechaInicio < slotEnd && appointment.fechaFin > slotStart,
    );

    if (!isOccupied) {
      slots.push({
        value: slotStart.toISOString(),
        endValue: slotEnd.toISOString(),
        label: slotStart.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        }),
      });
    }
  }

  return slots;
}

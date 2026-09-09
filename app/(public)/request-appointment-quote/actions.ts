"use server";

import { db } from "@/src/db";
import { appointments, users, vehicles } from "@/src/db/schema";
import { z } from "zod";

export type AppointmentActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const appointmentSchema = z.object({
  full_name: z.string().trim().min(2, "El nombre es obligatorio").max(100),
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
  notes: z
    .string()
    .trim()
    .max(1000, "Las notas son demasiado largas")
    .optional(),
});

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

  try {
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ fullName: values.full_name, phone: values.phone })
        .returning({ id: users.id });

      const [vehicle] = await tx
        .insert(vehicles)
        .values({
          licensePlate: values.license_plate,
          brand: values.brand,
          model: values.model,
          year: values.year,
          vin: values.vin || undefined,
        })
        .returning({ id: vehicles.id });

      const now = new Date();
      await tx.insert(appointments).values({
        fechaFin: now,
        fechaInicio: now,
        notes: values.notes || undefined,
        service: values.service,
        user: user.id,
        vehicle: vehicle.id,
      });
    });

    return {
      success: true,
      message: "Solicitud enviada correctamente.",
    };
  } catch {
    return {
      success: false,
      message: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
    };
  }
}

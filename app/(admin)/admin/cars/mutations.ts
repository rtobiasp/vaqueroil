"use server";

import { APPOINTMENTS_CACHE_TAG } from "@/app/(admin)/admin/dashboard/actions";
import { db } from "@/src/db";
import { appointments, vehicles } from "@/src/db/schema";
import { eq, ne } from "drizzle-orm";
import { and } from "drizzle-orm";
import { updateTag } from "next/cache";

export type MutationResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

function normalizarMatricula(v: string): string {
  return v.trim().toUpperCase().replace(/\s+/g, " ");
}

function validarCampos(formData: FormData) {
  const licensePlate = normalizarMatricula(
    String(formData.get("matricula") ?? ""),
  );
  const brand = String(formData.get("marca") ?? "").trim();
  const model = String(formData.get("modelo") ?? "").trim();
  const year = Number(String(formData.get("ano") ?? "").trim());
  const vinRaw = String(formData.get("vin") ?? "").trim().toUpperCase();
  const vin = vinRaw === "" ? null : vinRaw;

  const errors: Record<string, string[]> = {};
  if (licensePlate.length < 4 || licensePlate.length > 20) {
    errors.matricula = ["La matrícula no es válida."];
  }
  if (brand.length < 2 || brand.length > 80) {
    errors.marca = ["La marca debe tener entre 2 y 80 caracteres."];
  }
  if (model.length < 1 || model.length > 80) {
    errors.modelo = ["El modelo debe tener entre 1 y 80 caracteres."];
  }
  const anoActual = new Date().getFullYear();
  if (!Number.isInteger(year) || year < 1950 || year > anoActual + 1) {
    errors.ano = ["El año no es válido."];
  }
  if (vin !== null && (vin.length < 8 || vin.length > 25)) {
    errors.vin = ["El VIN debe tener entre 8 y 25 caracteres."];
  }

  return { licensePlate, brand, model, year, vin, errors };
}

export async function crearCoche(
  _prev: MutationResult,
  formData: FormData,
): Promise<MutationResult> {
  const { licensePlate, brand, model, year, vin, errors } =
    validarCampos(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Revisa los campos indicados.", errors };
  }

  const [existe] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.licensePlate, licensePlate))
    .limit(1);
  if (existe) {
    return {
      success: false,
      message: "Ya existe un coche con esa matrícula.",
      errors: { matricula: ["Ya existe un coche con esa matrícula."] },
    };
  }

  await db.insert(vehicles).values({
    licensePlate,
    brand,
    model,
    year,
    vin,
  });

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true, message: "Coche creado." };
}

export async function editarCoche(
  _prev: MutationResult,
  formData: FormData,
): Promise<MutationResult> {
  const id = formData.get("id");
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }

  const { licensePlate, brand, model, year, vin, errors } =
    validarCampos(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Revisa los campos indicados.", errors };
  }

  const [coche] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.id, id))
    .limit(1);
  if (!coche) {
    return { success: false, message: "El coche ya no existe." };
  }

  const [otro] = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(
      and(eq(vehicles.licensePlate, licensePlate), ne(vehicles.id, id)),
    )
    .limit(1);
  if (otro) {
    return {
      success: false,
      message: "Ya existe otro coche con esa matrícula.",
      errors: { matricula: ["Ya existe otro coche con esa matrícula."] },
    };
  }

  await db
    .update(vehicles)
    .set({ licensePlate, brand, model, year, vin })
    .where(eq(vehicles.id, id));

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true, message: "Coche actualizado." };
}

export async function eliminarCoche(id: string): Promise<MutationResult> {
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }

  const citas = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(eq(appointments.vehicle, id))
    .limit(1);
  if (citas.length > 0) {
    return {
      success: false,
      message: "No se puede eliminar: tiene citas asociadas.",
    };
  }

  const eliminados = await db
    .delete(vehicles)
    .where(eq(vehicles.id, id))
    .returning({ id: vehicles.id });
  if (eliminados.length === 0) {
    return { success: false, message: "El coche ya no existe." };
  }

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true };
}

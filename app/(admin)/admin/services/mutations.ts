"use server";

import { APPOINTMENTS_CACHE_TAG } from "@/app/(admin)/admin/dashboard/actions";
import { db } from "@/src/db";
import { appointments, services } from "@/src/db/schema";
import { eq } from "drizzle-orm";
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

function validarCampos(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const precioRaw = String(formData.get("precio") ?? "")
    .trim()
    .replace(",", ".");

  const errors: Record<string, string[]> = {};
  if (nombre.length < 3) {
    errors.nombre = ["El nombre debe tener al menos 3 caracteres."];
  }
  if (nombre.length > 120) {
    errors.nombre = ["El nombre no puede superar 120 caracteres."];
  }
  if (descripcion.length > 500) {
    errors.descripcion = ["La descripción no puede superar 500 caracteres."];
  }
  const precio = Number(precioRaw);
  if (precioRaw === "" || Number.isNaN(precio) || precio <= 0) {
    errors.precio = ["El precio debe ser un número mayor que 0."];
  } else if (precio > 100000) {
    errors.precio = ["El precio no puede superar 100.000 €."];
  }

  return { nombre, descripcion, precioRaw, errors };
}

export async function crearServicio(
  _prev: MutationResult,
  formData: FormData,
): Promise<MutationResult> {
  const { nombre, descripcion, precioRaw, errors } = validarCampos(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Revisa los campos indicados.", errors };
  }

  await db.insert(services).values({
    name: nombre,
    description: descripcion || null,
    price: precioRaw,
  });

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true, message: "Servicio creado." };
}

export async function editarServicio(
  _prev: MutationResult,
  formData: FormData,
): Promise<MutationResult> {
  const id = formData.get("id");
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }

  const { nombre, descripcion, precioRaw, errors } = validarCampos(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Revisa los campos indicados.", errors };
  }

  const [servicio] = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  if (!servicio) {
    return { success: false, message: "El servicio ya no existe." };
  }

  await db
    .update(services)
    .set({ name: nombre, description: descripcion || null, price: precioRaw })
    .where(eq(services.id, id));

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true, message: "Servicio actualizado." };
}

export async function eliminarServicio(id: string): Promise<MutationResult> {
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }

  const citas = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(eq(appointments.service, id))
    .limit(1);
  if (citas.length > 0) {
    return {
      success: false,
      message: "No se puede eliminar: tiene citas asociadas.",
    };
  }

  const eliminados = await db
    .delete(services)
    .where(eq(services.id, id))
    .returning({ id: services.id });
  if (eliminados.length === 0) {
    return { success: false, message: "El servicio ya no existe." };
  }

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true };
}

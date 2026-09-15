"use server";

import { APPOINTMENTS_CACHE_TAG } from "@/app/(admin)/admin/dashboard/actions";
import { db } from "@/src/db";
import { appointments, users } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCampos(formData: FormData) {
  const fullName = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phoneRaw = String(formData.get("telefono") ?? "").trim();
  const phone = phoneRaw === "" ? null : phoneRaw;

  const errors: Record<string, string[]> = {};
  if (fullName.length < 3 || fullName.length > 120) {
    errors.nombre = ["El nombre debe tener entre 3 y 120 caracteres."];
  }
  if (!EMAIL_RE.test(email) || email.length > 160) {
    errors.email = ["El email no es válido."];
  }
  if (phone !== null && (phone.length < 6 || phone.length > 32)) {
    errors.telefono = ["El teléfono no es válido."];
  }

  return { fullName, email, phone, errors };
}

export async function crearUsuario(
  _prev: MutationResult,
  formData: FormData,
): Promise<MutationResult> {
  const { fullName, email, phone, errors } = validarCampos(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Revisa los campos indicados.", errors };
  }

  const [existe] = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`)
    .limit(1);
  if (existe) {
    return {
      success: false,
      message: "Ya existe un cliente con ese email.",
      errors: { email: ["Ya existe un cliente con ese email."] },
    };
  }

  await db.insert(users).values({ fullName, email, phone });

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true, message: "Cliente creado." };
}

export async function editarUsuario(
  _prev: MutationResult,
  formData: FormData,
): Promise<MutationResult> {
  const id = formData.get("id");
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }

  const { fullName, email, phone, errors } = validarCampos(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Revisa los campos indicados.", errors };
  }

  const [usuario] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!usuario) {
    return { success: false, message: "El cliente ya no existe." };
  }

  const [otro] = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${email} AND ${users.id} != ${id}`)
    .limit(1);
  if (otro) {
    return {
      success: false,
      message: "Ya existe otro cliente con ese email.",
      errors: { email: ["Ya existe otro cliente con ese email."] },
    };
  }

  await db
    .update(users)
    .set({ fullName, email, phone })
    .where(eq(users.id, id));

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true, message: "Cliente actualizado." };
}

export async function eliminarUsuario(id: string): Promise<MutationResult> {
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }

  const citas = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(eq(appointments.user, id))
    .limit(1);
  if (citas.length > 0) {
    return {
      success: false,
      message: "No se puede eliminar: tiene citas asociadas.",
    };
  }

  const eliminados = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });
  if (eliminados.length === 0) {
    return { success: false, message: "El cliente ya no existe." };
  }

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true };
}

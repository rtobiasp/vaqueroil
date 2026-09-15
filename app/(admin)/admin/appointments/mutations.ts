"use server";

import { APPOINTMENTS_CACHE_TAG } from "@/app/(admin)/admin/dashboard/actions";
import { db } from "@/src/db";
import { appointments } from "@/src/db/schema";
import { and, eq, gt, inArray, lt, ne } from "drizzle-orm";
import { updateTag } from "next/cache";

export type MutationResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

type Estado = typeof appointments.$inferSelect.status;
type AccionEstado = "confirmar" | "iniciar" | "completar" | "cancelar";

const TRANSICIONES: Record<AccionEstado, { desde: Estado[]; a: Estado }> = {
  confirmar: { desde: ["PENDING"], a: "CONFIRMED" },
  iniciar: { desde: ["CONFIRMED"], a: "IN_PROGRESS" },
  completar: { desde: ["IN_PROGRESS"], a: "COMPLETED" },
  cancelar: { desde: ["PENDING", "CONFIRMED", "IN_PROGRESS"], a: "CANCELLED" },
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

function esAccion(v: string): v is AccionEstado {
  return v in TRANSICIONES;
}

export async function cambiarEstadoCita(
  id: string,
  accion: AccionEstado,
): Promise<MutationResult> {
  if (!esUuid(id) || !esAccion(accion)) {
    return { success: false, message: "Petición no válida." };
  }
  const { desde, a } = TRANSICIONES[accion];

  const actualizadas = await db
    .update(appointments)
    .set({ status: a })
    .where(and(eq(appointments.id, id), inArray(appointments.status, desde)))
    .returning({ id: appointments.id });

  if (actualizadas.length === 0) {
    const [cita] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(eq(appointments.id, id))
      .limit(1);
    if (!cita) return { success: false, message: "La cita ya no existe." };
    return {
      success: false,
      message: "La cita cambió de estado. Recarga la lista.",
    };
  }

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true };
}

export async function eliminarCita(id: string): Promise<MutationResult> {
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }
  const eliminadas = await db
    .delete(appointments)
    .where(eq(appointments.id, id))
    .returning({ id: appointments.id });

  if (eliminadas.length === 0) {
    return { success: false, message: "La cita ya no existe." };
  }

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true };
}

const ESTADOS_EDITABLES: Estado[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export async function editarCita(
  _prev: MutationResult,
  formData: FormData,
): Promise<MutationResult> {
  const id = formData.get("id");
  if (!esUuid(id)) {
    return { success: false, message: "Petición no válida." };
  }

  const inicio = new Date(String(formData.get("inicio") ?? ""));
  const fin = new Date(String(formData.get("fin") ?? ""));
  const estado = String(formData.get("estado") ?? "");
  const notas = String(formData.get("notas") ?? "").trim();

  const errors: Record<string, string[]> = {};
  if (Number.isNaN(inicio.getTime())) {
    errors.inicio = ["La fecha de inicio no es válida."];
  }
  if (Number.isNaN(fin.getTime())) {
    errors.fin = ["La fecha de fin no es válida."];
  }
  if (
    !Number.isNaN(inicio.getTime()) &&
    !Number.isNaN(fin.getTime()) &&
    fin <= inicio
  ) {
    errors.fin = ["La fecha de fin debe ser posterior al inicio."];
  }
  if (!(ESTADOS_EDITABLES as string[]).includes(estado)) {
    errors.estado = ["El estado no es válido."];
  }
  if (notas.length > 500) {
    errors.notas = ["Las notas no pueden superar 500 caracteres."];
  }
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Revisa los campos indicados.", errors };
  }

  const [cita] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);
  if (!cita) {
    return { success: false, message: "La cita ya no existe." };
  }

  if (estado !== "CANCELLED") {
    const solapes = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          ne(appointments.id, id),
          lt(appointments.fechaInicio, fin),
          gt(appointments.fechaFin, inicio),
          ne(appointments.status, "CANCELLED"),
        ),
      )
      .limit(1);
    if (solapes.length > 0) {
      return {
        success: false,
        message: "Ese horario se solapa con otra cita.",
        errors: { inicio: ["Ese horario se solapa con otra cita."] },
      };
    }
  }

  await db
    .update(appointments)
    .set({
      fechaInicio: inicio,
      fechaFin: fin,
      status: estado as Estado,
      notes: notas || null,
    })
    .where(eq(appointments.id, id));

  updateTag(APPOINTMENTS_CACHE_TAG);
  return { success: true, message: "Cita actualizada." };
}

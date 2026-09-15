"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Pencil, Play, Trash2, X } from "lucide-react";
import type { CitaFila } from "./actions";
import { AppointmentDetailDialog } from "./detail-dialog";
import { AppointmentEditDialog } from "./edit-dialog";
import {
  cambiarEstadoCita,
  editarCita,
  eliminarCita,
  type MutationResult,
} from "./mutations";

const ACCION_PRIMARIA = {
  PENDING: { accion: "confirmar", titulo: "Confirmar", Icono: Check },
  CONFIRMED: { accion: "iniciar", titulo: "Iniciar", Icono: Play },
  IN_PROGRESS: { accion: "completar", titulo: "Completar", Icono: Check },
} as const;

type EstadoAccionable = keyof typeof ACCION_PRIMARIA;

function esAccionable(estado: string): estado is EstadoAccionable {
  return estado in ACCION_PRIMARIA;
}

const ESTADOS_FINALES: readonly string[] = ["COMPLETED", "CANCELLED"];

const btnBase =
  "rounded-md border p-1.5 transition-colors disabled:cursor-wait disabled:opacity-50";
const btnNeutro =
  "border-black/10 text-text-main/70 hover:bg-bg-light hover:text-text-main";

export function AccionesCita({ cita }: { cita: CitaFila }) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const detalleRef = useRef<HTMLDialogElement>(null);
  const edicionRef = useRef<HTMLDialogElement>(null);

  const [estadoEdicion, accionEdicion] = useActionState<MutationResult, FormData>(
    editarCita,
    { success: false },
  );

  useEffect(() => {
    if (estadoEdicion.success) {
      edicionRef.current?.close();
      router.refresh();
    }
  }, [estadoEdicion, router]);

  const mutar = (fn: () => Promise<MutationResult>) => {
    setError(null);
    startTransition(async () => {
      const r = await fn();
      if (r.success) router.refresh();
      else setError(r.message ?? "No se pudo completar la acción.");
    });
  };

  const primaria = esAccionable(cita.status)
    ? ACCION_PRIMARIA[cita.status]
    : null;
  const cancelable = !ESTADOS_FINALES.includes(cita.status);

  return (
    <div>
      <div className="flex justify-end gap-1.5">
        <button
          type="button"
          title="Ver detalle"
          aria-label={`Ver cita de ${cita.userName}`}
          className={`${btnBase} ${btnNeutro}`}
          onClick={() => detalleRef.current?.showModal()}
        >
          <Eye size={16} />
        </button>
        <button
          type="button"
          title="Editar"
          aria-label={`Editar cita de ${cita.userName}`}
          className={`${btnBase} ${btnNeutro}`}
          onClick={() => edicionRef.current?.showModal()}
        >
          <Pencil size={16} />
        </button>
        {primaria ? (
          <button
            type="button"
            title={primaria.titulo}
            aria-label={`${primaria.titulo} cita de ${cita.userName}`}
            disabled={pendiente}
            className={`${btnBase} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
            onClick={() => mutar(() => cambiarEstadoCita(cita.id, primaria.accion))}
          >
            <primaria.Icono size={16} />
          </button>
        ) : null}
        {cancelable ? (
          <button
            type="button"
            title="Cancelar"
            aria-label={`Cancelar cita de ${cita.userName}`}
            disabled={pendiente}
            className={`${btnBase} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
            onClick={() => {
              if (window.confirm(`¿Cancelar la cita de ${cita.userName}?`)) {
                mutar(() => cambiarEstadoCita(cita.id, "cancelar"));
              }
            }}
          >
            <X size={16} />
          </button>
        ) : null}
        <button
          type="button"
          title="Eliminar"
          aria-label={`Eliminar cita de ${cita.userName}`}
          disabled={pendiente}
          className={`${btnBase} ${btnNeutro}`}
          onClick={() => {
            if (
              window.confirm(
                `¿Eliminar definitivamente la cita de ${cita.userName}?`,
              )
            ) {
              mutar(() => eliminarCita(cita.id));
            }
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-1 text-right text-xs text-red-600">
          {error}
        </p>
      ) : null}

      <AppointmentDetailDialog cita={cita} dialogRef={detalleRef} />
      <AppointmentEditDialog
        cita={cita}
        dialogRef={edicionRef}
        estado={estadoEdicion}
        accion={accionEdicion}
        onCerrar={() => edicionRef.current?.close()}
      />
    </div>
  );
}

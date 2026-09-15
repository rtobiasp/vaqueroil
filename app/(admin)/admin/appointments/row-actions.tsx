"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Pencil, Play, Trash2, X } from "lucide-react";
import type { CitaFila } from "./actions";
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

const FINAL = ["COMPLETED", "CANCELLED"] as const;

const btnBase =
  "rounded-md border p-1.5 transition-colors disabled:cursor-wait disabled:opacity-50";
const btnNeutro =
  "border-black/10 text-text-main/70 hover:bg-bg-light hover:text-text-main";

function formatoFechaHora(d: Date): string {
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/** "2026-09-15T09:30" en hora local, para <input type="datetime-local">. */
function aInputLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

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

  // Al guardar la edición: cerrar diálogo y repintar la tabla.
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

  const primaria =
    cita.status in ACCION_PRIMARIA
      ? ACCION_PRIMARIA[cita.status as keyof typeof ACCION_PRIMARIA]
      : null;
  const cancelable = !(FINAL as readonly string[]).includes(cita.status);

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
          className={`${btnBase} ${btnNeutro} hidden sm:block`}
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

      {/* Detalle */}
      <dialog
        ref={detalleRef}
        className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
      >
        <h2 className="text-base font-bold">Cita de {cita.userName}</h2>
        <dl className="mt-3 space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-text-main/60">Cliente</dt>
            <dd className="text-right font-medium">
              {cita.userName}
              <br />
              <span className="font-normal text-text-main/60">
                {cita.userPhone ?? cita.userEmail}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-main/60">Vehículo</dt>
            <dd className="text-right font-medium">
              {cita.vehiclePlate}
              <br />
              <span className="font-normal text-text-main/60">
                {cita.vehicleBrand} {cita.vehicleModel}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-main/60">Servicio</dt>
            <dd className="text-right font-medium">{cita.serviceName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-main/60">Inicio</dt>
            <dd className="text-right font-medium">
              {formatoFechaHora(cita.fechaInicio)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-main/60">Fin</dt>
            <dd className="text-right font-medium">
              {formatoFechaHora(cita.fechaFin)}
            </dd>
          </div>
          {cita.notes ? (
            <div>
              <dt className="text-text-main/60">Notas</dt>
              <dd className="mt-0.5">{cita.notes}</dd>
            </div>
          ) : null}
        </dl>
        <form method="dialog" className="mt-4 text-right">
          <button
            type="submit"
            className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-bg-light"
          >
            Cerrar
          </button>
        </form>
      </dialog>

      {/* Edición */}
      <dialog
        ref={edicionRef}
        className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
      >
        <h2 className="text-base font-bold">Editar cita de {cita.userName}</h2>
        <form action={accionEdicion} className="mt-3 space-y-3">
          <input type="hidden" name="id" value={cita.id} />
          <label className="block">
            <span className="mb-1 block text-xs text-text-main/60">Inicio</span>
            <input
              type="datetime-local"
              name="inicio"
              required
              defaultValue={aInputLocal(cita.fechaInicio)}
              className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
            />
            {estadoEdicion.errors?.inicio ? (
              <span className="mt-1 block text-xs text-red-600">
                {estadoEdicion.errors.inicio[0]}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-text-main/60">Fin</span>
            <input
              type="datetime-local"
              name="fin"
              required
              defaultValue={aInputLocal(cita.fechaFin)}
              className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
            />
            {estadoEdicion.errors?.fin ? (
              <span className="mt-1 block text-xs text-red-600">
                {estadoEdicion.errors.fin[0]}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-text-main/60">Estado</span>
            <select
              name="estado"
              defaultValue={cita.status}
              className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
            >
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="IN_PROGRESS">En taller</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
            {estadoEdicion.errors?.estado ? (
              <span className="mt-1 block text-xs text-red-600">
                {estadoEdicion.errors.estado[0]}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-text-main/60">Notas</span>
            <textarea
              name="notas"
              rows={3}
              maxLength={500}
              defaultValue={cita.notes ?? ""}
              className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
            />
            {estadoEdicion.errors?.notas ? (
              <span className="mt-1 block text-xs text-red-600">
                {estadoEdicion.errors.notas[0]}
              </span>
            ) : null}
          </label>
          {!estadoEdicion.success && estadoEdicion.message ? (
            <p role="alert" className="text-xs text-red-600">
              {estadoEdicion.message}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => edicionRef.current?.close()}
              className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-bg-light"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-primary-hover"
            >
              Guardar
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

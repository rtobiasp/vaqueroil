import type { RefObject } from "react";
import type { CitaFila } from "./actions";
import type { MutationResult } from "./mutations";

function aInputLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function AppointmentEditDialog({
  cita,
  dialogRef,
  estado,
  accion,
  onCerrar,
}: {
  cita: CitaFila;
  dialogRef: RefObject<HTMLDialogElement | null>;
  estado: MutationResult;
  accion: (formData: FormData) => void;
  onCerrar: () => void;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-base font-bold">Editar cita de {cita.userName}</h2>
      <form action={accion} className="mt-3 space-y-3">
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
          {estado.errors?.inicio ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.inicio[0]}
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
          {estado.errors?.fin ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.fin[0]}
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
          {estado.errors?.estado ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.estado[0]}
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
          {estado.errors?.notas ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.notas[0]}
            </span>
          ) : null}
        </label>
        {!estado.success && estado.message ? (
          <p role="alert" className="text-xs text-red-600">
            {estado.message}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCerrar}
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
  );
}

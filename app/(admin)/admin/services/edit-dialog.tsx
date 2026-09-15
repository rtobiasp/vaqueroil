import type { RefObject } from "react";
import type { ServicioFila } from "./actions";
import type { MutationResult } from "./mutations";

type Props = {
  servicio: ServicioFila;
  dialogRef: RefObject<HTMLDialogElement | null>;
  estado: MutationResult;
  accion: (formData: FormData) => void;
  onCerrar: () => void;
};

export function ServiceEditDialog({
  servicio,
  dialogRef,
  estado,
  accion,
  onCerrar,
}: Props) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-base font-bold">Editar {servicio.name}</h2>
      <form action={accion} className="mt-3 space-y-3">
        <input type="hidden" name="id" value={servicio.id} />
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Nombre</span>
          <input
            type="text"
            name="nombre"
            required
            minLength={3}
            maxLength={120}
            defaultValue={servicio.name}
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
          {estado.errors?.nombre ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.nombre[0]}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">
            Precio (€)
          </span>
          <input
            type="text"
            inputMode="decimal"
            name="precio"
            required
            defaultValue={String(servicio.price).replace(".", ",")}
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
          {estado.errors?.precio ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.precio[0]}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">
            Descripción
          </span>
          <textarea
            name="descripcion"
            rows={3}
            maxLength={500}
            defaultValue={servicio.description ?? ""}
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
          {estado.errors?.descripcion ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.descripcion[0]}
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
            className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-bg-dark hover:bg-accent-primary-hover hover:text-text-inverse"
          >
            Guardar
          </button>
        </div>
      </form>
    </dialog>
  );
}

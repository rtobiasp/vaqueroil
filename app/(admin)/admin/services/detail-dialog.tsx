import type { RefObject } from "react";
import type { ServicioFila } from "./actions";
import { formatoPrecio } from "./status";

export function ServiceDetailDialog({
  servicio,
  dialogRef,
}: {
  servicio: ServicioFila;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-base font-bold">{servicio.name}</h2>
      <dl className="mt-3 space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Precio</dt>
          <dd className="text-right font-medium">
            {formatoPrecio(servicio.price)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Citas</dt>
          <dd className="text-right font-medium">
            {servicio.citas} {servicio.citas === 1 ? "cita" : "citas"}
          </dd>
        </div>
        <div>
          <dt className="text-text-main/60">Descripción</dt>
          <dd className="mt-0.5">
            {servicio.description ?? "Sin descripción."}
          </dd>
        </div>
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
  );
}

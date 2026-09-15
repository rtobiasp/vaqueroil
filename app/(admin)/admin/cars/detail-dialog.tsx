import type { RefObject } from "react";
import type { CocheFila } from "./actions";
import { ESTILO_ESTADO, ETIQUETA_ESTADO } from "./status";

function formatoFecha(d: Date): string {
  return `${d.toLocaleDateString("es-ES")} ${d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function CarDetailDialog({
  coche,
  dialogRef,
}: {
  coche: CocheFila;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-base font-bold">
        {coche.brand} {coche.model}
      </h2>
      <p className="mt-1 inline-flex rounded-md border border-black/10 bg-bg-light px-2.5 py-1 font-mono text-sm font-bold tracking-wide">
        {coche.licensePlate}
      </p>
      <dl className="mt-3 space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Estado</dt>
          <dd>
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${ESTILO_ESTADO[coche.estado]}`}
            >
              {ETIQUETA_ESTADO[coche.estado]}
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Dueño</dt>
          <dd className="text-right font-medium">
            {coche.dueno ?? "Sin citas registradas"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Año</dt>
          <dd className="text-right font-medium">{coche.year}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">VIN</dt>
          <dd className="truncate text-right font-mono text-xs">
            {coche.vin ?? "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Próxima cita</dt>
          <dd className="text-right font-medium">
            {coche.proximaCita ? formatoFecha(coche.proximaCita) : "Sin citas"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Historial</dt>
          <dd className="text-right font-medium">
            {coche.totalCitas} {coche.totalCitas === 1 ? "cita" : "citas"}
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

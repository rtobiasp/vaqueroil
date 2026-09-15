import type { RefObject } from "react";
import type { CitaFila } from "./actions";

function formatoFechaHora(d: Date): string {
  return `${d.toLocaleDateString("es-ES")} ${d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function AppointmentDetailDialog({
  cita,
  dialogRef,
}: {
  cita: CitaFila;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog
      ref={dialogRef}
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
  );
}

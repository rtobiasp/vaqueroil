import type { RefObject } from "react";
import type { UsuarioFila } from "./actions";
import { iniciales } from "./status";

function formatoFecha(d: Date): string {
  return `${d.toLocaleDateString("es-ES")} ${d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function UserDetailDialog({
  usuario,
  dialogRef,
}: {
  usuario: UsuarioFila;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-dark text-xs font-bold text-text-inverse">
          {iniciales(usuario.fullName)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">{usuario.fullName}</h2>
          <p className="truncate text-xs text-text-main/60">{usuario.email}</p>
        </div>
      </div>
      <dl className="mt-3 space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Teléfono</dt>
          <dd className="text-right font-medium">{usuario.phone ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Matrícula principal</dt>
          <dd className="text-right font-medium">
            {usuario.matriculaPrincipal ?? "Sin coches"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Coches</dt>
          <dd className="text-right font-medium">
            {usuario.coches} {usuario.coches === 1 ? "coche" : "coches"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Citas</dt>
          <dd className="text-right font-medium">
            {usuario.citas} {usuario.citas === 1 ? "cita" : "citas"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-main/60">Última visita</dt>
          <dd className="text-right font-medium">
            {usuario.ultimaVisita
              ? formatoFecha(usuario.ultimaVisita)
              : "Sin visitas"}
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

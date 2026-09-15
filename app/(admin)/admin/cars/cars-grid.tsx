"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Car, Eye, Pencil, Trash2 } from "lucide-react";
import type { CocheFila } from "./actions";
import { CarDetailDialog } from "./detail-dialog";
import { CarEditDialog } from "./edit-dialog";
import {
  editarCoche,
  eliminarCoche,
  type MutationResult,
} from "./mutations";
import { ESTILO_ESTADO, ETIQUETA_ESTADO } from "./status";

function formatoProxima(d: Date | null): string {
  if (!d) return "Sin citas";
  const hoy = new Date().toLocaleDateString("es-ES");
  const fecha = d.toLocaleDateString("es-ES");
  const hora = d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (fecha === hoy) return `Hoy ${hora}`;
  return `${fecha} ${hora}`;
}

export function CarsGrid({ coches }: { coches: CocheFila[] }) {
  if (coches.length === 0) {
    return (
      <p className="rounded-2xl border border-black/5 bg-white px-4 py-8 text-center text-sm text-text-main/60 shadow-sm">
        Sin resultados para los filtros aplicados.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
      {coches.map((coche) => (
        <CocheCard key={coche.id} coche={coche} />
      ))}
    </div>
  );
}

function CocheCard({ coche }: { coche: CocheFila }) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const detalleRef = useRef<HTMLDialogElement>(null);
  const edicionRef = useRef<HTMLDialogElement>(null);

  const [estadoEdicion, accionEdicion] = useActionState<MutationResult, FormData>(
    editarCoche,
    { success: false },
  );

  useEffect(() => {
    if (estadoEdicion.success) {
      edicionRef.current?.close();
      router.refresh();
    }
  }, [estadoEdicion, router]);

  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 rounded-lg bg-bg-dark p-2 text-text-inverse">
            <Car size={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base">
              {coche.brand} {coche.model}
            </p>
            <p className="text-xs text-text-main/60">{coche.year}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${ESTILO_ESTADO[coche.estado]}`}
        >
          {ETIQUETA_ESTADO[coche.estado]}
        </span>
      </div>

      <p className="inline-flex w-fit rounded-md border border-black/10 bg-bg-light px-2.5 py-1 font-mono text-sm font-bold tracking-wide">
        {coche.licensePlate}
      </p>

      <dl className="flex flex-col gap-1.5 border-t border-black/5 pt-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-text-main/60">Dueño</dt>
          <dd className="truncate font-medium">
            {coche.dueno ?? "Sin registrar"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-text-main/60">VIN</dt>
          <dd className="truncate font-mono text-xs">{coche.vin ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-text-main/60">Próxima cita</dt>
          <dd className="font-medium">{formatoProxima(coche.proximaCita)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex gap-2 border-t border-black/5 pt-3">
        <button
          type="button"
          onClick={() => detalleRef.current?.showModal()}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-black/10 px-3 py-2 text-xs font-medium text-text-main transition-colors hover:bg-bg-light"
        >
          <Eye size={14} /> Ver
        </button>
        <button
          type="button"
          onClick={() => edicionRef.current?.showModal()}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-black/10 px-3 py-2 text-xs font-medium text-text-main transition-colors hover:bg-bg-light"
        >
          <Pencil size={14} /> Editar
        </button>
        <button
          type="button"
          title="Eliminar"
          aria-label={`Eliminar ${coche.licensePlate}`}
          disabled={pendiente}
          onClick={() => {
            if (
              window.confirm(
                `¿Eliminar definitivamente el coche ${coche.licensePlate}?`,
              )
            ) {
              setError(null);
              startTransition(async () => {
                const r = await eliminarCoche(coche.id);
                if (r.success) router.refresh();
                else setError(r.message ?? "No se pudo eliminar.");
              });
            }
          }}
          className="rounded-md border border-black/10 p-2 text-text-main/70 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}

      <CarDetailDialog coche={coche} dialogRef={detalleRef} />
      <CarEditDialog
        coche={coche}
        dialogRef={edicionRef}
        estado={estadoEdicion}
        accion={accionEdicion}
        onCerrar={() => edicionRef.current?.close()}
      />
    </article>
  );
}

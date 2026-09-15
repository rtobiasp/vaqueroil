"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ServicioFila } from "./actions";
import { ServiceDetailDialog } from "./detail-dialog";
import { ServiceEditDialog } from "./edit-dialog";
import {
  editarServicio,
  eliminarServicio,
  type MutationResult,
} from "./mutations";

const btnBase =
  "rounded-md border p-1.5 transition-colors disabled:cursor-wait disabled:opacity-50";
const btnNeutro =
  "border-black/10 text-text-main/70 hover:bg-bg-light hover:text-text-main";

export function AccionesServicio({ servicio }: { servicio: ServicioFila }) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const detalleRef = useRef<HTMLDialogElement>(null);
  const edicionRef = useRef<HTMLDialogElement>(null);

  const [estadoEdicion, accionEdicion] = useActionState<MutationResult, FormData>(
    editarServicio,
    { success: false },
  );

  useEffect(() => {
    if (estadoEdicion.success) {
      edicionRef.current?.close();
      router.refresh();
    }
  }, [estadoEdicion, router]);

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          title="Ver detalle"
          aria-label={`Ver ${servicio.name}`}
          className={`${btnBase} ${btnNeutro} inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium`}
          onClick={() => detalleRef.current?.showModal()}
        >
          <Eye size={14} /> Ver
        </button>
        <button
          type="button"
          title="Editar"
          aria-label={`Editar ${servicio.name}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-bg-dark px-3 py-2 text-xs font-medium text-text-inverse transition-opacity hover:opacity-90"
          onClick={() => edicionRef.current?.showModal()}
        >
          <Pencil size={14} /> Editar
        </button>
        <button
          type="button"
          title="Eliminar"
          aria-label={`Eliminar ${servicio.name}`}
          disabled={pendiente}
          className={`${btnBase} ${btnNeutro} hover:!bg-red-50 hover:!text-red-700`}
          onClick={() => {
            if (
              window.confirm(
                `¿Eliminar definitivamente «${servicio.name}»?`,
              )
            ) {
              setError(null);
              startTransition(async () => {
                const r = await eliminarServicio(servicio.id);
                if (r.success) router.refresh();
                else setError(r.message ?? "No se pudo eliminar.");
              });
            }
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}

      <ServiceDetailDialog servicio={servicio} dialogRef={detalleRef} />
      <ServiceEditDialog
        servicio={servicio}
        dialogRef={edicionRef}
        estado={estadoEdicion}
        accion={accionEdicion}
        onCerrar={() => edicionRef.current?.close()}
      />
    </div>
  );
}

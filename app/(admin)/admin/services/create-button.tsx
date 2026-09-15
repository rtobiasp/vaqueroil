"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { ServiceCreateDialog } from "./create-dialog";

export function NuevoServicioButton() {
  const crearRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => crearRef.current?.showModal()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary-hover sm:w-auto"
      >
        <Plus size={16} /> Nuevo servicio
      </button>
      <ServiceCreateDialog
        dialogRef={crearRef}
        onCerrar={() => crearRef.current?.close()}
      />
    </>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { crearCoche, type MutationResult } from "./mutations";
import { CarCreateFields } from "./edit-dialog";

export function CarCreateDialog({
  dialogRef,
  onCerrar,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, accion] = useActionState<MutationResult, FormData>(
    crearCoche,
    { success: false },
  );

  useEffect(() => {
    if (estado.success) {
      formRef.current?.reset();
      dialogRef.current?.close();
      router.refresh();
    }
  }, [estado, dialogRef, router]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-base font-bold">Nuevo coche</h2>
      <form ref={formRef} action={accion} className="mt-3 space-y-3">
        <CarCreateFields />
        {estado.errors?.matricula ? (
          <span className="block text-xs text-red-600">
            {estado.errors.matricula[0]}
          </span>
        ) : null}
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
            Crear
          </button>
        </div>
      </form>
    </dialog>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { crearServicio, type MutationResult } from "./mutations";

export function ServiceCreateDialog({
  dialogRef,
  onCerrar,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, accion] = useActionState<MutationResult, FormData>(
    crearServicio,
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
      <h2 className="text-base font-bold">Nuevo servicio</h2>
      <form ref={formRef} action={accion} className="mt-3 space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Nombre</span>
          <input
            type="text"
            name="nombre"
            required
            minLength={3}
            maxLength={120}
            placeholder="Cambio de aceite"
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
            placeholder="59,95"
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
            placeholder="Qué incluye el servicio…"
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
            Crear
          </button>
        </div>
      </form>
    </dialog>
  );
}

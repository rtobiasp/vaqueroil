"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { Plus } from "lucide-react";
import { crearUsuario, type MutationResult } from "./mutations";
import { UsuarioFormDialog } from "./edit-dialog";

export function NuevoClienteButton() {
  const crearRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => crearRef.current?.showModal()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary-hover sm:w-auto"
      >
        <Plus size={16} /> Nuevo cliente
      </button>
      <CrearClienteDialog
        dialogRef={crearRef}
        onCerrar={() => crearRef.current?.close()}
      />
    </>
  );
}

function CrearClienteDialog({
  dialogRef,
  onCerrar,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, accion] = useActionState<MutationResult, FormData>(
    crearUsuario,
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
    <UsuarioFormDialog
      dialogRef={dialogRef}
      formRef={formRef}
      estado={estado}
      accion={accion}
      onCerrar={onCerrar}
      titulo="Nuevo cliente"
      textoBoton="Crear"
    />
  );
}

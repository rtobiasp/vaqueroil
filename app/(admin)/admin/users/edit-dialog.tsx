import type { RefObject } from "react";
import type { UsuarioFila } from "./actions";
import type { MutationResult } from "./mutations";

type Props = {
  usuario?: Pick<UsuarioFila, "id" | "fullName" | "email" | "phone">;
  dialogRef: RefObject<HTMLDialogElement | null>;
  formRef?: RefObject<HTMLFormElement | null>;
  estado: MutationResult;
  accion: (formData: FormData) => void;
  onCerrar: () => void;
  titulo: string;
  textoBoton: string;
};

export function UsuarioFormDialog({
  usuario,
  dialogRef,
  formRef,
  estado,
  accion,
  onCerrar,
  titulo,
  textoBoton,
}: Props) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-base font-bold">{titulo}</h2>
      <form ref={formRef} action={accion} className="mt-3 space-y-3">
        {usuario ? <input type="hidden" name="id" value={usuario.id} /> : null}
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Nombre</span>
          <input
            type="text"
            name="nombre"
            required
            minLength={3}
            maxLength={120}
            defaultValue={usuario?.fullName ?? ""}
            placeholder="Nombre y apellidos"
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
          {estado.errors?.nombre ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.nombre[0]}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Email</span>
          <input
            type="email"
            name="email"
            required
            maxLength={160}
            defaultValue={usuario?.email ?? ""}
            placeholder="cliente@ejemplo.com"
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
          {estado.errors?.email ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.email[0]}
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Teléfono</span>
          <input
            type="tel"
            name="telefono"
            maxLength={32}
            defaultValue={usuario?.phone ?? ""}
            placeholder="612 345 678"
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
          {estado.errors?.telefono ? (
            <span className="mt-1 block text-xs text-red-600">
              {estado.errors.telefono[0]}
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
            {textoBoton}
          </button>
        </div>
      </form>
    </dialog>
  );
}

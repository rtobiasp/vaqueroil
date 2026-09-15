import type { RefObject } from "react";
import type { CocheFila } from "./actions";
import type { MutationResult } from "./mutations";

type Props = {
  coche: CocheFila;
  dialogRef: RefObject<HTMLDialogElement | null>;
  estado: MutationResult;
  accion: (formData: FormData) => void;
  onCerrar: () => void;
  titulo?: string;
};

function Campos({ coche }: { coche?: CocheFila }) {
  const anoActual = new Date().getFullYear();
  return (
    <>
      <label className="block">
        <span className="mb-1 block text-xs text-text-main/60">Matrícula</span>
        <input
          type="text"
          name="matricula"
          required
          defaultValue={coche?.licensePlate ?? ""}
          placeholder="1234 ABC"
          className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 font-mono uppercase focus:border-accent-primary focus:outline-none"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Marca</span>
          <input
            type="text"
            name="marca"
            required
            defaultValue={coche?.brand ?? ""}
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Modelo</span>
          <input
            type="text"
            name="modelo"
            required
            defaultValue={coche?.model ?? ""}
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">Año</span>
          <input
            type="number"
            name="ano"
            required
            min={1950}
            max={anoActual + 1}
            defaultValue={coche?.year ?? anoActual}
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 focus:border-accent-primary focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-text-main/60">VIN</span>
          <input
            type="text"
            name="vin"
            defaultValue={coche?.vin ?? ""}
            placeholder="Opcional"
            className="w-full rounded-md border border-black/10 bg-bg-light px-3 py-2 font-mono uppercase focus:border-accent-primary focus:outline-none"
          />
        </label>
      </div>
    </>
  );
}

export function CarEditDialog({
  coche,
  dialogRef,
  estado,
  accion,
  onCerrar,
}: Props) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5 text-sm text-text-main shadow-xl backdrop:bg-black/40"
    >
      <h2 className="text-base font-bold">
        Editar {coche.brand} {coche.model}
      </h2>
      <form action={accion} className="mt-3 space-y-3">
        <input type="hidden" name="id" value={coche.id} />
        <Campos coche={coche} />
        {estado.errors?.matricula ? (
          <span className="block text-xs text-red-600">
            {estado.errors.matricula[0]}
          </span>
        ) : null}
        {estado.errors?.marca ? (
          <span className="block text-xs text-red-600">
            {estado.errors.marca[0]}
          </span>
        ) : null}
        {estado.errors?.modelo ? (
          <span className="block text-xs text-red-600">
            {estado.errors.modelo[0]}
          </span>
        ) : null}
        {estado.errors?.ano ? (
          <span className="block text-xs text-red-600">
            {estado.errors.ano[0]}
          </span>
        ) : null}
        {estado.errors?.vin ? (
          <span className="block text-xs text-red-600">
            {estado.errors.vin[0]}
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
            className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-primary-hover"
          >
            Guardar
          </button>
        </div>
      </form>
    </dialog>
  );
}

export function CarCreateFields() {
  return <Campos />;
}

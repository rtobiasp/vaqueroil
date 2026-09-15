"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { UsuarioFila } from "./actions";
import { iniciales } from "./status";
import { UserDetailDialog } from "./detail-dialog";
import { UsuarioFormDialog } from "./edit-dialog";
import {
  editarUsuario,
  eliminarUsuario,
  type MutationResult,
} from "./mutations";

type Props = {
  usuarios: UsuarioFila[];
  totalMostrados: number;
  conFiltroAtras: boolean;
  hrefPrimera: string;
  hrefSiguiente: string | null;
  haySiguiente: boolean;
};

function formatoUltima(d: Date | null): string {
  if (!d) return "Sin visitas";
  const hoy = new Date().toLocaleDateString("es-ES");
  const ayer = new Date(Date.now() - 86400000).toLocaleDateString("es-ES");
  const fecha = d.toLocaleDateString("es-ES");
  if (fecha === hoy) return "Hoy";
  if (fecha === ayer) return "Ayer";
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function UsersTable({
  usuarios,
  totalMostrados,
  conFiltroAtras,
  hrefPrimera,
  hrefSiguiente,
  haySiguiente,
}: Props) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-black/5 bg-white text-text-main shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs text-text-main/60 uppercase">
              <th className="px-4 py-3 font-medium sm:px-5">Cliente</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Coches</th>
              <th className="px-4 py-3 font-medium">Citas</th>
              <th className="px-4 py-3 font-medium">Última visita</th>
              <th className="px-4 py-3 text-right font-medium sm:pr-5">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-text-main/60 sm:px-5"
                >
                  Sin resultados para los filtros aplicados.
                </td>
              </tr>
            ) : null}
            {usuarios.map((usuario) => (
              <FilaUsuario key={usuario.id} usuario={usuario} />
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-black/5 px-4 py-3 text-xs text-text-main/60 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>Mostrando {totalMostrados} clientes</p>
        <div className="flex items-center gap-2">
          {conFiltroAtras ? (
            <Link
              href={hrefPrimera}
              className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
            >
              <ChevronLeft size={14} /> Primera
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium opacity-50">
              <ChevronLeft size={14} /> Primera
            </span>
          )}
          {haySiguiente && hrefSiguiente ? (
            <Link
              href={hrefSiguiente}
              className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium text-text-main transition-colors hover:bg-bg-light"
            >
              Siguiente <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 font-medium opacity-50">
              Siguiente <ChevronRight size={14} />
            </span>
          )}
        </div>
      </footer>
    </section>
  );
}

const btnBase =
  "rounded-md border p-1.5 transition-colors disabled:cursor-wait disabled:opacity-50";
const btnNeutro =
  "border-black/10 text-text-main/70 hover:bg-bg-light hover:text-text-main";

function FilaUsuario({ usuario }: { usuario: UsuarioFila }) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const detalleRef = useRef<HTMLDialogElement>(null);
  const edicionRef = useRef<HTMLDialogElement>(null);

  const [estadoEdicion, accionEdicion] = useActionState<MutationResult, FormData>(
    editarUsuario,
    { success: false },
  );

  useEffect(() => {
    if (estadoEdicion.success) {
      edicionRef.current?.close();
      router.refresh();
    }
  }, [estadoEdicion, router]);

  return (
    <tr className="align-top hover:bg-bg-light/60">
      <td className="px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-dark text-xs font-bold text-text-inverse">
            {iniciales(usuario.fullName)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{usuario.fullName}</p>
            <p className="truncate text-xs text-text-main/60">
              {usuario.matriculaPrincipal ?? "Sin coches"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="truncate">{usuario.email}</p>
        <p className="text-xs text-text-main/60">{usuario.phone ?? "—"}</p>
      </td>
      <td className="px-4 py-3">
        <span className="inline-block rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium whitespace-nowrap">
          {usuario.coches} {usuario.coches === 1 ? "coche" : "coches"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="inline-block rounded-full border border-black/10 bg-bg-light px-3 py-1 text-xs font-medium whitespace-nowrap">
          {usuario.citas} {usuario.citas === 1 ? "cita" : "citas"}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {formatoUltima(usuario.ultimaVisita)}
      </td>
      <td className="px-4 py-3 sm:pr-5">
        <div className="flex justify-end gap-1.5">
          <button
            type="button"
            title="Ver ficha"
            aria-label={`Ver ficha de ${usuario.fullName}`}
            className={`${btnBase} ${btnNeutro}`}
            onClick={() => detalleRef.current?.showModal()}
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            title="Editar"
            aria-label={`Editar a ${usuario.fullName}`}
            className={`${btnBase} ${btnNeutro}`}
            onClick={() => edicionRef.current?.showModal()}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            title="Eliminar"
            aria-label={`Eliminar a ${usuario.fullName}`}
            disabled={pendiente}
            className={`${btnBase} ${btnNeutro} hover:!bg-red-50 hover:!text-red-700`}
            onClick={() => {
              if (
                window.confirm(
                  `¿Eliminar definitivamente a ${usuario.fullName}?`,
                )
              ) {
                setError(null);
                startTransition(async () => {
                  const r = await eliminarUsuario(usuario.id);
                  if (r.success) router.refresh();
                  else setError(r.message ?? "No se pudo eliminar.");
                });
              }
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-1 text-right text-xs text-red-600">
            {error}
          </p>
        ) : null}

        <UserDetailDialog usuario={usuario} dialogRef={detalleRef} />
        <UsuarioFormDialog
          usuario={usuario}
          dialogRef={edicionRef}
          estado={estadoEdicion}
          accion={accionEdicion}
          onCerrar={() => edicionRef.current?.close()}
          titulo={`Editar a ${usuario.fullName}`}
          textoBoton="Guardar"
        />
      </td>
    </tr>
  );
}

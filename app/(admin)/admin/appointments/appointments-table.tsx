import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CitaFila } from "./actions";
import { AccionesCita } from "./row-actions";
import { ESTILO_ESTADO, ETIQUETA_ESTADO } from "./status";

type Props = {
  citas: CitaFila[];
  totalMostradas: number;
  conFiltroAtras: boolean;
  hrefPrimera: string;
  hrefSiguiente: string | null;
  haySiguiente: boolean;
};

function formatoFecha(d: Date): string {
  return d.toLocaleDateString("es-ES");
}

function formatoHora(d: Date): string {
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function AppointmentsTable({
  citas,
  totalMostradas,
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
              <th className="px-4 py-3 font-medium">Coche</th>
              <th className="px-4 py-3 font-medium">Servicio</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium sm:pr-5">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {citas.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-text-main/60 sm:px-5"
                >
                  Sin resultados para los filtros aplicados.
                </td>
              </tr>
            ) : null}
            {citas.map((cita) => (
              <tr key={cita.id} className="align-top hover:bg-bg-light/60">
                <td className="px-4 py-3 sm:px-5">
                  <p className="font-semibold">{cita.userName}</p>
                  <p className="text-xs text-text-main/60">
                    {cita.userPhone ?? cita.userEmail}
                  </p>
                  {cita.notes ? (
                    <p className="mt-1 max-w-55 truncate text-xs text-text-main/60 italic">
                      {cita.notes}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-md border border-black/10 bg-bg-light px-2 py-0.5 font-mono text-xs font-bold">
                    {cita.vehiclePlate}
                  </span>
                  <p className="mt-1 text-xs text-text-main/60">
                    {cita.vehicleBrand} {cita.vehicleModel}
                  </p>
                </td>
                <td className="px-4 py-3">{cita.serviceName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="font-medium">{formatoFecha(cita.fechaInicio)}</p>
                  <p className="text-xs text-text-main/60">
                    {formatoHora(cita.fechaInicio)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${ESTILO_ESTADO[cita.status]}`}
                  >
                    {ETIQUETA_ESTADO[cita.status]}
                  </span>
                </td>
                <td className="px-4 py-3 sm:pr-5">
                  <AccionesCita cita={cita} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-black/5 px-4 py-3 text-xs text-text-main/60 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>Mostrando {totalMostradas} citas</p>
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

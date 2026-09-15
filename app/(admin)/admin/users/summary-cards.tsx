import { CalendarDays, Car, ClipboardList, Users } from "lucide-react";
import type { ResumenUsuarios } from "./actions";

export function SummaryCards({ resumen }: { resumen: ResumenUsuarios }) {
  const tarjetas = [
    { titulo: "Total clientes", valor: String(resumen.total), icono: Users },
    {
      titulo: "Coches registrados",
      valor: String(resumen.coches),
      icono: Car,
    },
    {
      titulo: "Con cita próxima",
      valor: String(resumen.conCitaProxima),
      icono: CalendarDays,
    },
    {
      titulo: "Citas totales",
      valor: String(resumen.citasTotales),
      icono: ClipboardList,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {tarjetas.map((item) => (
        <div
          key={item.titulo}
          className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-medium text-text-main/60">
              {item.titulo}
            </p>
            <item.icono size={20} className="shrink-0 text-accent-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold sm:text-3xl">{item.valor}</p>
        </div>
      ))}
    </div>
  );
}

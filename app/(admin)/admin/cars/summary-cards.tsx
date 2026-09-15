import { CalendarDays, Car, Search, Wrench } from "lucide-react";
import type { ResumenCoches } from "./actions";

export function SummaryCards({ resumen }: { resumen: ResumenCoches }) {
  const tarjetas = [
    { titulo: "Total coches", valor: String(resumen.total), icono: Car },
    { titulo: "En taller", valor: String(resumen.enTaller), icono: Wrench },
    {
      titulo: "Con cita próxima",
      valor: String(resumen.conCita),
      icono: CalendarDays,
    },
    {
      titulo: "Sin actividad",
      valor: String(resumen.sinActividad),
      icono: Search,
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

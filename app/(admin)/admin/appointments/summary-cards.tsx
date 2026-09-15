import { Bell, CalendarDays, Car, Clock } from "lucide-react";
import type { ResumenCitas } from "./actions";

export function SummaryCards({ resumen }: { resumen: ResumenCitas }) {
  const tarjetas = [
    { titulo: "Citas hoy", valor: String(resumen.hoy), icono: CalendarDays },
    { titulo: "Pendientes", valor: String(resumen.pendientes), icono: Bell },
    { titulo: "En taller", valor: String(resumen.enTaller), icono: Car },
    {
      titulo: "Huecos libres",
      valor: String(resumen.huecosLibres),
      icono: Clock,
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

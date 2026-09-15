import { CalendarDays, Euro, TrendingUp, Wrench } from "lucide-react";
import { formatoPrecio } from "./status";
import type { ResumenServicios } from "./actions";

export function SummaryCards({ resumen }: { resumen: ResumenServicios }) {
  const tarjetas = [
    { titulo: "Servicios totales", valor: String(resumen.total), icono: Wrench },
    {
      titulo: "Precio medio",
      valor: formatoPrecio(resumen.precioMedio),
      icono: Euro,
    },
    { titulo: "Más pedido", valor: resumen.masPedido, icono: TrendingUp },
    {
      titulo: "Citas este mes",
      valor: String(resumen.citasEsteMes),
      icono: CalendarDays,
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
          <p className="mt-2 truncate text-2xl font-bold sm:text-3xl">
            {item.valor}
          </p>
        </div>
      ))}
    </div>
  );
}

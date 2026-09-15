export type FiltroServicio = "ALL" | "CON_CITAS" | "SIN_CITAS";

export const FILTROS: { valor: FiltroServicio; etiqueta: string }[] = [
  { valor: "ALL", etiqueta: "Todos" },
  { valor: "CON_CITAS", etiqueta: "Con citas" },
  { valor: "SIN_CITAS", etiqueta: "Sin citas" },
];

export function formatoPrecio(valor: string | number): string {
  const n = Number(valor);
  if (Number.isNaN(n)) return "—";
  return `${n.toFixed(2).replace(".", ",")} €`;
}

export type OrdenUsuario = "RECIENTES" | "MAS_CITAS" | "AZ";

export const ORDENES: { valor: OrdenUsuario; etiqueta: string }[] = [
  { valor: "RECIENTES", etiqueta: "Recientes" },
  { valor: "MAS_CITAS", etiqueta: "Más citas" },
  { valor: "AZ", etiqueta: "A–Z" },
];

export function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .map((parte) => parte[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

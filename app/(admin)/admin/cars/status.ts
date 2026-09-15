export type EstadoCoche = "EN_TALLER" | "CON_CITA" | "DISPONIBLE";

export const ESTADOS: { valor: EstadoCoche | "ALL"; etiqueta: string }[] = [
  { valor: "ALL", etiqueta: "Todos" },
  { valor: "EN_TALLER", etiqueta: "En taller" },
  { valor: "CON_CITA", etiqueta: "Con cita" },
  { valor: "DISPONIBLE", etiqueta: "Disponibles" },
];

export const ESTILO_ESTADO: Record<EstadoCoche, string> = {
  EN_TALLER: "border-violet-200 bg-violet-50 text-violet-800",
  CON_CITA: "border-sky-200 bg-sky-50 text-sky-800",
  DISPONIBLE: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export const ETIQUETA_ESTADO: Record<EstadoCoche, string> = {
  EN_TALLER: "En taller",
  CON_CITA: "Con cita",
  DISPONIBLE: "Disponible",
};

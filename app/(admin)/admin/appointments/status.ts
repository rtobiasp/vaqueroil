export type EstadoCita =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export const ESTADOS: { valor: EstadoCita | "ALL"; etiqueta: string }[] = [
  { valor: "ALL", etiqueta: "Todas" },
  { valor: "PENDING", etiqueta: "Pendientes" },
  { valor: "CONFIRMED", etiqueta: "Confirmadas" },
  { valor: "IN_PROGRESS", etiqueta: "En taller" },
  { valor: "COMPLETED", etiqueta: "Completadas" },
  { valor: "CANCELLED", etiqueta: "Canceladas" },
];

export const ESTILO_ESTADO: Record<EstadoCita, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  CONFIRMED: "border-sky-200 bg-sky-50 text-sky-800",
  IN_PROGRESS: "border-violet-200 bg-violet-50 text-violet-800",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-black/10 bg-bg-light text-text-main/60",
};

export const ETIQUETA_ESTADO: Record<EstadoCita, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En taller",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

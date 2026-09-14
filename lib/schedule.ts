import { z } from "zod";

// ---------------------------------------------------------------------------
// Fuente única de verdad para el calendario del taller (Logroño).
// Sin dependencias de Next ni de BBDD: se puede importar desde Server Actions
// y desde scripts de test en Node.
// ---------------------------------------------------------------------------

/** Zona horaria del taller. Todo el calendario se razona en hora de Logroño. */
export const SHOP_TIME_ZONE = "Europe/Madrid";

/** Duración de cada cita en minutos. */
export const SLOT_DURATION_MINUTES = 45;

/** Antelación máxima (la misma que permite el calendario de la UI). */
export const MAX_ADVANCE_MONTHS = 3;

/** Turnos del taller: mañana 9:00–13:30 y tarde 16:00–19:30, de lunes a viernes. */
export const WORK_SHIFTS = [
  { start: "09:00", end: "13:30" },
  { start: "16:00", end: "19:30" },
] as const;

export type Slot = {
  /** ISO UTC del inicio (para guardar en BBDD). */
  value: string;
  /** ISO UTC del fin. */
  endValue: string;
  /** "09:00" en hora de Logroño (lo que ve el cliente). */
  label: string;
};

export type BusyInterval = {
  fechaInicio: Date;
  fechaFin: Date;
};

// ---------------------------------------------------------------------------
// Hora de Madrid sin dependencias (reglas UE: último domingo de marzo y de
// octubre, cambio a las 01:00 UTC). Determinista y testeable.
// ---------------------------------------------------------------------------

function lastSundayDay(year: number, monthIndex: number): number {
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const weekDay = new Date(Date.UTC(year, monthIndex, daysInMonth)).getUTCDay();
  return daysInMonth - weekDay;
}

/** Offset de Europe/Madrid en minutos para un instante dado (60 en invierno, 120 en verano). */
export function madridOffsetMinutes(instant: Date | number): number {
  const t = instant instanceof Date ? instant.getTime() : instant;
  const year = new Date(t).getUTCFullYear();
  const cestStart = Date.UTC(year, 2, lastSundayDay(year, 2), 1, 0, 0, 0);
  const cestEnd = Date.UTC(year, 9, lastSundayDay(year, 9), 1, 0, 0, 0);
  return t >= cestStart && t < cestEnd ? 120 : 60;
}

export type MadridParts = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  /** 1 = lunes … 7 = domingo. */
  weekday: number;
};

/** Descompone un instante UTC en sus partes de hora local de Logroño. */
export function madridParts(instant: Date | number): MadridParts {
  const t = instant instanceof Date ? instant.getTime() : instant;
  const shifted = new Date(t + madridOffsetMinutes(t) * 60_000);
  const weekDay = shifted.getUTCDay();
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
    weekday: weekDay === 0 ? 7 : weekDay,
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "2026-09-21": clave de día en hora de Logroño para un instante. */
export function madridDateKey(instant: Date | number): string {
  const p = madridParts(instant);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

/** Valida "YYYY-MM-DD" y que sea un día de calendario real. */
export function parseDateKey(
  value: string,
): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > daysInMonth) return null;
  return { year, month, day };
}

/** Instante UTC correspondiente a una hora local ("09:00") de un día de taller. */
export function slotInstant(dateKey: string, hhmm: string): Date | null {
  const parsed = parseDateKey(dateKey);
  const match = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!parsed || !match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  // El offset depende del instante; la aproximación con mediodía es exacta
  // porque ningún cambio de hora UE cae dentro del horario de taller.
  const noonUtc = Date.UTC(parsed.year, parsed.month - 1, parsed.day, 12, 0, 0, 0);
  const probe = new Date(noonUtc - madridOffsetMinutes(noonUtc) * 60_000);
  const offset = madridOffsetMinutes(probe.getTime());
  return new Date(
    Date.UTC(parsed.year, parsed.month - 1, parsed.day, hours, minutes) -
      offset * 60_000,
  );
}

/** Rango UTC que cubre un día de taller (00:00–23:59:59.999 en hora local). */
export function madridDayRangeUtc(dateKey: string): { start: Date; end: Date } | null {
  const start = slotInstant(dateKey, "00:00");
  if (!start) return null;
  return { start, end: new Date(start.getTime() + 86_400_000 - 1) };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toLabel(totalMinutes: number): string {
  return `${pad2(Math.floor(totalMinutes / 60))}:${pad2(totalMinutes % 60)}`;
}

/** Horas de inicio válidas ("09:00", "09:45", …) derivadas de los turnos. */
export function slotStartTimes(): string[] {
  const starts: string[] = [];
  for (const shift of WORK_SHIFTS) {
    const start = toMinutes(shift.start);
    const end = toMinutes(shift.end);
    for (
      let t = start;
      t + SLOT_DURATION_MINUTES <= end;
      t += SLOT_DURATION_MINUTES
    ) {
      starts.push(toLabel(t));
    }
  }
  return starts;
}

function addMonthsClamped(
  year: number,
  month: number,
  day: number,
  add: number,
): { year: number; month: number; day: number } {
  const total = year * 12 + (month - 1) + add;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { year: y, month: m, day: Math.min(day, daysInMonth) };
}

/** Último día reservable ("hoy + 3 meses" en hora de Logroño). */
export function maxBookableDateKey(now: Date = new Date()): string {
  const p = madridParts(now);
  const max = addMonthsClamped(p.year, p.month, p.day, MAX_ADVANCE_MONTHS);
  return `${max.year}-${pad2(max.month)}-${pad2(max.day)}`;
}

// ---------------------------------------------------------------------------
// Generación de huecos y validación de calendario (hora de Logroño).
// ---------------------------------------------------------------------------

/**
 * Huecos libres de un día ("YYYY-MM-DD" en hora de Logroño).
 * - Fin de semana → sin huecos (taller cerrado).
 * - Solo turnos de mañana/tarde en rejilla de 45 min.
 * - Filtra huecos ya empezados (si es hoy).
 * - `busy` son intervalos ocupados (las canceladas deben excluirse antes).
 */
export function generateSlots(
  dateKey: string,
  now: Date = new Date(),
  busy: BusyInterval[] = [],
): Slot[] {
  if (!parseDateKey(dateKey)) return [];
  if (dateKey > maxBookableDateKey(now)) return [];
  const noon = slotInstant(dateKey, "12:00");
  if (!noon) return [];
  if (madridParts(noon).weekday > 5) return [];

  const slots: Slot[] = [];
  for (const label of slotStartTimes()) {
    const start = slotInstant(dateKey, label);
    if (!start || start.getTime() <= now.getTime()) continue;
    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60_000);
    const occupied = busy.some(
      (b) => b.fechaInicio < end && b.fechaFin > start,
    );
    if (occupied) continue;
    slots.push({
      value: start.toISOString(),
      endValue: end.toISOString(),
      label,
    });
  }
  return slots;
}

export type SlotError = {
  field: "appointment_start" | "appointment_end";
  message: string;
};

/** Reglas de negocio del calendario. null = hueco válido. */
export function validateSlot(
  start: Date,
  end: Date,
  now: Date = new Date(),
): SlotError | null {
  if (!(start instanceof Date) || Number.isNaN(start.getTime())) {
    return {
      field: "appointment_start",
      message: "La fecha elegida no es válida.",
    };
  }
  if (!(end instanceof Date) || Number.isNaN(end.getTime())) {
    return { field: "appointment_end", message: "La hora de fin no es válida." };
  }
  if (end.getTime() - start.getTime() !== SLOT_DURATION_MINUTES * 60_000) {
    return {
      field: "appointment_end",
      message: "La cita debe durar 45 minutos.",
    };
  }
  if (madridDateKey(start) !== madridDateKey(end)) {
    return {
      field: "appointment_end",
      message: "La cita debe empezar y terminar el mismo día.",
    };
  }
  if (start.getTime() <= now.getTime()) {
    return {
      field: "appointment_start",
      message: "Ese horario ya ha pasado. Elige otro hueco disponible.",
    };
  }
  const parts = madridParts(start);
  if (parts.weekday > 5) {
    return {
      field: "appointment_start",
      message: "El taller abre de lunes a viernes. Elige un día laborable.",
    };
  }
  if (madridDateKey(start) > maxBookableDateKey(now)) {
    return {
      field: "appointment_start",
      message: "Solo puedes reservar con 3 meses de antelación.",
    };
  }
  const label = `${pad2(parts.hours)}:${pad2(parts.minutes)}`;
  if (!slotStartTimes().includes(label)) {
    return {
      field: "appointment_start",
      message:
        "Ese horario está fuera del horario del taller (9:00–13:30 y 16:00–19:30).",
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Normalización y validación de campos.
// ---------------------------------------------------------------------------

/** "600 123 456" → "+34600123456". Devuelve el compactado si no es español. */
export function normalizePhone(raw: string): string {
  const compact = raw.trim().replace(/[\s.\-()/]/g, "");
  if (/^[6789]\d{8}$/.test(compact)) return `+34${compact}`;
  if (/^0034[6789]\d{8}$/.test(compact)) return `+34${compact.slice(4)}`;
  if (/^\+34[6789]\d{8}$/.test(compact)) return compact;
  return compact;
}

const ES_PHONE_RE = /^\+34[6789]\d{8}$/;

/** "1234 abc" → "1234ABC". */
export function normalizePlate(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s.\-]+/g, "");
}

// Moderna "1234BCD" (4 dígitos + 3 consonantes, sin vocales/Ñ/Q),
// histórica provincial ("LO1234AB") o extranjera UE (5–12 alfanuméricos).
const MODERN_PLATE_RE = /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/;
const OLD_PLATE_RE = /^[A-Z]{1,2}\d{4}[A-Z]{1,2}$/;
const FOREIGN_PLATE_RE = /^[A-Z0-9]{5,12}$/;
// "1234ABC": tiene forma de matrícula española pero con vocales (imposible
// en España) → probable errata, se rechaza aunque cumpla el tamaño genérico.
const SPANISH_SHAPE_RE = /^\d{4}[A-Z]{3}$/;

export function isValidPlate(raw: string): boolean {
  const value = normalizePlate(raw);
  if (MODERN_PLATE_RE.test(value)) return true;
  if (SPANISH_SHAPE_RE.test(value)) return false;
  return OLD_PLATE_RE.test(value) || FOREIGN_PLATE_RE.test(value);
}

// VIN: 17 caracteres, letras sin I/O/Q y dígitos.
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeVin(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const value = raw.trim().toUpperCase();
  return value === "" ? undefined : value;
}

const NO_ANGLE_BRACKETS_RE = /^[^<>]*$/;

export const appointmentSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre completo.")
    .max(100, "El nombre es demasiado largo.")
    .refine((v) => (v.match(/\p{L}/gu) ?? []).length >= 2, {
      message: "Escribe tu nombre y apellidos.",
    })
    .refine((v) => NO_ANGLE_BRACKETS_RE.test(v), {
      message: "El nombre contiene caracteres no válidos.",
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Debes introducir un email.")
    .max(254, "El email es demasiado largo.")
    .pipe(z.email("Email con formato no válido.")),
  phone: z
    .string()
    .trim()
    .min(1, "El teléfono es obligatorio.")
    .max(30, "El teléfono es demasiado largo.")
    .refine((v) => ES_PHONE_RE.test(normalizePhone(v)), {
      message:
        "El teléfono no es válido. Usa un número español de 9 dígitos (ej. 600 123 456).",
    }),
  service: z.uuid("El servicio no es válido."),
  license_plate: z
    .string()
    .trim()
    .min(1, "La matrícula es obligatoria.")
    .max(20, "La matrícula es demasiado larga.")
    .refine((v) => isValidPlate(v), {
      message: "La matrícula no es válida (ej. 1234 BCD).",
    }),
  brand: z
    .string()
    .trim()
    .min(1, "La marca es obligatoria.")
    .max(50, "La marca es demasiado larga.")
    .refine((v) => NO_ANGLE_BRACKETS_RE.test(v), {
      message: "La marca contiene caracteres no válidos.",
    }),
  model: z
    .string()
    .trim()
    .min(1, "El modelo es obligatorio.")
    .max(50, "El modelo es demasiado largo.")
    .refine((v) => NO_ANGLE_BRACKETS_RE.test(v), {
      message: "El modelo contiene caracteres no válidos.",
    }),
  year: z.coerce
    .number()
    .int()
    .min(1900, "El año no es válido.")
    .max(new Date().getFullYear() + 1, "El año no es válido."),
  vin: z
    .string()
    .trim()
    .max(17, "El VIN no es válido.")
    .optional()
    .refine((v) => v === undefined || v === "" || VIN_RE.test(v.toUpperCase()), {
      message: "El VIN debe tener 17 caracteres (letras sin I, O, Q, y números).",
    }),
  appointment_start: z.coerce.date("La hora de la cita es obligatoria."),
  notes: z
    .string()
    .trim()
    .max(1000, "Las notas son demasiado largas.")
    .optional(),
  appointment_end: z.coerce.date("La hora de fin es obligatoria."),
});

export type AppointmentFormValues = z.output<typeof appointmentSchema>;

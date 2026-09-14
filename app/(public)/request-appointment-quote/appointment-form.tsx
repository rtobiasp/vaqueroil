"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import {
  processAppointmentForm,
  getAvailableSlotsForDate,
  type AppointmentActionState,
} from "./actions";
import { DatePickerField } from "./date-picker-field";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  name: string | null;
};

const initialState: AppointmentActionState = {
  success: false,
};

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-bg-dark/60 px-4 py-3 text-sm text-text-inverse placeholder:text-text-inverse/35 shadow-none transition-colors outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 sm:text-base";
const labelClasses =
  "text-sm font-medium text-text-inverse/90 [&>span]:text-accent-primary";
const hintClasses = "text-xs leading-relaxed text-text-inverse/50";
const cardClasses =
  "w-full rounded-2xl border border-white/5 bg-surface-mid p-5 text-text-inverse sm:p-7";
const stepBadgeClasses =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-primary text-sm font-bold text-text-inverse";

function FieldError({
  errors,
  field,
}: {
  errors?: Record<string, string[]>;
  field: string;
}) {
  const messages = errors?.[field];

  if (!messages?.length) {
    return null;
  }

  return (
    <p role="alert" className="flex items-start gap-1.5 text-sm text-red-400">
      <AlertCircle size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
      {messages[0]}
    </p>
  );
}

function StepHeader({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className={stepBadgeClasses} aria-hidden="true">
        {number}
      </span>
      <h3 className="text-lg font-medium sm:text-xl">{title}</h3>
    </div>
  );
}

export function AppointmentForm({ services }: { services: Service[] }) {
  const [state, formAction, pending] = useActionState(
    processAppointmentForm,
    initialState,
  );

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<
    Awaited<ReturnType<typeof getAvailableSlotsForDate>>
  >([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedSlotEnd, setSelectedSlotEnd] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDateChange(date: Date | undefined) {
    setSelectedDate(date);
    setSelectedSlot("");
    setSelectedSlotEnd("");
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    startTransition(async () => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const slots = await getAvailableSlotsForDate(formattedDate);
      setAvailableSlots(slots);
    });
  }

  const selectedSlotLabel = availableSlots.find(
    (slot) => slot.value === selectedSlot,
  )?.label;

  if (state.success) {
    return (
      <div className={cn(cardClasses, "flex flex-col items-center gap-4 text-center")}>
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
          <CheckCircle2 size={36} aria-hidden="true" className="text-green-400" />
        </span>
        <h2 className="text-2xl font-medium sm:text-3xl">
          ¡Solicitud enviada!
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-text-inverse/70 sm:text-base">
          {state.message ??
            "Hemos recibido tu petición. Te llamaremos para confirmarte el día y la hora."}
        </p>
        <div className="flex flex-col gap-2 rounded-xl bg-bg-dark/50 px-5 py-4 text-sm text-text-inverse/80 sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock size={16} aria-hidden="true" className="text-accent-primary" />
            {selectedDate
              ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
              : "Fecha elegida"}
          </span>
          {selectedSlotLabel ? (
            <>
              <span aria-hidden="true" className="hidden text-text-inverse/30 sm:inline">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-text-inverse">
                <Clock size={16} aria-hidden="true" className="text-accent-primary" />
                {selectedSlotLabel}
              </span>
            </>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-medium uppercase transition hover:border-accent-primary hover:text-accent-primary"
          >
            Volver al inicio
          </Link>
          <a
            href="tel:+34941047695"
            className="flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-3 text-sm font-medium uppercase transition hover:bg-accent-primary-hover"
          >
            Llamar al taller
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-4 sm:gap-5">
      {/* 01 — Tus datos */}
      <section className={cardClasses} aria-labelledby="step-datos">
        <StepHeader number="1" title="Tus datos" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="full_name" className={labelClasses}>
              Nombre completo <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              autoComplete="name"
              placeholder="Ej. Rubén García"
              required
              className={inputClasses}
            />
            <FieldError errors={state.errors} field="full_name" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClasses}>
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="tucorreo@email.com"
              required
              className={inputClasses}
            />
            <FieldError errors={state.errors} field="email" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className={labelClasses}>
              Teléfono <span aria-hidden="true">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              autoComplete="tel"
              placeholder="600 123 456"
              required
              className={inputClasses}
            />
            <FieldError errors={state.errors} field="phone" />
          </div>
        </div>
      </section>

      {/* 02 — Tu vehículo */}
      <section className={cardClasses} aria-labelledby="step-vehiculo">
        <StepHeader number="2" title="Tu vehículo" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="license_plate" className={labelClasses}>
              Matrícula <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              name="license_plate"
              id="license_plate"
              autoComplete="off"
              placeholder="1234 ABC"
              required
              className={cn(inputClasses, "uppercase")}
            />
            <FieldError errors={state.errors} field="license_plate" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="vin" className={labelClasses}>
              VIN <span className="font-normal text-text-inverse/40">(opcional)</span>
            </label>
            <input
              type="text"
              name="vin"
              id="vin"
              autoComplete="off"
              placeholder="17 caracteres"
              maxLength={17}
              className={cn(inputClasses, "uppercase")}
            />
            <FieldError errors={state.errors} field="vin" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="brand" className={labelClasses}>
              Marca <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              autoComplete="off"
              placeholder="Ej. Seat, Renault…"
              required
              className={inputClasses}
            />
            <FieldError errors={state.errors} field="brand" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="model" className={labelClasses}>
              Modelo <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              name="model"
              id="model"
              autoComplete="off"
              placeholder="Ej. León, Clio…"
              required
              className={inputClasses}
            />
            <FieldError errors={state.errors} field="model" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2 sm:max-w-1/2">
            <label htmlFor="year" className={labelClasses}>
              Año <span aria-hidden="true">*</span>
            </label>
            <input
              type="number"
              name="year"
              id="year"
              min={1900}
              max={new Date().getFullYear() + 1}
              placeholder="2019"
              required
              className={inputClasses}
            />
            <FieldError errors={state.errors} field="year" />
          </div>
        </div>
      </section>

      {/* 03 — Servicio */}
      <section className={cardClasses} aria-labelledby="step-servicio">
        <StepHeader number="3" title="¿Qué necesita tu coche?" />
        <div className="mt-5 flex flex-col gap-2">
          <label htmlFor="service" className={labelClasses}>
            Servicio <span aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <select
              name="service"
              id="service"
              required
              defaultValue=""
              className={cn(
                inputClasses,
                "appearance-none pr-11 invalid:text-text-inverse/35",
              )}
            >
              <option value="" disabled>
                Selecciona un servicio…
              </option>
              {services.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                  className="bg-surface-mid text-text-inverse"
                >
                  {service.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-inverse/50"
            />
          </div>
          <FieldError errors={state.errors} field="service" />
          <div className="flex flex-col gap-2 pt-1">
            <label htmlFor="notes" className={labelClasses}>
              Notas{" "}
              <span className="font-normal text-text-inverse/40">
                (opcional)
              </span>
            </label>
            <textarea
              name="notes"
              id="notes"
              maxLength={1000}
              rows={3}
              placeholder="Ej. Hace un ruido al frenar, necesito el coche para el lunes…"
              className={cn(inputClasses, "min-h-24 resize-y")}
            />
            <p className={hintClasses}>Máximo 1000 caracteres.</p>
            <FieldError errors={state.errors} field="notes" />
          </div>
        </div>
      </section>

      {/* 04 — Fecha y hora */}
      <section className={cardClasses} aria-labelledby="step-fecha">
        <StepHeader number="4" title="Elige día y hora" />
        <div className="mt-5 flex flex-col gap-4">
          <DatePickerField
            onDateChange={handleDateChange}
            value={selectedDate}
          />

          {isPending && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm text-text-inverse/60"
            >
              <Loader2 size={16} aria-hidden="true" className="animate-spin" />
              Consultando disponibilidad…
            </p>
          )}

          {!isPending && selectedDate && availableSlots.length === 0 && (
            <p className="rounded-xl border border-white/10 bg-bg-dark/50 px-4 py-3 text-sm text-text-inverse/70">
              No quedan huecos libres este día. Prueba con otro día laborable.
            </p>
          )}

          {!isPending && availableSlots.length > 0 && (
            <fieldset>
              <legend className="mb-2.5 text-sm font-medium text-text-inverse/90">
                Horas disponibles{" "}
                <span className="font-normal text-text-inverse/50">
                  —{" "}
                  {format(selectedDate!, "EEEE, d 'de' MMMM", { locale: es })}
                </span>
              </legend>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot.value);
                        setSelectedSlotEnd(slot.endValue);
                      }}
                      aria-pressed={isSelected}
                      className={cn(
                        "rounded-lg border px-2 py-2.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
                        isSelected
                          ? "border-accent-primary bg-accent-primary text-text-inverse shadow-[0_8px_24px_-8px_rgba(232,93,34,0.7)]"
                          : "border-white/10 bg-bg-dark/50 text-text-inverse/85 hover:border-accent-primary/70 hover:bg-accent-primary/10 hover:text-text-inverse",
                      )}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <input type="hidden" name="appointment_start" value={selectedSlot} />
          <input type="hidden" name="appointment_end" value={selectedSlotEnd} />
          <FieldError errors={state.errors} field="appointment_start" />
          <FieldError errors={state.errors} field="appointment_end" />

          {selectedSlot && selectedSlotLabel && selectedDate ? (
            <p className="flex items-center gap-2 rounded-xl bg-accent-primary/10 px-4 py-3 text-sm text-text-inverse">
              <MessageSquareText
                size={16}
                aria-hidden="true"
                className="shrink-0 text-accent-primary"
              />
              Has elegido el{" "}
              <strong className="capitalize">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </strong>{" "}
              a las <strong>{selectedSlotLabel}</strong>.
            </p>
          ) : null}
        </div>
      </section>

      {state.message && !state.success && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-300"
        >
          <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary px-6 py-4 text-sm font-semibold tracking-wide text-text-inverse uppercase transition hover:bg-accent-primary-hover focus-visible:ring-2 focus-visible:ring-accent-primary/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
      >
        {pending ? (
          <>
            <Loader2 size={18} aria-hidden="true" className="animate-spin" />
            Enviando solicitud…
          </>
        ) : (
          <>
            Confirmar reserva
            <ArrowUpRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="text-center text-xs leading-relaxed text-text-inverse/50">
        Al enviar aceptas que te contactemos para gestionar tu cita. Cada reserva
        dura 45 minutos.
      </p>
    </form>
  );
}

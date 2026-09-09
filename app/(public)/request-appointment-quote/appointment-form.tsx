"use client";

import { useActionState } from "react";
import { processAppointmentForm, type AppointmentActionState } from "./actions";

type Service = {
  id: string;
  name: string | null;
};

const initialState: AppointmentActionState = {
  success: false,
};

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
    <p role="alert" className="text-sm text-red-600">
      {messages[0]}
    </p>
  );
}

export function AppointmentForm({ services }: { services: Service[] }) {
  const [state, formAction, pending] = useActionState(
    processAppointmentForm,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="w-full flex flex-col justify-center items-center gap-6"
    >
      <fieldset className="w-full flex flex-col justify-start gap-2">
        <legend>User information</legend>

        <label htmlFor="full_name">Full name</label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          autoComplete="name"
          required
        />
        <FieldError errors={state.errors} field="full_name" />

        <label htmlFor="phone">Phone number</label>
        <input type="tel" name="phone" id="phone" autoComplete="tel" required />
        <FieldError errors={state.errors} field="phone" />
      </fieldset>

      <fieldset className="w-full flex flex-col justify-start gap-2">
        <legend>Service</legend>

        <label htmlFor="service">Service</label>
        <select name="service" id="service" required defaultValue="">
          <option value="" disabled>
            -- Select your service --
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors} field="service" />
      </fieldset>

      <fieldset className="w-full flex flex-col justify-start gap-2">
        <legend>Car information</legend>

        <label htmlFor="license_plate">License plate</label>
        <input type="text" name="license_plate" id="license_plate" required />
        <FieldError errors={state.errors} field="license_plate" />

        <label htmlFor="brand">Brand</label>
        <input type="text" name="brand" id="brand" required />
        <FieldError errors={state.errors} field="brand" />

        <label htmlFor="model">Model</label>
        <input type="text" name="model" id="model" required />
        <FieldError errors={state.errors} field="model" />

        <label htmlFor="year">Year</label>
        <input
          type="number"
          name="year"
          id="year"
          min="1900"
          max={new Date().getFullYear() + 1}
          required
        />
        <FieldError errors={state.errors} field="year" />

        <label htmlFor="vin">VIN</label>
        <input type="text" name="vin" id="vin" maxLength={17} />
        <FieldError errors={state.errors} field="vin" />
      </fieldset>

      <label htmlFor="notes">Notes</label>
      <textarea name="notes" id="notes" maxLength={1000} />
      <FieldError errors={state.errors} field="notes" />

      {state.message && (
        <p
          role="status"
          className={state.success ? "text-green-600" : "text-red-600"}
        >
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}

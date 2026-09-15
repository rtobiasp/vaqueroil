"use client";

import { useState, useActionState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, TriangleAlert } from "lucide-react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

const inputClass =
  "h-11 w-full rounded-lg border border-text-main/15 bg-white pr-3 pl-10 text-sm text-text-main placeholder:text-text-main/40 transition-colors outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 disabled:cursor-not-allowed disabled:opacity-60";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, isPending] = useActionState(
    login.bind(null, redirectTo),
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-medium tracking-wider text-text-main/70 uppercase"
        >
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-main/40"
            aria-hidden="true"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@email.com"
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-medium tracking-wider text-text-main/70 uppercase"
        >
          Contraseña
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-main/40"
            aria-hidden="true"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            disabled={isPending}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={isPending}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1.5 text-text-main/50 transition-colors hover:bg-text-main/5 hover:text-text-main disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {state.error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-700"
        >
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent-primary text-sm font-semibold tracking-wider text-text-inverse uppercase transition-colors duration-200 hover:bg-accent-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Entrando…
          </>
        ) : (
          "Entrar"
        )}
      </button>
    </form>
  );
}

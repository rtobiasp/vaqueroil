"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "./consent-context";

export default function CookieBanner() {
  const { status, accept, reject } = useCookieConsent();

  if (status !== "pending") return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-4 z-[90] mx-auto w-auto max-w-2xl rounded-2xl border border-white/10 bg-surface-mid p-5 text-text-inverse shadow-2xl shadow-black/60 sm:p-6"
    >
      <p className="flex items-center gap-2 text-base font-medium">
        <Cookie size={18} aria-hidden="true" className="text-accent-ink" />
        Usamos cookies
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-inverse/75">
        Utilizamos cookies técnicas necesarias y, solo si aceptas, cargamos el
        mapa de Google en la sección de ubicación. Puedes cambiar tu elección
        cuando quieras desde el enlace «Cookies» del pie de página.{" "}
        <Link href="/legal#cookies" className="text-accent-ink underline">
          Leer política de cookies
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={accept}
          className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-bg-dark uppercase transition hover:bg-accent-primary-hover hover:text-text-inverse"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={reject}
          className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-text-inverse/25 px-4 py-2.5 text-sm font-semibold uppercase transition hover:border-accent-primary hover:text-accent-primary"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}

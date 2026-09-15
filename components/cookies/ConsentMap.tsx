"use client";

import { MapPin, Navigation } from "lucide-react";
import { useCookieConsent } from "./consent-context";

type ConsentMapProps = {
  src: string;
  title: string;
};

export default function ConsentMap({ src, title }: ConsentMapProps) {
  const { status, accept, reset } = useCookieConsent();

  if (status === "accepted") {
    return (
      <iframe
        title={title}
        src={src}
        className="absolute inset-0 block h-full w-full"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-mid px-6 text-center text-text-inverse">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary/15">
        <MapPin size={24} aria-hidden="true" className="text-accent-ink" />
      </span>
      <p className="max-w-sm text-sm leading-relaxed text-text-inverse/80 sm:text-base">
        El mapa de Google solo se carga si aceptas las cookies de terceros.
      </p>
      {status === "pending" ? (
        <button
          type="button"
          onClick={accept}
          className="min-h-11 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-dark uppercase transition hover:bg-accent-primary-hover hover:text-text-inverse"
        >
          Cargar mapa
        </button>
      ) : (
        <button
          type="button"
          onClick={reset}
          className="min-h-11 rounded-lg border border-text-inverse/25 px-5 py-2.5 text-sm font-semibold uppercase transition hover:border-accent-primary hover:text-accent-primary"
        >
          Cambiar mi elección
        </button>
      )}
      <a
        href="https://www.google.com/maps/dir/?api=1&destination=Vaqueroil+C.+Calahorra+12+26006+Logro%C3%B1o"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-accent-ink underline"
      >
        <Navigation size={14} aria-hidden="true" />
        Cómo llegar sin cargar el mapa
      </a>
    </div>
  );
}

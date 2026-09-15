"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ConsentStatus = "pending" | "accepted" | "rejected";

type ConsentContextValue = {
  status: ConsentStatus;
  accept: () => void;
  reject: () => void;
  reset: () => void;
};

const STORAGE_KEY = "vaqueroil-consent-v1";
const CHANGE_EVENT = "vaqueroil-consent-change";

const ConsentContext = createContext<ConsentContextValue>({
  status: "pending",
  accept: () => {},
  reject: () => {},
  reset: () => {},
});

function readStoredStatus(): ConsentStatus {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { status?: unknown };
      if (parsed.status === "accepted" || parsed.status === "rejected") {
        return parsed.status;
      }
    }
  } catch {
    // Sin acceso a localStorage: se trata como pendiente.
  }
  return "pending";
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const status = useSyncExternalStore(
    subscribe,
    readStoredStatus,
    () => "pending" as ConsentStatus,
  );

  const persist = useCallback((next: ConsentStatus) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: next, date: new Date().toISOString() }),
      );
    } catch {
      // Sin almacenamiento: la elección solo dura la sesión.
    }
    notifyChange();
  }, []);

  const accept = useCallback(() => persist("accepted"), [persist]);
  const reject = useCallback(() => persist("rejected"), [persist]);
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nada que limpiar.
    }
    notifyChange();
  }, []);

  return (
    <ConsentContext.Provider value={{ status, accept, reject, reset }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(ConsentContext);
}

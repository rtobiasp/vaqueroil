"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function buildHref(
  pathname: string,
  actual: URLSearchParams,
  patch: Record<string, string | undefined>,
): string {
  const next = new URLSearchParams(actual.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === "") next.delete(k);
    else next.set(k, v);
  }
  next.delete("after");
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function FiltrosCoches({
  estados,
  estadoActual,
}: {
  estados: { valor: string; etiqueta: string }[];
  estadoActual: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onBuscar = (valor: string) => {
    setQ(valor);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      router.replace(
        buildHref(pathname, new URLSearchParams(searchParams.toString()), {
          q: valor.trim() || undefined,
        }),
        { scroll: false },
      );
    }, 400);
  };

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-main/40"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder="Buscar por matrícula, marca, modelo o dueño…"
            className="w-full rounded-md border border-black/10 bg-bg-light py-2 pr-3 pl-10 text-sm text-text-main placeholder:text-text-main/40 focus:border-accent-primary focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {estados.map((estado) => {
          const activo =
            (estadoActual === "" && estado.valor === "ALL") ||
            estadoActual === estado.valor;
          return (
            <button
              key={estado.valor}
              type="button"
              onClick={() => {
                router.replace(
                  buildHref(
                    pathname,
                    new URLSearchParams(searchParams.toString()),
                    {
                      estado:
                        estado.valor === "ALL" ? undefined : estado.valor,
                    },
                  ),
                  { scroll: false },
                );
              }}
              aria-pressed={activo}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                activo
                  ? "border-bg-dark bg-bg-dark text-text-inverse"
                  : "border-black/10 bg-bg-light text-text-main hover:border-black/20"
              }`}
            >
              {estado.etiqueta}
            </button>
          );
        })}
      </div>
    </>
  );
}

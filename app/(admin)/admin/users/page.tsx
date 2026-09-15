import { getUsers, getUserSummary } from "./actions";
import { UsersTable } from "./users-table";
import { FiltrosUsuarios } from "./filters";
import { ORDENES, type OrdenUsuario } from "./status";
import { SummaryCards } from "./summary-cards";
import { NuevoClienteButton } from "./create-button";

const ORDENES_VALIDAS: OrdenUsuario[] = ["RECIENTES", "MAS_CITAS", "AZ"];

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const primero = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const afterParam = primero(params.after);
  const q = (primero(params.q) ?? "").trim();
  const ordenParam = (primero(params.orden) ?? "").trim();

  const orden: OrdenUsuario = ORDENES_VALIDAS.includes(
    ordenParam as OrdenUsuario,
  )
    ? (ordenParam as OrdenUsuario)
    : "RECIENTES";

  const [{ items: usuarios, nextCursor, hasNext }, resumen] =
    await Promise.all([
      getUsers({ after: afterParam, q, orden }),
      getUserSummary(),
    ]);

  const baseQuery = new URLSearchParams();
  if (q) baseQuery.set("q", q);
  if (orden !== "RECIENTES") baseQuery.set("orden", orden);
  const qsBase = baseQuery.toString();
  const hrefPrimera = qsBase ? `/admin/users?${qsBase}` : "/admin/users";
  const hrefSiguiente =
    nextCursor != null
      ? `/admin/users?${new URLSearchParams({
          ...Object.fromEntries(baseQuery),
          after: nextCursor,
        }).toString()}`
      : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 text-text-inverse sm:gap-6 sm:px-6 sm:py-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-text-inverse/60 sm:text-sm">Gestión</p>
          <h1 className="text-2xl font-bold text-text-inverse sm:text-3xl">
            Clientes
          </h1>
          <p className="mt-0.5 text-xs text-text-inverse/60 sm:text-sm">
            Fichas de cliente con sus coches y su historial de citas
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <NuevoClienteButton />
        </div>
      </div>

      <SummaryCards resumen={resumen} />

      <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
        <FiltrosUsuarios
          ordenes={ORDENES}
          ordenActual={ordenParam || "RECIENTES"}
        />
      </section>

      <UsersTable
        usuarios={usuarios}
        totalMostrados={usuarios.length}
        conFiltroAtras={Boolean(afterParam)}
        hrefPrimera={hrefPrimera}
        hrefSiguiente={hrefSiguiente}
        haySiguiente={hasNext}
      />
    </div>
  );
}

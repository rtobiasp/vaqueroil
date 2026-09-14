export default function Card({
  titulo,
  icono: Icono,
  children,
}: {
  titulo: string;
  icono: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 text-text-main shadow-sm sm:p-5">
      <header className="mb-3 flex min-w-0 items-center gap-2 sm:mb-4">
        <span className="shrink-0 rounded-lg bg-bg-dark p-2 text-text-inverse">
          <Icono size={18} />
        </span>
        <h2 className="min-w-0 truncate text-sm font-semibold text-text-main sm:text-base">{titulo}</h2>
      </header>
      {children}
    </section>
  );
}

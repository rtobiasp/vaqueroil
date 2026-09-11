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
    <section className="rounded-2xl border border-black/5 bg-white p-5 text-text-main shadow-sm">
      <header className="mb-4 flex items-center gap-2">
        <span className="rounded-lg bg-bg-dark p-2 text-text-inverse">
          <Icono size={18} />
        </span>
        <h2 className="text-base font-semibold text-text-main">{titulo}</h2>
      </header>
      {children}
    </section>
  );
}

type BlankPageProps = {
  title: string;
};

export default function BlankPage({ title }: BlankPageProps) {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-neutral-950">
      <div className="mx-auto min-h-[60vh] max-w-6xl border border-dashed border-neutral-300 p-8">
        <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
      </div>
    </main>
  );
}
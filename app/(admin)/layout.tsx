import SideBar from "./componentes/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <SideBar />
      <main className="bg-surface-mid flex-1 min-w-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}

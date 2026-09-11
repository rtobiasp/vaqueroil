import SideBar from "./componentes/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <SideBar />
      <main className="bg-bg-light flex-1 min-w-0 min-h-screen">{children}</main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SideBar from "./componentes/SideBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defensa en profundidad: aunque el proxy ya redirige a /login,
  // este guard server-side asegura /admin/* incluso si el
  // middleware no se ejecuta. Usa getUser() (revalida contra Auth).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/dashboard");
  }
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <SideBar />
      <main className="bg-surface-mid flex-1 min-w-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}

import Header from "@/components/Header";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <footer>
        <Link href={"/admin/dashboard"}>Acceso empleados</Link>
      </footer>
    </>
  );
}

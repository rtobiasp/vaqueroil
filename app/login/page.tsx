import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import { getSafeRedirect } from "@/lib/get-redirect";

export const metadata: Metadata = {
  title: "Acceso empleados",
  description: "Acceso privado al panel de administración de Vaqueroil.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; authorization_id?: string }>;
}) {
  const params = await searchParams;

  // Compatibilidad:
  // - Flujo nuevo: /login?redirect=%2Foauth%2Fconsent%3Fauthorization_id%3Dxxx
  // - Flujo antiguo sin encode: /login?redirect=/oauth/consent?authorization_id=xxx
  // - Directo: /login?authorization_id=xxx
  const rawRedirect = params.redirect;
  const authorizationId = params.authorization_id;
  const redirectTo = getSafeRedirect(
    rawRedirect ??
      (authorizationId
        ? `/oauth/consent?authorization_id=${authorizationId}`
        : "/"),
  );

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  // Si ya hay sesión, no mostrar el login: volver al consentimiento
  // conservando el mismo authorization_id que generó Supabase.
  if (data?.claims) {
    redirect(redirectTo);
  }

  const isAdminAccess = redirectTo.startsWith("/admin");

  return (
    <main
      id="contenido"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-bg-dark px-4 py-12"
    >
      {/* Fondo de marca */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/hero_background.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b bg-bg-dark/60 via-bg-dark/80 to-bg-dark" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-bg-light p-8 text-text-main shadow-2xl shadow-black/50 sm:p-10">
          <Link
            href="/"
            className="mx-auto mb-6 block w-fit"
            aria-label="Vaqueroil - inicio"
          >
            <Image
              src="/logo.png"
              alt="Vaqueroil"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-dark px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-text-inverse uppercase">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Acceso privado
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Iniciar sesión
            </h1>
            <p className="text-sm leading-relaxed text-text-main/70">
              {isAdminAccess
                ? "Estás entrando al panel de administración de Vaqueroil."
                : redirectTo !== "/"
                  ? "Para continuar, inicia sesión y volverás a autorizar la app."
                  : "Accede con tu cuenta para continuar."}
            </p>
          </div>

          <LoginForm redirectTo={redirectTo} />

          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-text-main/60 transition-colors hover:text-accent-primary-hover"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver a la web
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-text-inverse/50">
          Solo personal autorizado. Si no tienes cuenta, contacta con el
          administrador.
        </p>
      </div>
    </main>
  );
}

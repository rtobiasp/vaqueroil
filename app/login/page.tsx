import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import { getSafeRedirect } from "@/lib/get-redirect";

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

  return (
    <div>
      <h1>Iniciar sesión</h1>
      {redirectTo !== "/" ? (
        <p>Para continuar, inicia sesión y volverás a autorizar la app.</p>
      ) : null}
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}

// app/oauth/consent/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ authorization_id?: string }>;
}) {
  const authorizationId = (await searchParams).authorization_id;

  if (!authorizationId) {
    return <div>Error: Missing authorization_id</div>;
  }

  const supabase = await createClient();

  // Check if user is authenticated
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    // Redirect to login, preserving authorization_id.
    // El authorization_id lo genera Supabase Auth al llamar a /oauth/authorize,
    // aquí solo lo conservamos para volver tras el login.
    redirect(
      `/login?redirect=${encodeURIComponent(`/oauth/consent?authorization_id=${authorizationId}`)}`,
    );
  }

  // Get authorization details using the authorization_id
  const { data: authDetails, error } =
    await supabase.auth.oauth.getAuthorizationDetails(authorizationId);

  if (error || !authDetails) {
    return (
      <div>Error: {error?.message || "Invalid authorization request"}</div>
    );
  }

  // if no authorization_id returned, user has previously consented, redirect them
  if (!("authorization_id" in authDetails)) {
    redirect(authDetails["redirect_url"]);
  }

  return (
    <div>
      <h1>Authorize {authDetails.client.name}</h1>
      <p>This application wants to access your account.</p>

      <div>
        <p>
          <strong>Client:</strong> {authDetails.client.name}
        </p>
        <p>
          <strong>Redirect URI:</strong> {authDetails.redirect_uri}
        </p>
        {authDetails.scope && authDetails.scope.trim() && (
          <div>
            <strong>Requested permissions:</strong>
            <ul>
              {authDetails.scope.split(" ").map((scopeItem) => (
                <li key={scopeItem}>{scopeItem}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form action="/api/oauth/decision" method="POST">
        <input type="hidden" name="authorization_id" value={authorizationId} />
        <button type="submit" name="decision" value="approve">
          Approve
        </button>
        <button type="submit" name="decision" value="deny">
          Deny
        </button>
      </form>
    </div>
  );
}

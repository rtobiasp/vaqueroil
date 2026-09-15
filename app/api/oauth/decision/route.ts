// app/api/oauth/decision/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const decision = formData.get("decision");
  const authorizationId = formData.get("authorization_id") as string;

  if (!authorizationId) {
    return NextResponse.json(
      { error: "Missing authorization_id" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  if (decision === "approve") {
    const { data, error } =
      await supabase.auth.oauth.approveAuthorization(authorizationId);

    if (error || !data?.redirect_url) {
      return NextResponse.json(
        { error: error?.message ?? "Missing redirect_url" },
        { status: 400 },
      );
    }

    // Redirect back to the client with authorization code.
    // 303 porque venimos de un POST de formulario.
    return NextResponse.redirect(data.redirect_url, 303);
  } else {
    const { data, error } =
      await supabase.auth.oauth.denyAuthorization(authorizationId);

    if (error || !data?.redirect_url) {
      return NextResponse.json(
        { error: error?.message ?? "Missing redirect_url" },
        { status: 400 },
      );
    }

    // Redirect back to the client with error
    return NextResponse.redirect(data.redirect_url, 303);
  }
}

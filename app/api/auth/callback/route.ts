import { NextRequest } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  const posthog = getPostHogClient();
  const code = request.nextUrl.searchParams.get("insforge_code");
  if (!code) {
    posthog.capture({
      distinctId: "anonymous",
      event: "sign_in_failed",
      properties: { reason: "missing_code" },
    });
    return Response.redirect(new URL("/login", request.url));
  }

  const verifierCookie = request.cookies.get("insforge_pkce_verifier");
  const codeVerifier = verifierCookie?.value
    ? decodeURIComponent(verifierCookie.value)
    : null;

  if (!codeVerifier) {
    posthog.capture({
      distinctId: "anonymous",
      event: "sign_in_failed",
      properties: { reason: "missing_verifier" },
    });
    return Response.redirect(
      new URL("/login?error=missing_verifier", request.url),
    );
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;

    const exchangeResponse = await fetch(
      `${baseUrl}/api/auth/oauth/exchange`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          code,
          code_verifier: codeVerifier,
        }),
      },
    );

    if (!exchangeResponse.ok) {
      console.error("[auth/callback] Exchange HTTP error:", exchangeResponse.status);
      posthog.capture({
        distinctId: "anonymous",
        event: "sign_in_failed",
        properties: { reason: "exchange_failed", status: exchangeResponse.status },
      });
      return Response.redirect(
        new URL("/login?error=exchange_failed", request.url),
      );
    }

    const data = await exchangeResponse.json();

    if (!data.accessToken) {
      console.error("[auth/callback] No accessToken in response");
      posthog.capture({
        distinctId: "anonymous",
        event: "sign_in_failed",
        properties: { reason: "no_access_token" },
      });
      return Response.redirect(
        new URL("/login?error=exchange_failed", request.url),
      );
    }

    const userId: string = data.user?.id ?? data.userId ?? "unknown";
    posthog.identify({
      distinctId: userId,
      properties: {
        email: data.user?.email,
      },
    });
    posthog.capture({
      distinctId: userId,
      event: "user_signed_in",
      properties: { method: "oauth" },
    });

    const headers = new Headers();
    headers.set("Location", "/dashboard");

    headers.append(
      "Set-Cookie",
      `insforge_access_token=${data.accessToken}; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    );

    if (data.refreshToken) {
      headers.append(
        "Set-Cookie",
        `insforge_refresh_token=${data.refreshToken}; Path=/; SameSite=Lax; HttpOnly; Max-Age=${30 * 24 * 60 * 60}`,
      );
    }

    headers.append(
      "Set-Cookie",
      "insforge_pkce_verifier=; Path=/; Max-Age=0",
    );

    return new Response(null, { status: 302, headers });
  } catch (err) {
    console.error("[auth/callback] Unexpected error:", err);
    posthog.capture({
      distinctId: "anonymous",
      event: "sign_in_failed",
      properties: { reason: "server_error" },
    });
    return Response.redirect(
      new URL("/login?error=server_error", request.url),
    );
  }
}

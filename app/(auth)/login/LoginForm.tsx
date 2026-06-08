"use client";

import { useState } from "react";
import { insforge } from "@/lib/insforge-client";
import posthog from "posthog-js";

const PROVIDERS = [
  { name: "Google", key: "google" },
  { name: "GitHub", key: "github" },
] as const;

export function LoginForm() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: string) => {
    setLoading(provider);
    posthog.capture("sign_in_clicked", { provider });

    const { data, error } = await insforge.auth.signInWithOAuth(provider, {
      redirectTo: `${window.location.origin}/api/auth/callback`,
      skipBrowserRedirect: true,
    });

    if (error || !data?.url) {
      posthog.capture("sign_in_error", {
        provider,
        error_message: error?.message ?? "no_redirect_url",
      });
      setLoading(null);
      return;
    }

    if (data.codeVerifier) {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `insforge_pkce_verifier=${encodeURIComponent(data.codeVerifier)}; path=/; max-age=600; SameSite=Lax`;
    }

    // eslint-disable-next-line react-hooks/immutability
    window.location.href = data.url;
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <h1 className="mb-2 text-center text-base font-semibold leading-6 text-text-primary">
          Sign in to JobPilot
        </h1>
        <p className="mb-6 text-center text-xs leading-4 text-text-muted">
          Use your existing account to get started
        </p>

        <div className="flex flex-col gap-3">
          {PROVIDERS.map(({ name, key }) => (
            <button
              key={key}
              type="button"
              disabled={loading !== null}
              onClick={() => handleOAuth(key)}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:opacity-50"
            >
              {loading === key ? "Redirecting..." : `Sign in with ${name}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

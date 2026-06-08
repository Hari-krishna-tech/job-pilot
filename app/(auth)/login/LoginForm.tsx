"use client";

import { useState } from "react";
import { insforge } from "@/lib/insforge-client";
import posthog from "posthog-js";

const PROVIDERS = [
  {
    name: "Google",
    key: "google",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path
          d="M18.172 8.367h-.64v-.034H10v3.334h4.71A4.998 4.998 0 0 1 5 10a5 5 0 0 1 5-5c1.275 0 2.434.48 3.317 1.266l2.357-2.357A8.3 8.3 0 0 0 10 1.667 8.333 8.333 0 0 0 2.574 6.15l2.74 2.127A4.99 4.99 0 0 1 10 5c1.12 0 2.143.37 2.958.997l-.007-.007 2.357-2.357h.002A8.3 8.3 0 0 0 10 1.667zm0 0"
          fill="#FFC107"
        />
        <path
          d="M3.293 7.004A8.33 8.33 0 0 0 1.667 10c0 1.592.451 3.074 1.228 4.333l-.01-.017 2.813-2.19a4.96 4.96 0 0 1-.06-2.126l-.002.01z"
          fill="#FF3D00"
        />
        <path
          d="M10 18.333c2.246 0 4.284-.89 5.775-2.325l.002.002-2.734-2.314A4.96 4.96 0 0 1 10 15a5 5 0 0 1-4.703-3.31l-.012.034-2.722 2.21.003.002A8.3 8.3 0 0 0 10 18.333z"
          fill="#4CAF50"
        />
        <path
          d="M18.172 8.367h-.64v-.034H10v3.334h4.71a5.01 5.01 0 0 1-1.697 2.325l-.003-.002 2.733 2.313c-.194.176 2.924-2.132 2.924-6.636 0-.558-.057-1.103-.167-1.634z"
          fill="#1976D2"
        />
      </svg>
    ),
  },
  {
    name: "GitHub",
    key: "github",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" className="text-text-primary">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.56 9.56 0 0 1 10 4.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 20 10.017C20 4.484 15.522 0 10 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-8">
      <div className="w-full max-w-[360px]">
        <h1 className="text-center text-base font-semibold leading-6 text-text-primary">
          Sign in to JobPilot
        </h1>

        <div className="mt-6 flex flex-col gap-3">
          {PROVIDERS.map(({ name, key, icon }) => (
            <button
              key={key}
              type="button"
              disabled={loading !== null}
              onClick={() => handleOAuth(key)}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:opacity-50"
            >
              <span className="flex-shrink-0">{icon}</span>
              <span>
                {loading === key
                  ? "Redirecting..."
                  : `Sign in with ${name}`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

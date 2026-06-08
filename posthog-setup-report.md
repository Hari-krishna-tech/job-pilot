<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into JobPilot, a Next.js 16 App Router application. Here is a summary of every change made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Enables exception capture, reverse-proxy ingestion via `/ingest`, and debug mode in development.
- **`next.config.ts`** — Added reverse-proxy rewrites so PostHog requests route through `/ingest/*` on your own domain, improving ad-blocker resilience and data accuracy.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client (using `posthog-node`) for API route tracking. Configured with `flushAt: 1` / `flushInterval: 0` for immediate flushing in serverless environments.
- **`app/(auth)/login/LoginForm.tsx`** — Tracks `sign_in_clicked` (with provider) when a user initiates OAuth, and `sign_in_error` when the OAuth flow fails before redirect.
- **`components/homepage/Hero.tsx`** — Tracks `get_started_clicked` and `find_first_match_clicked` on the two hero CTA buttons.
- **`components/homepage/CTASection.tsx`** — Tracks `cta_get_started_clicked` on the bottom-of-page CTA.
- **`app/api/auth/callback/route.ts`** — Server-side tracking: `user_signed_in` (with `posthog.identify()` on success) and `sign_in_failed` with a `reason` property for every failure branch (missing code, missing verifier, exchange failure, no access token, server error).

| Event | Description | File |
|---|---|---|
| `sign_in_clicked` | User clicks a sign-in button (Google or GitHub) | `app/(auth)/login/LoginForm.tsx` |
| `sign_in_error` | OAuth initiation fails or returns no redirect URL | `app/(auth)/login/LoginForm.tsx` |
| `get_started_clicked` | User clicks the primary hero "Get Started Free" CTA | `components/homepage/Hero.tsx` |
| `find_first_match_clicked` | User clicks the "Find Your First Match" hero CTA | `components/homepage/Hero.tsx` |
| `cta_get_started_clicked` | User clicks "Get Started Free" in the bottom CTA section | `components/homepage/CTASection.tsx` |
| `user_signed_in` | OAuth callback completed — tokens set, user redirected to dashboard | `app/api/auth/callback/route.ts` |
| `sign_in_failed` | OAuth callback failed (with `reason` property) | `app/api/auth/callback/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/458123/dashboard/1682715)
- [Sign-in conversion funnel](https://us.posthog.com/project/458123/insights/T1sVhXUy) — Homepage CTA → sign-in click → successful sign-in
- [Daily sign-ins](https://us.posthog.com/project/458123/insights/aXnmtPGq) — Unique users who successfully sign in each day
- [Homepage CTA engagement](https://us.posthog.com/project/458123/insights/wVdmtdcc) — Clicks on each of the three homepage CTAs
- [Sign-in errors](https://us.posthog.com/project/458123/insights/bTb8ZZeS) — Server-side and client-side sign-in failures over time
- [Sign-in provider breakdown](https://us.posthog.com/project/458123/insights/A7n0iCyl) — Google vs GitHub split on sign-in clicks

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

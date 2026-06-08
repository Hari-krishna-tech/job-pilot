"use client";

import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 50%, var(--color-accent) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-20 pt-24 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Find Jobs That{" "}
            <span style={{ color: "var(--color-accent)" }}>Actually Fit</span>.
            Apply Fully Prepared.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-text-secondary">
            JobPilot uses AI to discover jobs, score them against your skills,
            and research every company — so you spend less time searching and
            more time landing offers.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              onClick={() => posthog.capture("get_started_clicked", { location: "hero" })}
              className="inline-flex rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              onClick={() => posthog.capture("find_first_match_clicked", { location: "hero" })}
              className="inline-flex rounded-md border border-border bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              Find Your First Match
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border shadow-lg">
            <Image
              src="/images/dashboard-demo.png"
              alt="JobPilot dashboard preview"
              width={1280}
              height={720}
              className="w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

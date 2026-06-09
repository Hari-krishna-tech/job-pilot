"use client";

import Link from "next/link";
import posthog from "posthog-js";

export function CTASection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface-secondary p-6 text-center sm:p-12">
          <h2 className="text-[30px] font-semibold leading-9 text-text-primary">
            Ready to Land Your Next Role?
          </h2>
          <p className="mt-4 text-sm leading-5 text-text-secondary">
            Set up your profile in minutes. Let AI find the jobs that actually
            fit your skills.
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              onClick={() => posthog.capture("cta_get_started_clicked", { location: "bottom_cta" })}
              className="inline-flex rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

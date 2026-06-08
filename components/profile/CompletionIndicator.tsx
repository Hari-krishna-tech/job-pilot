"use client";

import type { ProfileFormData } from "@/types";
import {
  REQUIRED_FIELDS,
  getMissingFields,
  getCompletionPercentage,
} from "@/lib/profile-utils";

type Props = {
  data: ProfileFormData;
};

export function CompletionIndicator({ data }: Props) {
  const missingFields = getMissingFields(data);
  const percentage = getCompletionPercentage(data);

  const total = REQUIRED_FIELDS.length;
  const complete = total - missingFields.length;

  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - percentage / 100);

  if (percentage === 100) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-lightest">
            <svg className="h-5 w-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold leading-6 text-text-primary">
              Profile Complete
            </p>
            <p className="text-xs leading-4 text-text-muted">
              All required fields filled
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-start gap-6">
        <div className="relative flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 40 40)"
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-text-primary">
            {percentage}%
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold leading-6 text-text-primary">
            Your profile needs attention
          </h2>
          <p className="mt-1 text-xs leading-4 text-text-muted">
            Complete your profile to get better job matches. {complete} of {total} required fields filled.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {missingFields.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

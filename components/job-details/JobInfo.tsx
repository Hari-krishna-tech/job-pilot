import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  DollarSign,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";
import type { JobRow } from "@/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatJobType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getMatchBadgeStyle(score: number): string {
  if (score >= 80) return "bg-success-lightest text-success-foreground";
  if (score >= 60) return "bg-info-light text-info-foreground";
  return "bg-surface-secondary text-text-secondary";
}

export function JobInfo({ job }: { job: JobRow }) {
  const infoItems = [
    {
      icon: DollarSign,
      label: "Salary Est.",
      value: job.salary || "--",
    },
    {
      icon: MapPin,
      label: "Location",
      value: job.location || "--",
    },
    {
      icon: Clock,
      label: "Job Type",
      value: job.job_type ? formatJobType(job.job_type) : "--",
    },
    {
      icon: Calendar,
      label: "Date Found",
      value: formatDate(job.found_at),
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/find-jobs"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-tertiary">
              <Building2 className="h-6 w-6 text-text-muted" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-6 text-text-primary">
                {job.title}
              </h1>
              <p className="mt-1 text-sm text-text-secondary">{job.company}</p>
              {job.match_score != null && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-border-light">
                    <div
                      className={`h-full rounded-full ${
                        job.match_score >= 80
                          ? "bg-success"
                          : job.match_score >= 60
                            ? "bg-info"
                            : "bg-warning"
                      }`}
                      style={{ width: `${job.match_score}%` }}
                    />
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getMatchBadgeStyle(job.match_score)}`}
                  >
                    {job.match_score}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 w-full sm:w-auto">
            {job.source_url && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary sm:w-auto"
              >
                View Job Post
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-surface-secondary p-3"
            >
              <div className="flex items-center gap-1.5">
                <item.icon className="h-4 w-4 text-text-muted" />
                <span className="text-xs leading-4 text-text-muted">
                  {item.label}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

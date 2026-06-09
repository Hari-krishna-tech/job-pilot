"use client";

import { useRouter } from "next/navigation";
import type { JobRow } from "@/types";

function getMatchScoreColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-info";
  return "bg-warning";
}

function getMatchScoreTextColor(score: number): string {
  if (score >= 80) return "text-success-darker";
  if (score >= 60) return "text-info-foreground";
  return "text-warning";
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MatchScore({ score }: { score: number | null }) {
  if (score == null) {
    return <span className="text-sm text-text-muted">--</span>;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-1 w-16 overflow-hidden rounded-full bg-border-light">
        <div
          className={`h-full rounded-full ${getMatchScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={`text-sm font-medium ${getMatchScoreTextColor(score)}`}
      >
        {score}%
      </span>
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        source === "search"
          ? "bg-accent-light text-accent"
          : "bg-surface-secondary text-text-secondary"
      }`}
    >
      {source === "search" ? "Search" : "URL"}
    </span>
  );
}

function JobCard({ job }: { job: JobRow }) {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-secondary"
      onClick={() => router.push(`/find-jobs/${job.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary truncate">
            {job.company}
          </p>
          <p className="mt-0.5 text-sm text-text-secondary truncate">
            {job.title}
          </p>
        </div>
        <SourceBadge source={job.source} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <MatchScore score={job.match_score} />
        <span className="text-xs text-text-muted shrink-0">
          {formatDate(job.found_at)}
        </span>
      </div>

      {job.salary && (
        <p className="mt-2 text-xs text-text-secondary">{job.salary}</p>
      )}
    </div>
  );
}

export function JobsTable({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-12 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <p className="text-center text-sm text-text-muted">
          No jobs found. Use the search controls above to discover jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Match Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Salary Est.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                Date Found
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="cursor-pointer transition-colors hover:bg-surface-secondary"
                onClick={() => router.push(`/find-jobs/${job.id}`)}
              >
                <td className="px-6 py-4 text-sm font-medium text-text-primary">
                  {job.company}
                </td>
                <td className="px-6 py-4 text-sm text-text-primary">
                  {job.title}
                </td>
                <td className="px-6 py-4">
                  <MatchScore score={job.match_score} />
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {job.salary || "--"}
                </td>
                <td className="px-6 py-4">
                  <SourceBadge source={job.source} />
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {formatDate(job.found_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 p-4 md:hidden">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import type { JobRow } from "@/types";

export function MatchScore({ job }: { job: JobRow }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          AI Match Reasoning
        </h2>
      </div>

      {job.match_reason ? (
        <p className="mt-3 text-sm leading-5 text-text-secondary">
          {job.match_reason}
        </p>
      ) : (
        <p className="mt-3 text-sm text-text-muted">
          No match reasoning available for this job.
        </p>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold text-text-primary">
              Matched Skills
            </h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.matched_skills && job.matched_skills.length > 0 ? (
              job.matched_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex rounded-full bg-success-lightest px-2.5 py-0.5 text-xs font-medium text-success-foreground"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-muted">
                No matched skills recorded.
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-text-primary">
              Missing Skills
            </h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.missing_skills && job.missing_skills.length > 0 ? (
              job.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-muted">
                No missing skills recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

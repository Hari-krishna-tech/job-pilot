import { FileText } from "lucide-react";
import type { JobRow } from "@/types";

function BulletList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-5 text-text-secondary">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDescription({ job }: { job: JobRow }) {
  const hasContent =
    job.about_role ||
    (job.responsibilities && job.responsibilities.length > 0) ||
    (job.requirements && job.requirements.length > 0) ||
    (job.nice_to_have && job.nice_to_have.length > 0) ||
    (job.benefits && job.benefits.length > 0) ||
    job.about_company;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-accent" />
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Job Description
        </h2>
      </div>

      {hasContent ? (
        <div className="mt-4 space-y-6">
          {job.about_role && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                About the Role
              </h3>
              <p className="mt-2 text-sm leading-5 text-text-secondary">
                {job.about_role}
              </p>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <BulletList
              title="Responsibilities"
              items={job.responsibilities}
            />
          )}

          {job.requirements && job.requirements.length > 0 && (
            <BulletList title="Requirements" items={job.requirements} />
          )}

          {job.nice_to_have && job.nice_to_have.length > 0 && (
            <BulletList title="Nice to Have" items={job.nice_to_have} />
          )}

          {job.benefits && job.benefits.length > 0 && (
            <BulletList title="Benefits" items={job.benefits} />
          )}

          {job.about_company && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                About the Company
              </h3>
              <p className="mt-2 text-sm leading-5 text-text-secondary">
                {job.about_company}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-text-muted">
          No detailed description available for this job.
        </p>
      )}
    </div>
  );
}

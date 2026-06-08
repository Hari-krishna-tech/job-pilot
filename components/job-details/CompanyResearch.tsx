"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, Zap, Target, AlertTriangle, Lightbulb, Presentation, ExternalLink } from "lucide-react";
import type { CompanyDossier } from "@/agent/research";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, i) => (
        <li key={i} className="text-sm leading-5 text-text-secondary">
          {item}
        </li>
      ))}
    </ul>
  );
}

function DossierView({ dossier }: { dossier: CompanyDossier }) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">
          Company Overview
        </h3>
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          {dossier.companyOverview}
        </p>
      </div>

      {dossier.techStack.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Tech Stack
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {dossier.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex rounded-full bg-success-lightest px-2.5 py-0.5 text-xs font-medium text-success-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {dossier.culture.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Culture</h3>
          <div className="mt-2">
            <BulletList items={dossier.culture} />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-text-primary">
          Why This Role Exists
        </h3>
        <p className="mt-2 text-sm leading-5 text-text-secondary">
          {dossier.whyThisRole}
        </p>
      </div>

      {dossier.yourEdge.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5">
            <Target className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">
              Your Edge
            </h3>
          </div>
          <div className="mt-2">
            <BulletList items={dossier.yourEdge} />
          </div>
        </div>
      )}

      {dossier.gapsToAddress.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-text-primary">
              Gaps to Address
            </h3>
          </div>
          <div className="mt-2">
            <BulletList items={dossier.gapsToAddress} />
          </div>
        </div>
      )}

      {dossier.smartQuestions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-info-dark" />
            <h3 className="text-sm font-semibold text-text-primary">
              Smart Questions to Ask
            </h3>
          </div>
          <div className="mt-2">
            <BulletList items={dossier.smartQuestions} />
          </div>
        </div>
      )}

      {dossier.interviewPrep.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5">
            <Presentation className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold text-text-primary">
              Interview Prep
            </h3>
          </div>
          <div className="mt-2">
            <BulletList items={dossier.interviewPrep} />
          </div>
        </div>
      )}

      {dossier.sources.length > 0 && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
            <h3 className="text-xs font-medium text-text-muted">Sources</h3>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {dossier.sources.map((source, i) => (
              <a
                key={i}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-info-dark underline underline-offset-2 hover:text-info-medium"
              >
                {source}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CompanyResearch({
  jobId,
  existingResearch,
}: {
  jobId: string;
  existingResearch: CompanyDossier | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleResearch = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/agent/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        const data = await res.json();
        if (data.success) {
          router.refresh();
        }
      } catch {
        // error handled by UI staying in loading state
      }
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-accent" />
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Company Research
        </h2>
      </div>

      {existingResearch ? (
        <DossierView dossier={existingResearch} />
      ) : (
        <div className="mt-8 flex flex-col items-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-tertiary">
            <Search className="h-6 w-6 text-text-muted" />
          </div>
          <p className="mt-4 text-sm font-medium text-text-primary">
            Research this company to get interview-ready insights
          </p>
          <p className="mt-1 text-xs text-text-muted">
            We will browse the company website and build a structured dossier —
            company overview, tech stack, culture, and more.
          </p>
          <button
            type="button"
            disabled={isPending}
            onClick={handleResearch}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Zap className="h-4 w-4 animate-pulse" />
                Researching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Research Company
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

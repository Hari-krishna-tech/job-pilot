"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2, AlertTriangle, Briefcase } from "lucide-react";

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Any experience" },
  { value: "entry", label: "Entry (0-1 years)" },
  { value: "junior", label: "Junior (1-3 years)" },
  { value: "mid", label: "Mid (3-5 years)" },
  { value: "senior", label: "Senior (5-7 years)" },
  { value: "lead", label: "Lead (7-10 years)" },
  { value: "principal", label: "Principal (10+ years)" },
];

export function SearchControls() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState<{
    jobsFound: number;
    strongMatches: number;
    locationMatched: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFindJobs = () => {
    if (!jobTitle.trim()) return;
    setResult(null);
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/agent/find", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: jobTitle.trim(),
            location: location.trim(),
            experience: experience || undefined,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setResult({
            jobsFound: data.jobsFound,
            strongMatches: data.strongMatches,
            locationMatched: data.locationMatched ?? true,
          });
          router.refresh();
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch {
        setError("Failed to search for jobs. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div>
            <label
              htmlFor="job-title"
              className="mb-1.5 block text-xs font-medium text-text-dark sm:text-sm"
            >
              JOB TITLE
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  setResult(null);
                  setError(null);
                }}
                placeholder="Frontend Engineer"
                className="w-full rounded-md border border-border bg-surface py-2 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-xs font-medium text-text-dark sm:text-sm"
            >
              LOCATION
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setResult(null);
                  setError(null);
                }}
                placeholder="Bengaluru, Remote, Mumbai..."
                className="w-full rounded-md border border-border bg-surface py-2 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="experience"
              className="mb-1.5 block text-xs font-medium text-text-dark sm:text-sm"
            >
              EXPERIENCE
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <select
                id="experience"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  setResult(null);
                  setError(null);
                }}
                className="w-full appearance-none rounded-md border border-border bg-surface py-2 pl-10 pr-8 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFindJobs}
            disabled={isPending || !jobTitle.trim()}
            className="flex h-[38px] w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50 md:w-auto"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isPending ? "Searching..." : "Find Jobs"}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-lg border border-success-light bg-success-lightest px-4 py-3">
          <p className="text-sm font-medium text-success-darker">
            Found {result.jobsFound} jobs and saved {result.strongMatches}{" "}
            strong matches.
          </p>
        </div>
      )}

      {result && !result.locationMatched && location && (
        <div className="flex items-start gap-2 rounded-lg border border-warning-light bg-warning-lightest px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-sm text-warning-darker">
            No jobs found for &ldquo;{location}&rdquo;. Showing nationwide
            results instead.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error-light bg-error-lightest px-4 py-3">
          <p className="text-sm font-medium text-error">{error}</p>
        </div>
      )}
    </div>
  );
}

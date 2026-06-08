import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { JobRow } from "@/types";
import { JobInfo } from "@/components/job-details/JobInfo";
import { MatchScore } from "@/components/job-details/MatchScore";
import { JobDescription } from "@/components/job-details/JobDescription";
import { CompanyResearch } from "@/components/job-details/CompanyResearch";
import { JobActions } from "@/components/job-details/JobActions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: Props) {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
    error,
  } = await insforge.auth.getCurrentUser();

  if (error || !user) redirect("/login");

  const { id } = await params;

  const { data: jobs } = await insforge.database
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id);

  const job = jobs?.[0] as JobRow | undefined;

  if (!job) {
    return (
      <div className="mx-auto max-w-[1440px] p-8">
        <h1 className="text-base font-semibold leading-6 text-text-primary">
          Job not found
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] p-8">
      <div className="space-y-6">
        <JobInfo job={job} />
        <MatchScore job={job} />
        <JobDescription job={job} />
        <CompanyResearch
          jobId={job.id}
          existingResearch={
            job.company_research as import("@/agent/research").CompanyDossier | null
          }
        />
        <JobActions applyUrl={job.external_apply_url} />
      </div>
    </div>
  );
}

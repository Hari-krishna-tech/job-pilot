import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { FindJobsClient } from "@/components/find-jobs/FindJobsClient";
import type { JobRow } from "@/types";

export default async function FindJobsPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
    error,
  } = await insforge.auth.getCurrentUser();

  if (error || !user) redirect("/login");

  const { data: jobs } = await insforge.database
    .from("jobs")
    .select("*")
    .eq("user_id", user.id)
    .order("found_at", { ascending: false });

  const jobList = (jobs || []) as JobRow[];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:p-8">
      <h1 className="mb-6 text-base font-semibold leading-6 text-text-primary">
        Find Jobs
      </h1>

      <div className="space-y-6">
        <SearchControls />
        <FindJobsClient jobs={jobList} />
      </div>
    </div>
  );
}

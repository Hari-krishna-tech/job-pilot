import { createInsforgeServer } from "@/lib/insforge-server";
import { searchJobs, fetchFullDescription } from "@/lib/adzuna";
import { scoreJob } from "@/agent/matcher";
import { extractJobDescription } from "@/agent/extractor";
import { MATCH_THRESHOLD } from "@/lib/utils";
import type { ProfileFormData } from "@/types";

export async function discoverAndScoreJobs(
  jobTitle: string,
  location: string,
  profile: ProfileFormData | null,
  userId: string,
  runId: string,
  experience?: string,
): Promise<{
  jobsFound: number;
  strongMatches: number;
  jobMatchScores: { id: string; match_score: number }[];
  locationMatched: boolean;
}> {
  const insforge = await createInsforgeServer();

  let searchResult;
  try {
    searchResult = await searchJobs(jobTitle, location);
  } catch (error) {
    console.error("[agent/adzuna] Adzuna search failed:", error);
    await insforge.database.from("agent_logs").insert({
      run_id: runId,
      user_id: userId,
      message: `Adzuna API search failed: ${error}`,
      level: "error",
    });
    return {
      jobsFound: 0,
      strongMatches: 0,
      jobMatchScores: [],
      locationMatched: false,
    };
  }

  const { jobs: adzunaJobs, locationMatched } = searchResult;

  if (adzunaJobs.length === 0) {
    return { jobsFound: 0, strongMatches: 0, jobMatchScores: [], locationMatched };
  }

  let strongMatches = 0;
  const jobMatchScores: { id: string; match_score: number }[] = [];

  for (const job of adzunaJobs) {
    try {
      const scored = await scoreJob(job, profile, experience);

      const matchScore = scored?.matchScore ?? 0;
      const isStrong = matchScore >= MATCH_THRESHOLD;
      if (isStrong) strongMatches++;

      const salary = job.salary_min
        ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(
            (job.salary_max ?? job.salary_min) / 1000,
          )}k`
        : null;

      const fullDescription = await fetchFullDescription(job.redirect_url);

      const structured = await extractJobDescription(
        fullDescription ?? job.description,
        job.title,
        job.company.display_name,
      );

      const jobRecord: Record<string, unknown> = {
        user_id: userId,
        run_id: runId,
        source: "search" as const,
        source_url: job.redirect_url,
        external_apply_url: job.redirect_url,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        salary,
        job_type: job.contract_type || "fulltime",
        match_score: matchScore,
        match_reason: scored?.matchReason ?? null,
        matched_skills: scored?.matchedSkills ?? null,
        missing_skills: scored?.missingSkills ?? null,
        found_at: new Date().toISOString(),
      };

      if (structured.success) {
        jobRecord.about_role = structured.data.aboutRole;
        jobRecord.responsibilities = structured.data.responsibilities;
        jobRecord.requirements = structured.data.requirements;
        jobRecord.nice_to_have = structured.data.niceToHave;
        jobRecord.benefits = structured.data.benefits;
        jobRecord.about_company = structured.data.aboutCompany;
      } else {
        jobRecord.about_role = fullDescription ?? job.description;
      }

      const { data: saved, error: saveError } = await insforge.database
        .from("jobs")
        .insert(jobRecord)
        .select("id")
        .single();

      if (saveError) {
        console.error("[agent/adzuna] Failed to save job:", saveError);
        await insforge.database.from("agent_logs").insert({
          run_id: runId,
          user_id: userId,
          message: `Failed to save job "${job.title}" at ${job.company.display_name}: ${saveError.message}`,
          level: "error",
        });
        continue;
      }

      if (saved) {
        jobMatchScores.push({ id: saved.id, match_score: matchScore });
      }

      await insforge.database.from("agent_logs").insert({
        run_id: runId,
        user_id: userId,
        message: `Scored "${job.title}" at ${job.company.display_name}: ${matchScore}/100${isStrong ? " (strong match)" : ""}`,
        level: isStrong ? "success" : "info",
        job_id: saved?.id ?? null,
      });
    } catch (error) {
      console.error("[agent/adzuna] Failed to process job:", error);
      await insforge.database.from("agent_logs").insert({
        run_id: runId,
        user_id: userId,
        message: `Failed to score/save job "${job.title}" at ${job.company.display_name}: ${error}`,
        level: "error",
      });
    }
  }

  return {
    jobsFound: jobMatchScores.length,
    strongMatches,
    jobMatchScores,
    locationMatched,
  };
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { discoverAndScoreJobs } from "@/agent/adzuna";
import { trackServerEvent } from "@/lib/analytics-server";
import type { ProfileFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: userError,
    } = await insforge.auth.getCurrentUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { jobTitle, location, experience } = body;

    if (!jobTitle || typeof jobTitle !== "string" || !jobTitle.trim()) {
      return NextResponse.json(
        { success: false, error: "Job title is required" },
        { status: 400 },
      );
    }

    const { data: profileData } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const profile: ProfileFormData | null = profileData
      ? {
          fullName: profileData.full_name ?? "",
          email: profileData.email ?? "",
          phone: profileData.phone ?? "",
          location: profileData.location ?? "",
          linkedinUrl: profileData.linkedin_url ?? "",
          portfolioUrl: profileData.portfolio_url ?? "",
          workAuthorization: profileData.work_authorization ?? "",
          currentTitle: profileData.current_title ?? "",
          experienceLevel: profileData.experience_level ?? "",
          yearsExperience: profileData.years_experience
            ? String(profileData.years_experience)
            : "",
          skills: profileData.skills ?? [],
          industries: profileData.industries ?? [],
          workExperience: profileData.work_experience ?? [],
          education: profileData.education ?? {
            degree: "",
            field: "",
            institution: "",
            year: "",
          },
          jobTitlesSeeking: profileData.job_titles_seeking ?? [],
          remotePreference: profileData.remote_preference ?? "",
          salaryExpectation: profileData.salary_expectation ?? "",
          preferredLocations: profileData.preferred_locations ?? [],
          coverLetterTone: profileData.cover_letter_tone ?? "",
        }
      : null;

    const { data: run, error: runError } = await insforge.database
      .from("agent_runs")
      .insert({
        user_id: user.id,
        status: "running",
        job_title_searched: jobTitle.trim(),
        location_searched: location?.trim() || null,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (runError || !run) {
      return NextResponse.json(
        { success: false, error: "Failed to create agent run" },
        { status: 500 },
      );
    }

    await trackServerEvent("job_search_started", user.id, {
      userId: user.id,
      jobTitle: jobTitle.trim(),
      location: location?.trim() || "",
    });

    const result = await discoverAndScoreJobs(
      jobTitle.trim(),
      location?.trim() || "",
      profile,
      user.id,
      run.id,
      experience,
    );

    for (const saved of result.jobMatchScores) {
      await trackServerEvent("job_found", user.id, {
        userId: user.id,
        source: "search",
        matchScore: saved.match_score,
      });
    }

    await insforge.database
      .from("agent_runs")
      .update({
        status: "completed",
        jobs_found: result.jobsFound,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    revalidatePath("/find-jobs");

    return NextResponse.json({
      success: true,
      jobsFound: result.jobsFound,
      strongMatches: result.strongMatches,
      locationMatched: result.locationMatched,
    });
  } catch (error) {
    console.error("[api/agent/find]", error);
    return NextResponse.json(
      { success: false, error: "Failed to find jobs" },
      { status: 500 },
    );
  }
}

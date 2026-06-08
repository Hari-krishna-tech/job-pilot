"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { isProfileComplete } from "@/lib/profile-utils";
import type { ProfileFormData } from "@/types";

function toSnakeCase(data: ProfileFormData) {
  return {
    full_name: data.fullName || null,
    email: data.email || null,
    phone: data.phone || null,
    location: data.location || null,
    linkedin_url: data.linkedinUrl || null,
    portfolio_url: data.portfolioUrl || null,
    work_authorization: data.workAuthorization || null,
    current_title: data.currentTitle || null,
    experience_level: data.experienceLevel || null,
    years_experience: data.yearsExperience ? parseInt(data.yearsExperience, 10) : null,
    skills: data.skills,
    industries: data.industries,
    work_experience: data.workExperience.length > 0 ? data.workExperience : null,
    education:
      data.education.degree ||
      data.education.field ||
      data.education.institution ||
      data.education.year
        ? data.education
        : null,
    job_titles_seeking: data.jobTitlesSeeking,
    remote_preference: data.remotePreference || null,
    preferred_locations: data.preferredLocations,
    salary_expectation: data.salaryExpectation || null,
    cover_letter_tone: data.coverLetterTone || null,
    resume_pdf_url: null as string | null,
    is_complete: isProfileComplete(data),
  };
}

export async function saveProfile(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: userError,
    } = await insforge.auth.getCurrentUser();

    if (userError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    const profileJson = formData.get("profile") as string;
    const formValues: ProfileFormData = JSON.parse(profileJson);

    let resumeUrl: string | null = null;

    const resumeFile = formData.get("resume") as File | null;
    if (resumeFile && resumeFile.size > 0) {
      const { data: uploaded, error: uploadError } = await insforge.storage
        .from("resumes")
        .upload(`resumes/${user.id}/resume.pdf`, resumeFile);

      if (uploadError) {
        console.error("[actions/profile] upload:", uploadError);
        return { success: false, error: "Failed to upload resume" };
      }

      resumeUrl = uploaded?.url ?? null;
    }

    const profile = toSnakeCase(formValues);
    if (resumeUrl) {
      profile.resume_pdf_url = resumeUrl;
    }

    const { data: existing } = await insforge.database
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await insforge.database
        .from("profiles")
        .update(profile)
        .eq("id", user.id);

      if (error) {
        console.error("[actions/profile] update:", error);
        return { success: false, error: "Failed to save profile" };
      }
    } else {
      const { error } = await insforge.database
        .from("profiles")
        .insert({ ...profile, id: user.id });

      if (error) {
        console.error("[actions/profile] insert:", error);
        return { success: false, error: "Failed to save profile" };
      }
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("[actions/profile]", error);
    return { success: false, error: "Failed to save profile" };
  }
}

import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { ProfileFormData } from "@/types";

const EMPTY_DATA: ProfileFormData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  portfolioUrl: "",
  workAuthorization: "",
  currentTitle: "",
  experienceLevel: "",
  yearsExperience: "",
  skills: [],
  industries: [],
  workExperience: [],
  education: {
    degree: "",
    field: "",
    institution: "",
    year: "",
  },
  jobTitlesSeeking: [],
  remotePreference: "",
  salaryExpectation: "",
  preferredLocations: [],
  coverLetterTone: "",
};

function dbToFormData(db: Record<string, unknown>): ProfileFormData {
  return {
    fullName: (db.full_name as string) ?? "",
    email: (db.email as string) ?? "",
    phone: (db.phone as string) ?? "",
    location: (db.location as string) ?? "",
    linkedinUrl: (db.linkedin_url as string) ?? "",
    portfolioUrl: (db.portfolio_url as string) ?? "",
    workAuthorization: (db.work_authorization as string) ?? "",
    currentTitle: (db.current_title as string) ?? "",
    experienceLevel: (db.experience_level as string) ?? "",
    yearsExperience: db.years_experience != null ? String(db.years_experience) : "",
    skills: (db.skills as string[]) ?? [],
    industries: (db.industries as string[]) ?? [],
    workExperience: (db.work_experience as ProfileFormData["workExperience"]) ?? [],
    education: (db.education as ProfileFormData["education"]) ?? {
      degree: "",
      field: "",
      institution: "",
      year: "",
    },
    jobTitlesSeeking: (db.job_titles_seeking as string[]) ?? [],
    remotePreference: (db.remote_preference as string) ?? "",
    salaryExpectation: (db.salary_expectation as string) ?? "",
    preferredLocations: (db.preferred_locations as string[]) ?? [],
    coverLetterTone: (db.cover_letter_tone as string) ?? "",
  };
}

export default async function ProfilePage() {
  let userId = "";
  let userEmail = "";
  let existingProfile: ProfileFormData | null = null;
  let resumeUrl: string | null = null;

  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error,
    } = await insforge.auth.getCurrentUser();

    if (error || !user) redirect("/login");

    userId = user.id;
    userEmail = user.email ?? "";

    const { data: profileData } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileData) {
      existingProfile = dbToFormData(profileData);
      resumeUrl = (profileData.resume_pdf_url as string) ?? null;
    }
  } catch (err) {
    console.error("[profile]", err);
    redirect("/login");
  }

  const initialData: ProfileFormData = existingProfile ?? {
    ...EMPTY_DATA,
    email: userEmail,
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:p-8">
      <h1 className="mb-6 text-base font-semibold leading-6 text-text-primary">
        Profile
      </h1>

      <div className="space-y-6">
        <CompletionIndicator data={initialData} />
        <ProfileForm initialData={initialData} resumeUrl={resumeUrl} />
      </div>
    </div>
  );
}

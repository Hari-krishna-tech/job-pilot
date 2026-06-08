import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Document, renderToBuffer } from "@react-pdf/renderer";
import { createInsforgeServer } from "@/lib/insforge-server";
import { generateResumeContent } from "@/agent/generator";
import { ResumeTemplate } from "@/components/profile/ResumeTemplate";
import type { ProfileFormData } from "@/types";

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
    yearsExperience:
      db.years_experience != null ? String(db.years_experience) : "",
    skills: (db.skills as string[]) ?? [],
    industries: (db.industries as string[]) ?? [],
    workExperience:
      (db.work_experience as ProfileFormData["workExperience"]) ?? [],
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

export async function POST() {
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

    const { data: profileData } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileData) {
      return NextResponse.json(
        { success: false, error: "No profile found. Please save your profile first." },
        { status: 400 },
      );
    }

    const profile = dbToFormData(profileData);

    if (!profile.fullName || profile.skills.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your profile needs a name and at least one skill before generating a resume.",
        },
        { status: 400 },
      );
    }

    const result = await generateResumeContent(profile);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      );
    }

    const pdfBuffer = await renderToBuffer(
      <Document>
        <ResumeTemplate content={result.data} />
      </Document>,
    );

    const arrayBuf = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength,
    ) as ArrayBuffer;

    const pdfBlob = new Blob([arrayBuf], { type: "application/pdf" });

    const { data: uploaded, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(`resumes/${user.id}/resume.pdf`, pdfBlob);

    if (uploadError) {
      console.error("[api/resume/generate] upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload generated resume" },
        { status: 500 },
      );
    }

    const resumeUrl = uploaded?.url ?? null;

    console.log("[api/resume/generate] uploaded url:", resumeUrl);

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: resumeUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("[api/resume/generate] update error:", updateError);
    }

    revalidatePath("/profile");

    return NextResponse.json({ success: true, data: { resumeUrl } });
  } catch (err) {
    console.error("[api/resume/generate]", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate resume" },
      { status: 500 },
    );
  }
}

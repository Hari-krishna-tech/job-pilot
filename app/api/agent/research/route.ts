import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { researchCompany } from "@/agent/research";
import { trackServerEvent } from "@/lib/analytics-server";

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
    const { jobId } = body;

    if (!jobId || typeof jobId !== "string" || !jobId.trim()) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 },
      );
    }

    const { data: jobs } = await insforge.database
      .from("jobs")
      .select("id, company")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!jobs) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    const result = await researchCompany(jobId, user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      );
    }

    const companyName = (jobs as { company?: string }).company || "";

    await trackServerEvent("company_researched", user.id, {
      userId: user.id,
      jobId,
      company: companyName,
    });

    await trackServerEvent("company_dossier_generated", user.id, {
      userId: user.id,
      jobId,
      company: companyName,
    });

    revalidatePath(`/find-jobs/${jobId}`);

    return NextResponse.json({
      success: true,
      dossier: result.dossier,
    });
  } catch (error) {
    console.error("[api/agent/research]", error);
    return NextResponse.json(
      { success: false, error: "Failed to research company" },
      { status: 500 },
    );
  }
}

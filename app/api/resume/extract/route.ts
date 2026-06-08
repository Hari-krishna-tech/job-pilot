import { NextResponse } from "next/server";
import { PdfReader } from "pdfreader";
import { createInsforgeServer } from "@/lib/insforge-server";
import { extractProfile } from "@/agent/extractor";

function extractTextFromPdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const items: string[] = [];

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(new Error(err));
        return;
      }

      if (!item) {
        resolve(items.join("\n"));
        return;
      }

      if (item.text) {
        items.push(item.text);
      }
    });
  });
}

async function getPdfBuffer(userId: string, insforge: Awaited<ReturnType<typeof createInsforgeServer>>, formData: FormData): Promise<Buffer | null> {
  const file = formData.get("resume") as File | null;

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const path = `resumes/${userId}/resume.pdf`;
  console.log("[api/resume/extract] downloading from storage:", { userId, path });

  const { data: blob, error } = await insforge.storage
    .from("resumes")
    .download(path);

  if (error) {
    console.error("[api/resume/extract] storage download error:", error);
    return null;
  }

  if (!blob) {
    console.error("[api/resume/extract] storage download returned null blob");
    return null;
  }

  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
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

    const formData = await req.formData();

    const buffer = await getPdfBuffer(user.id, insforge, formData);
    if (!buffer) {
      console.error("[api/resume/extract] buffer is null — no resume file or storage download failed");
      return NextResponse.json(
        { success: false, error: "No resume found. Please upload a resume first." },
        { status: 400 },
      );
    }

    let pdfText: string;
    try {
      pdfText = await extractTextFromPdf(buffer);
    } catch (err) {
      console.error("[api/resume/extract] pdf-parse error:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Could not read this PDF. Please try a different file.",
        },
        { status: 400 },
      );
    }

    if (!pdfText || pdfText.trim().length < 30) {
      console.error("[api/resume/extract] extracted text too short:", pdfText?.length ?? 0);
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract text from this PDF. Please try a different file.",
        },
        { status: 400 },
      );
    }

    const result = await extractProfile(pdfText);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error("[api/resume/extract]", err);
    return NextResponse.json(
      { success: false, error: "Failed to extract profile data" },
      { status: 500 },
    );
  }
}

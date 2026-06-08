import OpenAI from "openai";
import type { ProfileFormData, ResumeContent } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com",
});

export async function generateResumeContent(
  profile: ProfileFormData,
): Promise<
  { success: true; data: ResumeContent } | { success: false; error: string }
> {
  const system = `You are a professional resume writer. You are given a candidate's profile data and your job is to rewrite it into polished, professional resume content.

Rules:
- NEVER invent facts, skills, experiences, or achievements not present in the input data
- Rewrite work experience responsibilities into action-oriented bullet points with strong verbs and quantifiable impact where the data suggests it
- Write a concise professional summary (2-3 sentences) that synthesizes their total experience, key skills, and career direction
- Format the "dates" field for each work experience as "StartDate — EndDate" or "StartDate — Present" if endDate is empty
- Include ALL skills from the profile (do not drop any)
- Keep contact info exactly as provided — do not modify names, emails, phone numbers, or URLs
- If a section has no meaningful data, return empty string/array for that section

Return ONLY valid JSON matching this exact shape.`;

  const shape = `{
  "professionalSummary": string,
  "workExperience": [{ "company": string, "title": string, "dates": string, "bullets": string[] }],
  "skills": string[],
  "education": { "degree": string, "field": string, "institution": string, "year": string },
  "contactInfo": { "fullName": string, "email": string, "phone": string, "location": string, "linkedinUrl": string, "portfolioUrl": string }
}`;

  const userMessage = `Rewrite this candidate profile into polished resume content.

FULL NAME: ${profile.fullName || "(not provided)"}
EMAIL: ${profile.email || "(not provided)"}
PHONE: ${profile.phone || "(not provided)"}
LOCATION: ${profile.location || "(not provided)"}
LINKEDIN: ${profile.linkedinUrl || "(not provided)"}
PORTFOLIO: ${profile.portfolioUrl || "(not provided)"}
CURRENT TITLE: ${profile.currentTitle || "(not provided)"}
EXPERIENCE LEVEL: ${profile.experienceLevel || "(not provided)"}
YEARS OF EXPERIENCE: ${profile.yearsExperience || "(not provided)"}
SKILLS: ${profile.skills.length > 0 ? profile.skills.join(", ") : "(none)"}
INDUSTRIES: ${profile.industries.length > 0 ? profile.industries.join(", ") : "(none)"}

WORK EXPERIENCE:
${profile.workExperience
  .map(
    (exp) =>
      `- ${exp.jobTitle} at ${exp.companyName} (${exp.startDate || "?"} — ${exp.endDate || "Present"})${
        exp.responsibilities ? `\n  Responsibilities: ${exp.responsibilities}` : ""
      }`,
  )
  .join("\n") || "(no work experience provided)"}

EDUCATION:
${profile.education.degree ? `${profile.education.degree} in ${profile.education.field} from ${profile.education.institution} (${profile.education.year})` : "(not provided)"}

JOB TITLES SEEKING: ${profile.jobTitlesSeeking.length > 0 ? profile.jobTitlesSeeking.join(", ") : "(not provided)"}

Return ONLY valid JSON matching this shape:
${shape}`;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { success: false, error: "No response from AI" };
    }

    const parsed = JSON.parse(content) as ResumeContent;

    if (!parsed.workExperience) parsed.workExperience = [];
    if (!parsed.skills) parsed.skills = [];
    if (!parsed.education) {
      parsed.education = { degree: "", field: "", institution: "", year: "" };
    }
    if (!parsed.contactInfo) {
      parsed.contactInfo = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        linkedinUrl: profile.linkedinUrl,
        portfolioUrl: profile.portfolioUrl,
      };
    }

    return { success: true, data: parsed };
  } catch (err) {
    console.error("[agent/generator]", err);
    return { success: false, error: "Failed to generate resume content" };
  }
}

import OpenAI from "openai";
import type { ProfileFormData } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com",
});

export async function extractProfile(
  text: string,
): Promise<{ success: true; data: ProfileFormData } | { success: false; error: string }> {
  const system = `You are a precise resume parser. Extract EVERY field you can find from this resume text.
Return fields as-is from the text — do not invent or guess values.
If a field is truly not findable, return an empty string, empty array, or the empty object shape provided.

Rules:
- fullName: full name of the person
- email: email address
- phone: phone number
- location: city, state, or country if visible
- linkedinUrl: LinkedIn URL if present
- portfolioUrl: portfolio, GitHub, or personal website URL if present
- workAuthorization: infer nothing unless explicitly stated
- currentTitle: most recent job title
- experienceLevel: "junior", "mid", "senior", or "lead" — infer from years and titles
- yearsExperience: total years as integer string (e.g. "5") — estimate from work history date ranges
- skills: array of technical and soft skills found in resume
- industries: array of industries the person worked in (e.g. "Fintech", "Healthcare")
- workExperience: up to 3 roles. Each has: id (uuid string), companyName, jobTitle, startDate ("YYYY-MM"), endDate ("YYYY-MM" or "" if currently working), currentlyWorking (boolean), responsibilities (paragraph)
- education: object with degree, field, institution, year — empty string for each if not found
- jobTitlesSeeking: array of target job titles — empty unless explicitly stated
- remotePreference: "remote", "onsite", "hybrid", or "" — only if stated
- salaryExpectation: salary range or number as string — only if stated
- preferredLocations: array of preferred locations — only if stated
- coverLetterTone: "formal", "casual", "enthusiastic", or "" — only if stated

Return ONLY valid JSON matching this exact shape.`;

  const shape = `{
  "fullName": string,
  "email": string,
  "phone": string,
  "location": string,
  "linkedinUrl": string,
  "portfolioUrl": string,
  "workAuthorization": string,
  "currentTitle": string,
  "experienceLevel": string,
  "yearsExperience": string,
  "skills": string[],
  "industries": string[],
  "workExperience": [{ "id": string, "companyName": string, "jobTitle": string, "startDate": string, "endDate": string, "currentlyWorking": boolean, "responsibilities": string }],
  "education": { "degree": string, "field": string, "institution": string, "year": string },
  "jobTitlesSeeking": string[],
  "remotePreference": string,
  "salaryExpectation": string,
  "preferredLocations": string[],
  "coverLetterTone": string
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Extract structured profile data from this resume text:\n\n${text}\n\nReturn JSON matching this shape:\n${shape}` },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { success: false, error: "No response from AI" };
    }

    const parsed = JSON.parse(content) as ProfileFormData;

    if (!parsed.skills) parsed.skills = [];
    if (!parsed.industries) parsed.industries = [];
    if (!parsed.workExperience) parsed.workExperience = [];
    if (!parsed.jobTitlesSeeking) parsed.jobTitlesSeeking = [];
    if (!parsed.preferredLocations) parsed.preferredLocations = [];
    if (!parsed.education) {
      parsed.education = { degree: "", field: "", institution: "", year: "" };
    }
    if (!parsed.yearsExperience) parsed.yearsExperience = "";

    return { success: true, data: parsed };
  } catch (err) {
    console.error("[agent/extractor]", err);
    return { success: false, error: "Failed to extract profile data" };
  }
}

export type StructuredJobDescription = {
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  aboutCompany: string;
};

export async function extractJobDescription(
  rawDescription: string,
  title: string,
  company: string,
): Promise<{ success: true; data: StructuredJobDescription } | { success: false; error: string }> {
  const system = `You are a precise job description parser. Given a raw job posting, extract and structure it into the fields below.

Rules:
- aboutRole: 2-3 sentence summary of the role. Write it in clean prose.
- responsibilities: bullet-point array of what the person in this role will do
- requirements: bullet-point array of required qualifications, skills, and experience
- niceToHave: bullet-point array of preferred/favourable qualifications. Empty array if none mentioned.
- benefits: bullet-point array of perks, compensation details, and benefits offered. Empty array if none mentioned.
- aboutCompany: 2-3 sentence summary about the hiring company from the job posting

Every bullet must be a single complete sentence — no fragments.
If the raw description is truncated or missing any section, extract what you can and leave empty arrays for what is absent.
Never invent or guess content not present in the raw description.

Return ONLY valid JSON.`;

  const shape = `{
  "aboutRole": string,
  "responsibilities": string[],
  "requirements": string[],
  "niceToHave": string[],
  "benefits": string[],
  "aboutCompany": string
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Parse this job posting for "${title}" at ${company} into structured fields:\n\n${rawDescription}\n\nReturn JSON matching this shape:\n${shape}`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { success: false, error: "No response from AI" };
    }

    const parsed = JSON.parse(content) as StructuredJobDescription;

    parsed.responsibilities = parsed.responsibilities || [];
    parsed.requirements = parsed.requirements || [];
    parsed.niceToHave = parsed.niceToHave || [];
    parsed.benefits = parsed.benefits || [];

    return { success: true, data: parsed };
  } catch (err) {
    console.error("[agent/extractor/extractJobDescription]", err);
    return { success: false, error: "Failed to extract job description" };
  }
}

import OpenAI from "openai";
import type { ProfileFormData, AdzunaJob, ScoredJob } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com",
});

const systemPrompt = `You are a precise job matching assistant. Score how well this candidate's profile matches a job posting on a 0-100 scale.

Scoring guidelines:
- 0-40: Poor match — major skill gaps or entirely different domain
- 41-60: Below average — some relevant skills but significant gaps
- 61-80: Good match — most required skills present, manageable gaps
- 81-100: Excellent match — strong alignment, few or no gaps

If a TARGET EXPERIENCE LEVEL is specified, factor it into the score:
- Penalize jobs that require significantly more or fewer years than the target
- Jobs requiring experience within +/- 1 year of the target should score higher
- Jobs requiring 3+ years beyond the target should drop at least 15 points
- Jobs requiring 3+ years less than the target should drop at least 10 points

Rules:
- matchScore: integer 0-100
- matchReason: one clear, specific paragraph explaining the score. Include how experience level affected the score. Name concrete skills that align and concrete gaps. Be honest — do not inflate.
- matchedSkills: array of skills from the candidate's profile that the job needs
- missingSkills: array of skills the job requires that the candidate lacks. Only list real, concrete skills — do not invent requirements.

Return ONLY valid JSON matching this shape:
{
  "matchScore": number,
  "matchReason": string,
  "matchedSkills": string[],
  "missingSkills": string[]
}`;

export async function scoreJob(
  job: AdzunaJob,
  profile: ProfileFormData | null,
  experience?: string,
): Promise<ScoredJob | null> {
  const profileSummary = profile
    ? `Current Title: ${profile.currentTitle || "Not specified"}
Experience: ${profile.yearsExperience || "?"} years (${profile.experienceLevel || "unspecified"} level)
Skills: ${profile.skills.length > 0 ? profile.skills.join(", ") : "None listed"}
Industries: ${profile.industries.length > 0 ? profile.industries.join(", ") : "None listed"}
Work History: ${profile.workExperience.length > 0 ? profile.workExperience.map((w) => `${w.jobTitle} at ${w.companyName}`).join("; ") : "None listed"}
Job Titles Seeking: ${profile.jobTitlesSeeking.length > 0 ? profile.jobTitlesSeeking.join(", ") : "Not specified"}`
    : "No profile data available. Score based on job description alone.";

  const experienceLine = experience
    ? `\nTARGET EXPERIENCE LEVEL: ${experience}`
    : "";

  const userMessage = `JOB POSTING:
Title: ${job.title}
Company: ${job.company.display_name}
Location: ${job.location.display_name}
Description: ${job.description}
${experienceLine}
CANDIDATE PROFILE:
${profileSummary}

Return ONLY valid JSON matching the required shape.`;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as ScoredJob;

    if (typeof parsed.matchScore !== "number" || parsed.matchScore < 0 || parsed.matchScore > 100) {
      return null;
    }

    return {
      matchScore: Math.round(parsed.matchScore),
      matchReason: parsed.matchReason || "",
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
    };
  } catch (err) {
    console.error("[agent/matcher]", err);
    return null;
  }
}

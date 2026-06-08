import OpenAI from "openai";
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import { createBrowserbase } from "@/lib/browserbase";
import { createInsforgeServer } from "@/lib/insforge-server";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com",
});

const homepageSchema = z.object({
  oneLiner: z.string().describe("What the company does in one sentence"),
  productSummary: z
    .string()
    .describe("What they build/sell and who it's for"),
  signals: z
    .array(z.string())
    .describe("Funding, notable customers, scale, mission, recent news"),
  pageLinks: z
    .array(
      z.object({
        url: z.string(),
        kind: z.enum([
          "about",
          "careers",
          "blog",
          "engineering",
          "product",
          "team",
          "other",
        ]),
      }),
    )
    .describe("Internal links worth visiting"),
});

const subPageSchema = z.object({
  keyPoints: z.array(z.string()),
  technologies: z
    .array(z.string())
    .describe("Specific languages, frameworks, tools, platforms"),
  valuesOrCulture: z
    .array(z.string())
    .describe("Stated values, working style, team norms"),
  notable: z
    .array(z.string())
    .describe("Customers, funding, scale, projects, awards"),
});

const dossierSchema = z.object({
  companyOverview: z.string(),
  techStack: z.array(z.string()),
  culture: z.array(z.string()),
  whyThisRole: z.string(),
  yourEdge: z.array(z.string()),
  gapsToAddress: z.array(z.string()),
  smartQuestions: z.array(z.string()),
  interviewPrep: z.array(z.string()),
  sources: z.array(z.string()),
});

export type CompanyDossier = z.infer<typeof dossierSchema>;

type HomepageData = z.infer<typeof homepageSchema>;
type SubPageData = z.infer<typeof subPageSchema>;

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

const JOB_BOARD_DOMAINS = [
  "adzuna.",
  "indeed.",
  "linkedin.com",
  "glassdoor.",
  "monster.",
  "ziprecruiter.",
  "simplyhired.",
  "snagajob.",
  "dice.com",
  "careerbuilder.",
  "jobstreet.",
  "seek.",
  "naukri.",
  "foundit.",
];

const ATS_DOMAINS = [
  "greenhouse.io",
  "lever.co",
  "workday.com",
  "bamboohr.com",
  "jobvite.com",
  "icims.com",
  "taleo.net",
  "successfactors.",
  "smartrecruiters.com",
  "ashbyhq.com",
  "breezy.hr",
  "workable.com",
  "recruitee.com",
  "teamtailor.com",
  "personio.",
];

function isJobBoardOrAts(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  for (const domain of JOB_BOARD_DOMAINS) {
    if (lower.includes(domain)) return true;
  }
  for (const domain of ATS_DOMAINS) {
    if (lower.includes(domain)) return true;
  }
  return false;
}

function companyNameToDomain(companyName: string): string {
  const safeName = companyName
    .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Co\.?).*$/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  return `https://www.${safeName}.com`;
}

async function deriveHomepageUrl(
  redirectUrl: string | null,
): Promise<string | null> {
  let resolvedHostname = "";
  try {
    const resp = await fetch(redirectUrl || "", {
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    try {
      resolvedHostname = new URL(resp.url).hostname;
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }

  if (resolvedHostname && !isJobBoardOrAts(resolvedHostname)) {
    try {
      const parts = resolvedHostname.split(".");
      const root =
        parts.length >= 2 ? parts.slice(-2).join(".") : resolvedHostname;
      const candidate = `https://${root}`;
      if (!isJobBoardOrAts(new URL(candidate).hostname)) {
        return candidate;
      }
    } catch {
      // fall through
    }
  }

  return null;
}

async function searchForCompanySite(
  stagehand: Stagehand,
  companyName: string,
): Promise<string> {
  const page = stagehand.context.activePage()!;
  const query = encodeURIComponent(`${companyName} company official website`);
  const searchUrl = `https://www.google.com/search?q=${query}`;

  console.log("[agent/research] Google searching:", companyName);
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1500));

  try {
    const result = await stagehand.act(
      "Click on the first organic (non-ad, non-sponsored) search result link that leads to the company's official website",
      { timeout: 20000 },
    );
    console.log("[agent/research] Search click result:", result.success, result.message);
  } catch (err) {
    console.error("[agent/research] Google search click failed:", err);
    return companyNameToDomain(companyName);
  }

  const landedUrl = page.url();
  console.log("[agent/research] Landed on:", landedUrl);

  if (!landedUrl || landedUrl.includes("google.com")) {
    console.log("[agent/research] Search did not navigate away from Google, falling back");
    return companyNameToDomain(companyName);
  }

  return landedUrl;
}

function buildResearchSummary(
  homepage: HomepageData,
  subPages: SubPageData[],
  sources: string[],
) {
  const allTechnologies = new Set<string>();
  const allCulture: string[] = [];
  const allNotable: string[] = [];
  const allKeyPoints: string[] = [];

  for (const sp of subPages) {
    for (const t of sp.technologies) allTechnologies.add(t);
    allCulture.push(...sp.valuesOrCulture);
    allNotable.push(...sp.notable);
    allKeyPoints.push(...sp.keyPoints);
  }

  return {
    oneLiner: homepage.oneLiner || "",
    productSummary: homepage.productSummary || "",
    signals: homepage.signals || [],
    keyPoints: allKeyPoints,
    technologies: [...allTechnologies],
    culture: allCulture,
    notable: allNotable,
    sources,
  };
}

const synthesisSystemPrompt = `You are a sharp career strategist preparing a candidate to apply for a specific role. You are given (a) research collected from the company's own website, (b) the job posting, and (c) the candidate's profile. Produce a concise, concrete briefing that gives this specific candidate an edge for this specific role.

Rules:
- Ground every company claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what's inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
- Keep every item tight: one or two sentences. No fluff.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": string,
  "techStack": string[],
  "culture": string[],
  "whyThisRole": string,
  "yourEdge": string[],
  "gapsToAddress": string[],
  "smartQuestions": string[],
  "interviewPrep": string[],
  "sources": string[]
}`;

export async function researchCompany(
  jobId: string,
  userId: string,
): Promise<{ success: true; dossier: CompanyDossier } | { success: false; error: string }> {
  const insforge = await createInsforgeServer();

  const { data: jobs } = await insforge.database
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId);

  const job = jobs?.[0] as Record<string, unknown> | undefined;
  if (!job) {
    return { success: false, error: "Job not found" };
  }

  const { data: profileData } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const profile = profileData as Record<string, unknown> | null;

  const redirectUrl = (job.source_url as string) || null;
  const companyName = (job.company as string) || "";
  let homepageUrl = await deriveHomepageUrl(redirectUrl);

  let companyResearch: ReturnType<typeof buildResearchSummary> | null = null;

  const bb = createBrowserbase();
  let stagehand: Stagehand | null = null;

  try {
    console.log("[agent/research] Creating Browserbase session...");
    const session = await bb.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      timeout: 120,
    });
    console.log("[agent/research] Session created:", session.id);

    stagehand = new Stagehand({
      env: "BROWSERBASE",
      apiKey: process.env.BROWSERBASE_API_KEY!,
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      browserbaseSessionID: session.id,
      model: {
        modelName: "deepseek/deepseek-chat",
        apiKey: process.env.DEEPSEEK_API_KEY!,
      },
      disablePino: true,
    });

    console.log("[agent/research] Initializing Stagehand...");
    await stagehand.init();
    const page = stagehand.context.activePage()!;

    if (!homepageUrl) {
      console.log("[agent/research] Redirect URL is a job board/ATS, searching Google for:", companyName);
      homepageUrl = await searchForCompanySite(stagehand, companyName);
    }

    console.log("[agent/research] Navigating to:", homepageUrl);

    const sources: string[] = [homepageUrl];

    await page.goto(homepageUrl, { waitUntil: "domcontentloaded" });
    console.log("[agent/research] Homepage loaded, extracting...");

    const homepage = await stagehand.extract(
      "This is a company's homepage. Capture what the company actually does, who it's for, and any concrete signals (funding, customers, scale, mission, recent launches). Then find the internal links most worth visiting to research them as an employer.",
      homepageSchema,
    );

    console.log("[agent/research] Homepage extraction result — oneLiner:", !!homepage.oneLiner, "productSummary:", !!homepage.productSummary, "signals:", homepage.signals?.length, "pageLinks:", homepage.pageLinks?.length);

    if (!homepage.oneLiner && !homepage.productSummary) {
      console.log("[agent/research] Homepage returned no meaningful content, skipping sub-pages");
      await stagehand.close();
      stagehand = null;
    } else {
      const subPageData: SubPageData[] = [];

      const priorityKinds = [
        "about",
        "engineering",
        "blog",
        "product",
        "team",
        "careers",
        "other",
      ];
      const linksByKind = new Map<string, string>();
      for (const link of homepage.pageLinks || []) {
        if (!linksByKind.has(link.kind)) {
          linksByKind.set(link.kind, resolveUrl(link.url, homepageUrl));
        }
      }

      const subLinks = priorityKinds
        .filter((k) => linksByKind.has(k))
        .map((k) => ({ kind: k, url: linksByKind.get(k)! }))
        .slice(0, 3);

      console.log("[agent/research] Sub-pages to visit:", subLinks.length);
      for (const link of subLinks) {
        try {
          console.log("[agent/research] Navigating to sub-page:", link.url);
          await page.goto(link.url, { waitUntil: "domcontentloaded" });

          const result = await stagehand!.extract(
            "Extract substance that helps a candidate understand this company before applying: what they do, their values and how they work, the specific technologies and tools they use, notable projects or customers, and how the team operates. Ignore nav, footers, cookie banners, and generic marketing copy.",
            subPageSchema,
          );

          subPageData.push(result);
          sources.push(link.url);
        } catch {
          await insforge.database.from("agent_logs").insert({
            user_id: userId,
            message: `Sub-page extraction failed for ${link.url}`,
            level: "warning",
          });
        }
      }

      await stagehand.close();
      stagehand = null;

      companyResearch = buildResearchSummary(homepage, subPageData, sources);
    }
  } catch (error) {
    console.error("[agent/research] Browser research failed:", error);
    if (stagehand) {
      try {
        await stagehand.close();
      } catch (closeErr) {
        console.error("[agent/research] Failed to close stagehand:", closeErr);
      }
    }
    await insforge.database.from("agent_logs").insert({
      user_id: userId,
      message: `Browser research failed for ${companyName}: ${error}`,
      level: "warning",
    });
  }

  const jobTitle = (job.title as string) || "";
  const jobDescription =
    (job.about_role as string) ||
    (job.description as string) ||
    "";
  const matchedSkills = (job.matched_skills as string[]) || [];
  const missingSkills = (job.missing_skills as string[]) || [];

  console.log("[agent/research] Starting Deepseek synthesis — hasResearch:", !!companyResearch);

  const userPrompt = `COMPANY RESEARCH (from their website):
${companyResearch ? JSON.stringify(companyResearch) : "No website research available. Use the job posting and candidate profile to synthesize the best possible briefing."}

JOB POSTING:
Title: ${jobTitle}
Company: ${companyName}
Description: ${jobDescription}
Matched skills: ${matchedSkills.join(", ")}
Missing skills: ${missingSkills.join(", ")}

CANDIDATE PROFILE:
Current title: ${profile ? (profile.current_title as string) || "Not specified" : "Not available"}
Experience: ${profile ? ((profile.years_experience as number) ?? "?") + " years, " + ((profile.experience_level as string) || "unspecified") + " level" : "Not available"}
Skills: ${profile && Array.isArray(profile.skills) ? (profile.skills as string[]).join(", ") : "None listed"}
Work history: ${profile && profile.work_experience ? JSON.stringify(profile.work_experience) : "None listed"}`;

  let dossier: CompanyDossier;

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 2000,
      messages: [
        { role: "system", content: synthesisSystemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { success: false, error: "No response from AI" };
    }

    const parsed = JSON.parse(content);
    dossier = dossierSchema.parse(parsed);
  } catch (err) {
    console.error("[agent/research] Deepseek synthesis failed:", err);
    return { success: false, error: "Failed to synthesize company research" };
  }

  const { error: updateError } = await insforge.database
    .from("jobs")
    .update({ company_research: dossier })
    .eq("id", jobId)
    .eq("user_id", userId);

  if (updateError) {
    console.error("[agent/research] Failed to save dossier:", updateError);
    return { success: false, error: "Failed to save research results" };
  }

  await insforge.database.from("agent_logs").insert({
    user_id: userId,
    message: `Company research completed for ${companyName} — dossier saved.`,
    level: "success",
    job_id: jobId,
  });

  return { success: true, dossier };
}

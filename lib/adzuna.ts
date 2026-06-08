import type { AdzunaJob, AdzunaSearchResult } from "@/types";

function detectCountry(location: string): string {
  const lower = location.toLowerCase();
  if (/uk|gb|england|scotland|wales|london|manchester|birmingham/.test(lower))
    return "gb";
  if (/australia|sydney|melbourne|brisbane|perth/.test(lower)) return "au";
  if (/canada|toronto|vancouver|montreal|ottawa/.test(lower)) return "ca";
  if (
    /india|bangalore|bengaluru|chennai|mumbai|delhi|hyderabad|pune|kolkata|noida|gurgaon|gurugram/.test(
      lower,
    )
  )
    return "in";
  return "us";
}

async function callAdzuna(
  country: string,
  jobTitle: string,
  location: string | null,
): Promise<AdzunaJob[]> {
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID!,
    app_key: process.env.ADZUNA_APP_KEY!,
    what: jobTitle,
    category: "it-jobs",
    results_per_page: "10",
    "content-type": "application/json",
  });

  if (location) {
    params.set("where", location);
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Adzuna API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return (data.results || []) as AdzunaJob[];
}

export async function fetchFullDescription(
  redirectUrl: string,
): Promise<string | null> {
  try {
    const response = await fetch(redirectUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; JobPilot/1.0)",
      },
    });

    if (!response.ok) return null;

    const html = await response.text();

    const stripped = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (stripped.length < 200) return null;

    return stripped;
  } catch {
    return null;
  }
}

export async function searchJobs(
  jobTitle: string,
  location: string,
): Promise<AdzunaSearchResult> {
  const country = detectCountry(location);

  if (!location) {
    const results = await callAdzuna(country, jobTitle, null);
    return { jobs: results, locationMatched: false };
  }

  const locationResults = await callAdzuna(country, jobTitle, location);

  if (locationResults.length > 0) {
    return { jobs: locationResults, locationMatched: true };
  }

  const fallbackResults = await callAdzuna(country, jobTitle, null);
  return { jobs: fallbackResults, locationMatched: false };
}

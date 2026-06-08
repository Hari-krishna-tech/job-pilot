import Link from "next/link";
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { formatRelativeTime } from "@/lib/utils";
import { StatsBar } from "@/components/dashboard/StatsBar";
import {
  RecentActivity,
  type ActivityEntry,
  type ActivityDot,
} from "@/components/dashboard/RecentActivity";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import type { ChartDatum } from "@/components/dashboard/JobsOverTimeChart";

const JOB_FOUND_DOT: ActivityDot = {
  ringColor: "bg-success-light",
  innerColor: "bg-success-alt",
};

const COMPANY_RESEARCHED_DOT: ActivityDot = {
  ringColor: "bg-info-light",
  innerColor: "bg-info",
};

async function fetchStats(userId: string) {
  try {
    const insforge = await createInsforgeServer();

    const { count: totalJobs } = await insforge.database
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const { data: scores } = await insforge.database
      .from("jobs")
      .select("match_score")
      .eq("user_id", userId)
      .not("match_score", "is", null);

    const avgMatchRate =
      scores && scores.length > 0
        ? Math.round(
            scores.reduce(
              (sum: number, j: { match_score: number }) =>
                sum + j.match_score,
              0,
            ) / scores.length,
          )
        : 0;

    const { count: companiesResearched } = await insforge.database
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("company_research", "is", null);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: jobsThisWeek } = await insforge.database
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("found_at", sevenDaysAgo.toISOString());

    return {
      totalJobs: totalJobs ?? 0,
      avgMatchRate,
      companiesResearched: companiesResearched ?? 0,
      jobsThisWeek: jobsThisWeek ?? 0,
    };
  } catch (err) {
    console.error("[dashboard/stats]", err);
    return { totalJobs: 0, avgMatchRate: 0, companiesResearched: 0, jobsThisWeek: 0 };
  }
}

async function fetchChartData(
  userId: string,
): Promise<{
  jobsOverTime: ChartDatum[];
  matchScoreDistribution: ChartDatum[];
  companyResearch: ChartDatum[];
}> {
  try {
    const insforge = await createInsforgeServer();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentJobs } = await insforge.database
      .from("jobs")
      .select("found_at, match_score")
      .eq("user_id", userId)
      .gte("found_at", thirtyDaysAgo.toISOString())
      .order("found_at", { ascending: true });

    const jobsByDay = new Map<string, number>();
    const matchScoreBuckets = new Map<string, number>();
    const MATCH_RANGES = [
      { label: "50-60%", min: 50, max: 60 },
      { label: "60-70%", min: 60, max: 70 },
      { label: "70-80%", min: 70, max: 80 },
      { label: "80-90%", min: 80, max: 90 },
      { label: "90-100%", min: 90, max: 101 },
    ];

    for (const range of MATCH_RANGES) {
      matchScoreBuckets.set(range.label, 0);
    }

    for (const job of recentJobs ?? []) {
      const dateStr = new Date(job.found_at as string)
        .toISOString()
        .split("T")[0];
      jobsByDay.set(dateStr, (jobsByDay.get(dateStr) ?? 0) + 1);

      if (typeof job.match_score === "number") {
        for (const range of MATCH_RANGES) {
          if (job.match_score >= range.min && job.match_score < range.max) {
            matchScoreBuckets.set(
              range.label,
              (matchScoreBuckets.get(range.label) ?? 0) + 1,
            );
            break;
          }
        }
      }
    }

    const allDays: ChartDatum[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      allDays.push({ label, value: jobsByDay.get(key) ?? 0 });
    }

    const matchScoreDistribution = MATCH_RANGES.map((range) => ({
      label: range.label,
      value: matchScoreBuckets.get(range.label) ?? 0,
    }));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: researchedJobs } = await insforge.database
      .from("jobs")
      .select("found_at")
      .eq("user_id", userId)
      .not("company_research", "is", null)
      .gte("found_at", sevenDaysAgo.toISOString())
      .order("found_at", { ascending: true });

    const researchByDay = new Map<string, number>();

    for (const job of researchedJobs ?? []) {
      const dateStr = new Date(job.found_at as string)
        .toISOString()
        .split("T")[0];
      researchByDay.set(dateStr, (researchByDay.get(dateStr) ?? 0) + 1);
    }

    const researchDays: ChartDatum[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      researchDays.push({ label, value: researchByDay.get(key) ?? 0 });
    }

    return {
      jobsOverTime: allDays,
      matchScoreDistribution,
      companyResearch: researchDays,
    };
  } catch (err) {
    console.error("[dashboard/charts]", err);
    return { jobsOverTime: [], matchScoreDistribution: [], companyResearch: [] };
  }
}

async function fetchRecentActivity(
  userId: string,
): Promise<ActivityEntry[]> {
  try {
    const insforge = await createInsforgeServer();

    const { data: runs } = await insforge.database
      .from("agent_runs")
      .select("job_title_searched, location_searched, jobs_found, completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5);

    const { data: researchedJobs } = await insforge.database
      .from("jobs")
      .select("company, found_at")
      .eq("user_id", userId)
      .not("company_research", "is", null)
      .order("found_at", { ascending: false })
      .limit(5);

    const raw: { message: string; date: Date; dot: ActivityDot }[] = [];

    for (const run of runs ?? []) {
      const parts: string[] = [];
      parts.push(`Found ${run.jobs_found} jobs`);
      if (run.job_title_searched) {
        parts.push(`for "${run.job_title_searched}"`);
      }
      if (run.location_searched) {
        parts.push(`in ${run.location_searched}`);
      }
      raw.push({
        message: parts.join(" "),
        date: new Date(run.completed_at as string),
        dot: JOB_FOUND_DOT,
      });
    }

    for (const job of researchedJobs ?? []) {
      raw.push({
        message: `Researched ${job.company}`,
        date: new Date(job.found_at as string),
        dot: COMPANY_RESEARCHED_DOT,
      });
    }

    raw.sort((a, b) => b.date.getTime() - a.date.getTime());

    return raw.slice(0, 5).map((item) => ({
      message: item.message,
      timestamp: formatRelativeTime(item.date),
      dot: item.dot,
    }));
  } catch (err) {
    console.error("[dashboard/recent-activity]", err);
    return [];
  }
}

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
    error,
  } = await insforge.auth.getCurrentUser();

  if (error || !user) redirect("/login");

  const stats = await fetchStats(user.id);
  const activities = await fetchRecentActivity(user.id);
  const chartData = await fetchChartData(user.id);

  return (
    <div className="mx-auto max-w-[1440px] p-8">
      <h1 className="text-base font-semibold leading-6 text-text-primary">
        Dashboard
      </h1>

      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - 60 / 100)}`}
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-text-primary">
                60%
              </span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold leading-6 text-text-primary">
                Your profile is incomplete
              </p>
              <p className="mt-1 text-xs leading-4 text-text-muted">
                Add the missing details below to improve your job matches and get
                more accurate AI-powered insights.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
                  PHONE
                </span>
                <span className="inline-flex rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
                  LOCATION
                </span>
                <span className="inline-flex rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
                  EDUCATION
                </span>
              </div>
              <Link
                href="/profile"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        </div>

        <StatsBar
          totalJobs={stats.totalJobs}
          avgMatchRate={stats.avgMatchRate}
          companiesResearched={stats.companiesResearched}
          jobsThisWeek={stats.jobsThisWeek}
        />
        <RecentActivity activities={activities} />
        <AnalyticsCharts
          jobsOverTime={chartData.jobsOverTime}
          matchScoreDistribution={chartData.matchScoreDistribution}
          companyResearch={chartData.companyResearch}
        />
      </div>
    </div>
  );
}

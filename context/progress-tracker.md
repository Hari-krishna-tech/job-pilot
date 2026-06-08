# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** 5 — Dashboard
**Last completed:** 17 Analytics Charts — PostHog Data
**Next:** None — Phase 5 Complete

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [x] 09 Find Jobs Page — Full UI
- [x] 10 Adzuna Job Discovery
- [x] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [x] 12 Job Details Page — Full UI
- [x] 13 Company Research Agent

### Phase 5 — Dashboard

- [x] 14 Dashboard Page — Full UI
- [x] 15 Stats Bar — Real Data
- [x] 16 Recent Activity — Real Data
- [x] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- 10: Adzuna search + DeepSeek scoring in `agent/adzuna.ts` — called from API route, not server action
- 10: API route loads profile (snake_case→camelCase mapping), creates agent_run, passes both to agent
- 10: Agent scores jobs sequentially, skips failures, logs to agent_logs, saves to jobs table directly
- 10: Country detection via substring matching on location (gb/au/ca/us), default us
- 10: jobs.table columns are snake_case — JobRow type matches DB output, JobsTable uses JobRow
- 10: MOCK_JOBS removed — find-jobs page queries jobs table ordered by found_at desc
- 10: SearchControls uses useTransition + fetch POST /api/agent/find + router.refresh() after success
- 10: PostHog events job_search_started and job_found added to ANALYTICS_EVENTS
- 11: Client-side filtering via FindJobsClient wrapper — filters/sorts/paginates in memory. PAGE_SIZE=20. Controlled components (JobFilters, JobsPagination) receive state via props, lift to FindJobsClient.
- 11: Match filters use MATCH_THRESHOLD=70 constant. Sort: match/newest/oldest. Text search: case-insensitive on company + title. Pagination resets to page 1 on filter change.
- 12: Job details page at /find-jobs/[id] — server component fetches job from DB, renders 5 sub-components: JobInfo, MatchScore, JobDescription, CompanyResearch, JobActions
- 12: JobInfo — Back link, company placeholder icon (Building2), title, company, match score bar+percentage badge, View Job Post button, 4 info cards (Salary, Location, Job Type, Date Found) in grid
- 12: MatchScore — AI Match Reasoning paragraph, Matched Skills (green badges), Missing Skills (purple badges per ui-tokens)
- 12: JobDescription — About the Role, Responsibilities, Requirements, Nice to Have, Benefits, About the Company — each section conditionally rendered
- 12: CompanyResearch — empty state with Research Company button (client component, no-op for now)
- 12: JobActions — Apply Now primary button linking to external_apply_url in new tab
- 12: JobsTable converted to client component — rows clickable via useRouter, cursor-pointer + hover:bg-surface-secondary
- 12: Match score badge styles — 80%+ success-lightest, 60-79% info-light, <60% surface-secondary
- 13: Company Research Agent — POST /api/agent/research, synchronous route, loads job+profile from DB
- 13: Derives homepage URL via server-side fetch following Adzuna redirect → extract root domain → fallback https://www.{company}.com
- 13: Browserbase session (120s timeout) + Stagehand (deepseek/deepseek-chat) — homepage extract + max 3 sub-pages
- 13: extract() uses Stagehand v3 API: stagehand.extract(instruction, schema) — Zod schemas for homepage/sub-page
- 13: Deepseek synthesis (temperature 0.4, json_object, max_tokens 2000) — 9-field dossier saved to jobs.company_research jsonb
- 13: CompanyResearch component updated — accepts existingResearch prop, shows dossier or empty state, useTransition + fetch POST for research button, router.refresh() on success
- 13: Installed @browserbasehq/sdk, @browserbasehq/stagehand, zod packages
- 14: Dashboard page with mock data — 3 new components: StatsBar, RecentActivity, AnalyticsCharts
- 14: SVG-based chart placeholders (no chart library yet) — BarChart, LineChart, ScoreBarChart inline in AnalyticsCharts
- 14: StatsBar uses 4th card "Jobs This Week" (not "Cover Letters Generated") to align with feature 15 real data wiring
- 14: Incomplete profile banner with 60% ring + missing field tags + Complete Profile CTA
- 14: Activity dots — Job Found uses success colors, Company Researched uses info colors
- 15: StatsBar wired to real InsForge DB — counts via .database.from() with { count: "exact", head: true }
- 15: AVG match rate computed in JS from fetched match_score column — PostgREST has no AVG via SDK builder
- 15: StatCard trend prop made optional — omitted until period-comparison data available
- 15: InsForge SDK requires .database.from() not .from() — all dashboard queries use the correct chain
- 16: RecentActivity built from agent_runs (completed searches) + jobs (company_research IS NOT NULL), merged by timestamp, top 5
- 16: formatRelativeTime extracted to lib/utils.ts — shared utility for time-ago formatting
- 16: ActivityEntry/ActivityDot types exported from RecentActivity component for use in page data fetching
- 13: lib/browserbase.ts — createBrowserbase() factory
- 09: Mock data (12 jobs) in page.tsx — passed to JobsTable as prop. Source badge: Search = accent-light/accent, URL = surface-secondary/text-secondary
- 09: Match score bar color ranges — 80%+ success, 60-79% info, below 60% warning (per ui-rules)
- 09: Page is server component with auth guard — sub-components are client components handling local UI state
- 08: Deepseek generates structured JSON (not MD) — ResumeTemplate renders it via @react-pdf/renderer
- 08: Generate overwrites existing resume at resumes/{user_id}/resume.pdf — one active resume per user
- 08: Route renamed to .tsx for Document JSX in renderToBuffer()
- 08: renderToBuffer returns Buffer — extracted ArrayBuffer from it to create proper Blob (InsForge SDK needs .size + .type)
- 08: ResumeTemplate renders Page only (not Document) — Document wrapper in route for renderToBuffer type compat
- 08: revalidatePath("/profile") in API route + router.refresh() on client to sync new resume URL
- 08: Local currentResumeUrl state in ProfileForm for immediate UI update after generation
- 08: Resume filename and icon are clickable download links (opens InsForge Storage URL in new tab)
- 07: Extraction API route handles both fresh upload (FormData) and previously saved resume (InsForge Storage download)
- 07: Merge strategy: only fill empty form fields from extraction, preserve manual entries
- 07: pdf-parse replaced with pdfreader — pdf-parse 3.x worker threads incompatible with Turbopack
- 07: "Extract from Resume" button inside ResumeUpload component, exposes onExtract prop
- 07: agent/extractor.ts houses all Deepseek extraction functions (profile, future job extraction)
- 06: Server action accepts FormData for file upload support
- 06: Check-then-branch insert vs update via maybeSingle()
- 06: Shared completion logic in lib/profile-utils.ts
- 06: Inline feedback pattern with useTransition, auto-clear 3s

- 17: Charts powered by InsForge DB queries (not PostHog REST API) — jobs.found_at + match_score + company_research IS NOT NULL
- 17: Data aggregated in JS server-side (same pattern as feature 15 AVG match rate) — group by date, bucket by score range
- 17: Installed recharts 3.x — "use client" chart components receiving data as props, empty states per chart
- 17: Three chart components: JobsOverTimeChart (line, #7C5CFC), MatchScoreDistributionChart (bar, #10B981), CompanyResearchChart (bar, #61A8FF)
- 17: AnalyticsCharts rewritten as grid wrapper — all SVG code removed, passes data props to chart components
- 17: Chart colors per ui-tokens dashboard chart colors — no hardcoded hex values outside chart fill/stroke
- 17: Empty states: "No jobs found yet", "No match scores yet", "No companies researched yet"
- 17: Added company_researched to analytics-events.ts + fires in research route alongside company_dossier_generated
- 17: Jobs over time: 30-day window filled with zeroes for days with no events (continuous axis)
- 17: Company research: 7-day window filled with zeroes for days with no events (continuous axis)

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._

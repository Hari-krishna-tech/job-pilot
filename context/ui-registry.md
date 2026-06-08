# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Navbar (`components/layout/Navbar.tsx`)
Last updated: 2026-06-08

```
header: sticky top-0 z-50 h-16 w-full bg-surface border-b border-border
inner: max-w-[1440px] mx-auto px-6 flex items-center justify-between
logo: flex items-center gap-2
  img: rounded-[10px] size 36x36, gradient: linear-gradient(45deg, var(--color-accent) 0%, var(--color-accent-gradient-end) 100%)
nav: flex items-center gap-8
  link: text-sm font-medium text-text-dark hover:text-accent
cta (logged out): rounded-md bg-overlay-dark px-4 py-2 text-sm font-medium text-surface hover:opacity-90
cta (logged in): same style, links to /dashboard
```

### Footer (`components/layout/Footer.tsx`)

```
footer: w-full border-t border-border bg-surface
inner: max-w-[1440px] mx-auto px-6 py-12
grid: grid-cols-1 md:grid-cols-4 gap-8
logo: text-[19px] font-bold leading-7 text-text-darkest
heading: text-sm font-semibold leading-5 text-text-primary
link: text-sm leading-5 text-text-secondary hover:text-accent
copyright: text-xs leading-4 text-text-muted border-t border-border pt-6 mt-12
```

### Hero (`components/homepage/Hero.tsx`)

```
section: relative overflow-hidden bg-surface with radial accent gradient overlay at 3% opacity
inner: max-w-[1440px] mx-auto px-6 pb-20 pt-24 lg:pt-32
heading: text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-text-primary
  accent word: color var(--color-accent)
subtitle: text-lg leading-7 text-text-secondary max-w-2xl mx-auto mt-6
cta row: flex gap-4 mt-10
  primary: rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground
  secondary: rounded-md border border-border bg-surface px-6 py-3 text-sm font-medium text-text-primary hover:bg-surface-secondary
preview img: rounded-xl border border-border shadow-lg mt-16 max-w-5xl mx-auto
```

### HowItWorks (`components/homepage/HowItWorks.tsx`)

```
section: bg-background py-24
inner: max-w-[1440px] mx-auto px-6
heading: text-[30px] font-semibold leading-9 text-text-primary text-center
subtitle: text-sm leading-5 text-text-secondary text-center mt-4
grid: grid-cols-1 md:grid-cols-3 gap-8 mt-16
card: rounded-2xl border border-border bg-surface p-6 shadow-sm
number: text-[30px] font-semibold leading-9 text-accent
title: text-base font-semibold leading-6 text-text-primary mt-4
desc: text-sm leading-5 text-text-secondary mt-2
```

### Features (`components/homepage/Features.tsx`)

```
section: bg-surface py-24
inner: max-w-[1440px] mx-auto px-6
heading: text-[30px] font-semibold leading-9 text-text-primary text-center
subtitle: text-sm leading-5 text-text-secondary text-center mt-4
grid: grid-cols-1 md:grid-cols-3 gap-8 mt-16
card: rounded-2xl border border-border bg-surface-secondary p-6
icon wrap: flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light
icon: SVG stroke var(--color-accent) size 24
title: text-base font-semibold leading-6 text-text-primary mt-5
desc: text-sm leading-5 text-text-secondary mt-2
```

### Testimonial (`components/homepage/Testimonial.tsx`)

```
section: bg-background py-24
inner: max-w-[1440px] mx-auto px-6
blockquote: text-xl font-medium leading-8 text-text-primary max-w-3xl mx-auto
avatar: flex h-10 w-10 items-center justify-center rounded-full bg-accent-light
  initials: text-sm font-semibold text-accent
name: text-sm font-medium leading-5 text-text-primary
role: text-xs leading-4 text-text-muted
```

### CTASection (`components/homepage/CTASection.tsx`)

```
section: bg-surface py-24
inner: max-w-[1440px] mx-auto px-6
card: max-w-2xl mx-auto rounded-2xl border border-border bg-surface-secondary p-12 text-center
heading: text-[30px] font-semibold leading-9 text-text-primary
subtitle: text-sm leading-5 text-text-secondary mt-4
cta: rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground mt-8
```

### LoginForm (`app/(auth)/login/LoginForm.tsx`)
Last updated: 2026-06-08

```
page wrap: flex min-h-[calc(100vh-8rem)] items-center justify-center
card: w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]
heading: mb-2 text-center text-base font-semibold leading-6 text-text-primary
subtitle: mb-6 text-center text-xs leading-4 text-text-muted
button container: flex flex-col gap-3
  oauth button: flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:opacity-50
```

**Pattern notes:** OAuth buttons use secondary button style (bordered) with loading state via `disabled:opacity-50`. Card is centered vertically with `min-h-[calc(100vh-8rem)]` to account for navbar + footer.

### Protected Page Shell (`app/dashboard/page.tsx` and similar)
Last updated: 2026-06-08

```
page wrap: mx-auto max-w-[1440px] p-8
heading: text-base font-semibold leading-6 text-text-primary
```

**Pattern notes:** All protected pages (dashboard, profile, find-jobs, find-jobs/[id]) share this minimal shell. Standard page section heading at 16px semibold. Auth check with try/catch — redirects to /login on failure.

### CompletionIndicator (`components/profile/CompletionIndicator.tsx`)
Last updated: 2026-06-08

```
card: rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]
heading: text-base font-semibold leading-6 text-text-primary
subtitle: text-xs leading-4 text-text-muted

completion ring:
  track circle: stroke var(--color-border) strokeWidth 6
  fill circle: stroke var(--color-accent) strokeWidth 6 strokeLinecap round
  percentage label: text-sm font-semibold text-text-primary (centered absolute)

missing field tags:
  rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent

complete state:
  icon wrap: flex h-10 w-10 items-center justify-center rounded-full bg-success-lightest
  icon: h-5 w-5 text-success (check SVG)
```

**Pattern notes:** Completion ring uses SVG circle with stroke-dasharray/stroke-dashoffset for animated progress. 80x80 viewBox with r=36 gives circumference ~226. Missing fields shown as pill badges using accent colors. Complete state replaces ring with green check icon.

### ResumeUpload (`components/profile/ResumeUpload.tsx`)
Last updated: 2026-06-08

```
card: rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]
heading: text-base font-semibold leading-6 text-text-primary

drop zone (idle): rounded-lg border-2 border-dashed border-border-muted bg-surface-secondary p-8
drop zone (drag over): border-accent bg-accent-muted

empty state icon wrap: flex h-12 w-12 items-center justify-center rounded-xl bg-surface-tertiary
empty state icon: h-6 w-6 text-text-muted (Upload from lucide-react)
empty state text: text-sm font-medium text-text-primary
empty state hint: text-xs text-text-muted

file state icon wrap: flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light
file state icon: h-6 w-6 text-accent (FileText from lucide-react)
file name: text-sm font-medium text-text-primary
remove link: text-xs text-text-muted hover:text-error transition-colors

primary button: rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity
secondary button: rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors
```

**Pattern notes:** Drag-drop zone uses dashed border-2 with color swap on drag-active (border-muted→accent, secondary→accent-muted bg). Two-button row follows primary+secondary button patterns. Hidden file input triggered by ref.

### TagInput (`components/profile/TagInput.tsx`)
Last updated: 2026-06-08

```
input: rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none
add button: rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors
tag pill: inline-flex items-center gap-1 rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-secondary
tag remove: text-text-muted hover:text-text-primary transition-colors (X icon h-3 w-3)
```

**Pattern notes:** Tags shown below input row in flex-wrap layout with gap-2. Enter key adds tag. Duplicate tags prevented. Input + Add button share a flex row with gap-2.

### ProfileForm (`components/profile/ProfileForm.tsx`)
Last updated: 2026-06-08

```
section card: rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]
section heading: text-base font-semibold leading-6 text-text-primary
section spacing: space-y-6 between sections, mt-4 from heading to content
field grid: grid grid-cols-1 gap-4 md:grid-cols-2

form label: block text-sm font-medium text-text-dark mb-1.5
form input/select: w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none
disabled input: text-text-muted cursor-not-allowed
form textarea: same as input + resize-none

work experience sub-card: rounded-lg border border-border bg-surface-secondary p-4 relative
work experience label: block text-xs font-medium text-text-secondary mb-1
work experience heading: text-xs font-semibold text-text-dark uppercase
checkbox: h-4 w-4 rounded border-border text-accent focus:ring-accent
checkbox label: text-xs font-medium text-text-secondary

add role button: inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors
delete role button: absolute top-3 right-3 p-1 text-text-muted hover:text-error transition-colors

empty state text: text-sm text-text-muted

save button: rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity
```

**Pattern notes:** Five sections each in their own card. Two-column grid for field layout (single column on mobile). Select/dropdown uses same styling as text input. Work experience sub-cards within the section card use lighter bg-surface-secondary. Empty state for work experience when no roles added. Save button right-aligned at bottom with slightly larger padding (px-6 py-2.5) than standard primary button.

### JobInfo (`components/job-details/JobInfo.tsx`)
Last updated: 2026-06-08

```
back link: inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors
  icon: ArrowLeft h-4 w-4

header card: rounded-2xl border border-border bg-surface p-6 shadow-[...]

company placeholder: flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-tertiary
  icon: Building2 h-6 w-6 text-text-muted

title: text-base font-semibold leading-6 text-text-primary
company name: text-sm text-text-secondary mt-1

match score bar: h-2 w-24 rounded-full bg-border-light
  fill: h-full rounded-full (bg-success/bg-info/bg-warning by score range)
match score badge: inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium
  80%+: bg-success-lightest text-success-foreground
  60-79%: bg-info-light text-info-foreground
  <60%: bg-surface-secondary text-text-secondary

view job post button: inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary
  icon: ExternalLink h-4 w-4

info cards grid: grid grid-cols-2 gap-4 sm:grid-cols-4 mt-6
  info card: rounded-lg border border-border bg-surface-secondary p-3
    icon + label row: flex items-center gap-1.5
      icon: h-4 w-4 text-text-muted
      label: text-xs leading-4 text-text-muted
    value: text-sm font-medium text-text-primary mt-1
```

### MatchScore (`components/job-details/MatchScore.tsx`)
Last updated: 2026-06-08

```
card: rounded-2xl border border-border bg-surface p-6 shadow-[...]

heading row: flex items-center gap-2
  icon: Sparkles h-5 w-5 text-accent
  heading: text-base font-semibold leading-6 text-text-primary

match reason: text-sm leading-5 text-text-secondary mt-3
  empty state: text-sm text-text-muted

skills grid: grid gap-6 sm:grid-cols-2 mt-6
  section heading: flex items-center gap-1.5
    matched icon: CheckCircle2 h-4 w-4 text-success
    missing icon: AlertCircle h-4 w-4 text-warning
    label: text-sm font-semibold text-text-primary

  skill badge: inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium
    matched: bg-success-lightest text-success-foreground
    missing: bg-accent-muted text-accent

  empty: text-sm text-text-muted
```

### JobDescription (`components/job-details/JobDescription.tsx`)
Last updated: 2026-06-08

```
card: rounded-2xl border border-border bg-surface p-6 shadow-[...]

heading row: flex items-center gap-2
  icon: FileText h-5 w-5 text-accent
  heading: text-base font-semibold leading-6 text-text-primary

content sections: space-y-6 mt-4
  section heading: text-sm font-semibold text-text-primary
  paragraph: text-sm leading-5 text-text-secondary mt-2
  bullet list: list-disc space-y-1 pl-5 mt-2
    item: text-sm leading-5 text-text-secondary

  empty state: text-sm text-text-muted mt-3
```

### CompanyResearch (`components/job-details/CompanyResearch.tsx`)
Last updated: 2026-06-09

```
card: rounded-2xl border border-border bg-surface p-6 shadow-[...]

heading row: flex items-center gap-2
  icon: Building2 h-5 w-5 text-accent
  heading: text-base font-semibold leading-6 text-text-primary

--- Empty State ---

empty state container: flex flex-col items-center py-8 text-center mt-8
  icon wrap: flex h-12 w-12 items-center justify-center rounded-xl bg-surface-tertiary
    icon: Search h-6 w-6 text-text-muted
  title: text-sm font-medium text-text-primary mt-4
  description: text-xs text-text-muted mt-1
  research button (primary): inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50 mt-6
  loading: Zap icon animate-pulse + "Researching..." text

--- Dossier View ---

content sections: space-y-6 mt-6
  section heading: text-sm font-semibold text-text-primary
  paragraph: text-sm leading-5 text-text-secondary mt-2
  bullet list: list-disc space-y-1 pl-5 mt-2
    item: text-sm leading-5 text-text-secondary

tech stack badges: flex flex-wrap gap-2 mt-2
  tag: inline-flex rounded-full bg-success-lightest px-2.5 py-0.5 text-xs font-medium text-success-foreground

section icons (colored):
  Your Edge: Target h-4 w-4 text-accent
  Gaps to Address: AlertTriangle h-4 w-4 text-warning
  Smart Questions: Lightbulb h-4 w-4 text-info-dark
  Interview Prep: Presentation h-4 w-4 text-success

sources: border-t border-border pt-4
  heading: flex items-center gap-1.5, ExternalLink h-3.5 w-3.5 text-text-muted, text-xs font-medium text-text-muted
  links: flex flex-wrap gap-2 mt-1.5, text-xs text-info-dark underline underline-offset-2 hover:text-info-medium (open in new tab)
```

### JobActions (`components/job-details/JobActions.tsx`)
Last updated: 2026-06-08

```
container: flex justify-end

apply button: inline-flex items-center gap-2 rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90
  icon: Send h-4 w-4
```

**Pattern notes:** All job-details components are server components except CompanyResearch (client for future button handler). Match score bar + badge use identical color thresholds as JobsTable (80/60). Skills badges follow ui-tokens colors. Every section heading has an accent-colored icon. Apply button uses slightly larger padding (px-6 py-2.5) matching save button pattern.

### StatsBar (`components/dashboard/StatsBar.tsx`)
Last updated: 2026-06-09

```
props: { totalJobs: number, avgMatchRate: number, companiesResearched: number, jobsThisWeek: number }

grid: grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4

stat card: rounded-2xl border border-border bg-surface p-6 shadow-[...]
  label: text-sm font-medium leading-5 text-text-secondary
  value: mt-2 text-[30px] font-semibold leading-9 text-text-primary
  trend row (optional): mt-2 flex items-center gap-1
    trend badge: inline-flex items-center gap-1 rounded-sm bg-success-lightest px-2 py-0.5
      icon: TrendingUp h-3 w-3 text-success-darker
      text: text-xs font-medium leading-4 text-success-darker
    subtitle: text-xs leading-4 text-text-muted
```

**Pattern notes:** Server component. Accepts real data from parent via props. Trend badges are optional — rendered only when `trend` prop is provided (omitted for feature 15 since period-comparison data not wired yet). Values formatted as strings (e.g., "72%", "24").

### RecentActivity (`components/dashboard/RecentActivity.tsx`)
Last updated: 2026-06-09

```
card: rounded-2xl border border-border bg-surface p-6 shadow-[...]
heading: text-base font-semibold leading-6 text-text-primary
list: space-y-5 mt-4

activity entry: flex items-start gap-3
  dot outer: flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ring-2 ring-surface
    job found: bg-success-light ring, bg-success-alt inner dot
    company researched: bg-info-light ring, bg-info inner dot
  dot inner: h-2 w-2 rounded-full
  text: text-sm font-medium leading-5 text-text-primary
  timestamp: mt-0.5 text-xs leading-4 text-text-muted
```

**Pattern notes:** Server component. 5 mock entries. Dot colors per ui-tokens activity dot spec: Job Found = success-light/success-alt, Company Researched = info-light/info (mapped from cover letter slot). Ring-2 ring-surface gives the white border effect on the outer circle.

### AnalyticsCharts (`components/dashboard/AnalyticsCharts.tsx`)
Last updated: 2026-06-09

```
grid: grid grid-cols-1 gap-6 lg:grid-cols-3

chart card: rounded-2xl border border-border bg-surface p-6 shadow-[...]
  heading: text-base font-semibold leading-6 text-text-primary
  chart area: mt-3 flex justify-center, SVG 280x160 viewBox

SVG internals:
  grid lines: stroke var(--color-border) strokeDasharray="4 3"
  axis labels: fill #9CA3AF text-[11px]
  bars: rx=3, fill var(--color-info) or var(--color-success), barWidth calc
  line: stroke var(--color-accent) strokeWidth=3, gradient fill underneath
  data points: r=4 circle, fill surface, stroke accent width=2.5
```

**Pattern notes:** Server component. Three SVG charts — no chart library dependency (recharts added in feature 17). Shared YAxis component for grid lines + tick labels. BarChart (info blue) for Resume Tailoring Activity. LineChart (accent purple) for Jobs Found Over Time with gradient area fill. ScoreBarChart (success green) for Match Score Distribution. Chart colors per ui-tokens dashboard chart color spec.

### Dashboard Page — Incomplete Profile Banner
Last updated: 2026-06-09

```
banner card: rounded-2xl border border-border bg-surface p-6 shadow-[...]
  layout: flex items-start gap-6

  completion ring (left):
    SVG 80x80 viewBox
    track: circle r=36 stroke var(--color-border) strokeWidth=6 fill=none
    fill arc: circle r=36 stroke var(--color-accent) strokeWidth=6 strokeLinecap=round strokeDasharray calc strokeDashoffset calc transform rotate(-90)
    percentage text: absolute inset-0 flex center, text-sm font-semibold text-text-primary

  content (right):
    title: text-base font-semibold leading-6 text-text-primary
    description: mt-1 text-xs leading-4 text-text-muted
    missing tags: mt-3 flex flex-wrap gap-2
      tag: inline-flex rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent
    cta: mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90
```

**Pattern notes:** Banner appears at top of dashboard when profile incomplete. Uses same SVG ring pattern as CompletionIndicator (80x80, r=36, circumference ~226). Missing field tags use accent colors (pill shape). CTA button links to /profile using standard primary button style.

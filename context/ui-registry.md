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

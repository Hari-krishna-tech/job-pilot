# PostHog Event Tracking Guide

This guide explains how to track events in the JobPilot application using the PostHog infrastructure that's already been set up.

## Quick Start

### Client-Side Event Tracking (React Components)

```typescript
import { usePostHogEvent } from '@/hooks/usePostHogEvent';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

export const MyComponent = () => {
  const trackEvent = usePostHogEvent();

  const handleClick = () => {
    trackEvent(ANALYTICS_EVENTS.JOB_SAVED, {
      job_id: '123',
      company_name: 'TechCorp'
    });
  };

  return <button onClick={handleClick}>Save Job</button>;
};
```

### Server-Side Event Tracking (API Routes)

```typescript
import { trackServerEvent } from "@/lib/analytics-server";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export async function POST(req: Request) {
  const userId = "user-123";

  // Track the event
  await trackServerEvent(ANALYTICS_EVENTS.JOB_APPLIED, userId, {
    job_id: "job-456",
    company_name: "TechCorp",
  });

  return Response.json({ success: true });
}
```

## Available Utilities

### Client-Side Hooks

#### 1. `usePostHogEvent()` - Track Events

```typescript
const trackEvent = usePostHogEvent();

// Basic usage
trackEvent("custom_event");

// With properties
trackEvent("button_clicked", {
  button_id: "cta-hero",
  button_text: "Get Started",
});
```

**When to use:**

- User interactions (clicks, submissions, page views)
- Form completions
- Navigation actions
- Engagement metrics

#### 2. `usePostHogIdentify()` - Identify Users

```typescript
const identify = usePostHogIdentify();

// After successful login
identify("user-123", {
  email: "user@example.com",
  plan: "premium",
  created_at: "2026-01-01",
});
```

**When to use:**

- After user login/signup
- When user information changes
- To link user properties across sessions

#### 3. `usePostHogSetProperties()` - Update User Properties

```typescript
const setProperties = usePostHogSetProperties();

// Update user properties without changing identification
setProperties({
  theme_preference: "dark",
  notifications_enabled: true,
  last_activity: new Date(),
});
```

**When to use:**

- Theme/preference changes
- Feature toggles
- User settings updates
- Don't use for identifying new users (use `identify` instead)

### Server-Side Functions

#### 1. `trackServerEvent()` - Track Server Events

```typescript
import { trackServerEvent } from "@/lib/analytics-server";

await trackServerEvent("user_signed_in", "user-123", {
  provider: "google",
  ip_country: "US",
});
```

#### 2. `identifyServerUser()` - Identify User on Server

```typescript
import { identifyServerUser } from "@/lib/analytics-server";

await identifyServerUser("user-123", {
  email: "user@example.com",
  subscription_tier: "pro",
});
```

#### 3. `batchTrackEvents()` - Track Multiple Events

```typescript
import { batchTrackEvents } from "@/lib/analytics-server";

await batchTrackEvents("user-123", [
  { event: "job_applied", properties: { job_id: "123" } },
  { event: "email_sent", properties: { recipient: "recruiter@company.com" } },
  {
    event: "profile_updated",
    properties: { fields: ["skills", "experience"] },
  },
]);
```

## Pre-defined Events

All events are defined in `lib/analytics-events.ts` for consistency:

### Dashboard Events

- `DASHBOARD_VIEWED` - User viewed the dashboard
- `DASHBOARD_ACTIVITY_FEED_VIEWED` - User viewed activity feed
- `DASHBOARD_ANALYTICS_VIEWED` - User viewed analytics section
- `DASHBOARD_RECENT_ACTIVITY_CLICKED` - User clicked on recent activity item

### Job Finding Events

- `FIND_JOBS_PAGE_VIEWED` - User navigated to job search page
- `JOB_SEARCH_PERFORMED` - User performed a search
- `JOB_FILTER_APPLIED` - User applied a filter
- `JOB_FILTER_REMOVED` - User removed a filter
- `JOB_DETAILS_VIEWED` - User viewed job details
- `JOB_APPLIED` - User applied to a job
- `JOB_SAVED` - User saved a job
- `JOB_UNSAVED` - User unsaved a job
- `JOB_SHARED` - User shared a job
- `JOB_RESEARCH_VIEWED` - User viewed company research
- `JOB_COMPANY_DOSSIER_GENERATED` - AI generated company research dossier

### Profile Events

- `PROFILE_PAGE_VIEWED` - User viewed profile page
- `PROFILE_UPDATED` - User updated profile information
- `RESUME_UPLOADED` - User uploaded a resume
- `RESUME_DELETED` - User deleted a resume
- `PROFILE_SKILL_ADDED` - User added a skill
- `PROFILE_SKILL_REMOVED` - User removed a skill
- `PROFILE_PREFERENCE_CHANGED` - User changed a preference

### General Events

- `LOGOUT` - User logged out
- `NAVIGATION_CLICKED` - User navigated to a page
- `ERROR_OCCURRED` - An error occurred in the app

## Best Practices

### 1. Property Naming

Use lowercase with underscores:

```typescript
trackEvent(ANALYTICS_EVENTS.JOB_APPLIED, {
  job_id: "123", // ✅ Good
  company_name: "TechCorp",
  application_method: "direct",

  // ❌ Avoid
  // jobId: '123'
  // CompanyName: 'TechCorp'
});
```

### 2. Include Relevant Context

```typescript
// ✅ Good - includes enough context
trackEvent(ANALYTICS_EVENTS.JOB_SAVED, {
  job_id: "job-123",
  job_title: "Senior Developer",
  company_name: "TechCorp",
  salary_range: "100k-150k",
});

// ❌ Avoid - too vague
trackEvent("save", { id: "123" });
```

### 3. Track at the Right Time

```typescript
// ✅ Good - track after successful action
const handleApply = async () => {
  const result = await applyToJob(jobId);
  if (result.success) {
    trackEvent(ANALYTICS_EVENTS.JOB_APPLIED, { job_id: jobId });
  }
};

// ❌ Avoid - track before you know it succeeded
const handleApply = async () => {
  trackEvent(ANALYTICS_EVENTS.JOB_APPLIED, { job_id: jobId });
  await applyToJob(jobId);
};
```

### 4. Privacy-Sensitive Data

```typescript
// ✅ Good - only track what you need
trackEvent(ANALYTICS_EVENTS.PROFILE_UPDATED, {
  fields_updated: ["name", "email"],
  field_count: 2,
});

// ❌ Avoid - don't send raw PII
trackEvent(ANALYTICS_EVENTS.PROFILE_UPDATED, {
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
});
```

### 5. Event Timing

```typescript
// Use useEffect for page views
useEffect(() => {
  trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED);
}, []);

// Use onClick handlers for user interactions
<button onClick={() => trackEvent(ANALYTICS_EVENTS.JOB_SAVED, {...})}>
  Save
</button>
```

## Implementation Examples

See the `lib/examples/` directory for full component examples:

- `dashboard-example.tsx` - Dashboard page event tracking
- `find-jobs-example.tsx` - Job search and filtering tracking
- `job-details-example.tsx` - Job details and application tracking
- `profile-example.tsx` - Profile and preferences tracking

## Adding to Your Actual Pages

When you're ready to implement tracking in your actual components:

1. Import the hook and events:

```typescript
import { usePostHogEvent } from "@/hooks/usePostHogEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
```

2. Get the tracking function:

```typescript
const trackEvent = usePostHogEvent();
```

3. Add event tracking to user interactions:

```typescript
<button onClick={() => trackEvent(ANALYTICS_EVENTS.JOB_SAVED, { job_id })}>
  Save Job
</button>
```

4. For page views, use useEffect:

```typescript
useEffect(() => {
  trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED);
}, [trackEvent]);
```

## Testing Events

In development, PostHog is set to `debug: true` in `instrumentation-client.ts`. You'll see events logged to the browser console.

To verify events are being tracked:

1. Open DevTools (F12)
2. Go to the Console tab
3. Look for `PostHog` logs
4. Visit your [PostHog dashboard](https://us.posthog.com) to see live event data

## Common Pitfalls

- **Forgetting `useEffect` for page views** - Page views won't track without mounting
- **Tracking before action completes** - Wait for success before tracking
- **Mixing client and server tracking** - Use the right tool for the context
- **Not using pre-defined events** - Check `analytics-events.ts` before creating new events
- **Over-tracking** - Only track meaningful user actions, not every interaction
- **Identifying users without their consent** - Only identify after successful authentication

## Questions?

Refer back to the PostHog setup report in `posthog-setup-report.md` or check the PostHog dashboard for insights on what's being tracked.

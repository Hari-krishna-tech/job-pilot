# PostHog Event Tracking Setup - What Was Created

Your application now has a complete event tracking infrastructure ready to use. Here's what was created and how to use it.

## Files Created

### Core Utilities

- **`hooks/usePostHogEvent.ts`** - React hooks for client-side event tracking
- **`lib/analytics-events.ts`** - Centralized event definitions
- **`lib/analytics-server.ts`** - Server-side event tracking functions

### Documentation

- **`POSTHOG_TRACKING_GUIDE.md`** - Comprehensive guide with best practices
- **`lib/TRACKING_IMPLEMENTATION_TEMPLATE.ts`** - Copy/paste implementation patterns
- **`lib/examples/`** - Full example implementations for each page type:
  - `dashboard-example.tsx`
  - `find-jobs-example.tsx`
  - `job-details-example.tsx`
  - `profile-example.tsx`

## 30-Second Quick Start

### Track an event in any React component:

```typescript
'use client';
import { usePostHogEvent } from '@/hooks/usePostHogEvent';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

export const MyComponent = () => {
  const trackEvent = usePostHogEvent();

  return (
    <button onClick={() => trackEvent(ANALYTICS_EVENTS.JOB_SAVED, { job_id: '123' })}>
      Save Job
    </button>
  );
};
```

### Track a page view:

```typescript
'use client';
import { useEffect } from 'react';
import { usePostHogEvent } from '@/hooks/usePostHogEvent';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

export default function DashboardPage() {
  const trackEvent = usePostHogEvent();

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED);
  }, [trackEvent]);

  return <div>Dashboard</div>;
}
```

### Track an event on the server (API route):

```typescript
import { trackServerEvent } from "@/lib/analytics-server";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export async function POST(req: Request) {
  const userId = "user-123";

  await trackServerEvent(ANALYTICS_EVENTS.JOB_APPLIED, userId, {
    job_id: "job-456",
    company: "TechCorp",
  });

  return Response.json({ success: true });
}
```

## Next Steps

1. **Review the examples** in `lib/examples/` to understand patterns
2. **Read the full guide** in `POSTHOG_TRACKING_GUIDE.md` for best practices
3. **Use the template** in `lib/TRACKING_IMPLEMENTATION_TEMPLATE.ts` when adding tracking
4. **Start with your key flows**:
   - User authentication (already done ✅)
   - Homepage CTAs (already done ✅)
   - Dashboard interactions (add these next)
   - Job search and filtering
   - Profile updates
   - Job applications

## Pre-defined Events Available

Your app already tracks these areas:

- ✅ **Auth Events**: sign_in_clicked, user_signed_in, sign_in_failed
- ✅ **Homepage CTAs**: get_started_clicked, find_first_match_clicked, cta_get_started_clicked

Add tracking for:

- 📊 **Dashboard**: Views, activity feed, analytics sections
- 🔍 **Job Search**: Searches, filters, job views, saves
- 💼 **Job Applications**: Apply, share, research company
- 👤 **Profile**: Updates, resume uploads, skill additions, preferences

## Recommended Implementation Order

1. **Dashboard Page** (easiest) - Add page view and section clicks
2. **Find Jobs Page** - Add search and filter tracking
3. **Job Details Page** - Add application and research tracking
4. **Profile Page** - Add form submission and preference tracking
5. **Navigation** - Track page transitions in layout components

## View Your Data

Your PostHog dashboards were already created during initial setup:

- [Analytics Dashboard](https://us.posthog.com/project/458123/dashboard/1682715)
- [Sign-in Funnel](https://us.posthog.com/project/458123/insights/T1sVhXUy)
- [Daily Sign-ins](https://us.posthog.com/project/458123/insights/aXnmtPGq)
- [And 3 more insights](https://us.posthog.com/project/458123)

## Debugging

In development, PostHog logs events to the browser console. Open DevTools (F12) and look for PostHog logs when you trigger events.

## Key Files Reference

| File                        | Purpose                       |
| --------------------------- | ----------------------------- |
| `hooks/usePostHogEvent.ts`  | React hooks for tracking      |
| `lib/analytics-events.ts`   | All event names (use these!)  |
| `lib/analytics-server.ts`   | Server-side tracking          |
| `instrumentation-client.ts` | PostHog client initialization |
| `lib/posthog-server.ts`     | PostHog server initialization |

## Example: Adding to Dashboard

Your dashboard page at `app/dashboard/page.tsx` could look like:

```typescript
'use client';

import { useEffect } from 'react';
import { usePostHogEvent } from '@/hooks/usePostHogEvent';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

export default function DashboardPage() {
  const trackEvent = usePostHogEvent();

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED);
  }, [trackEvent]);

  return (
    <div>
      <section onClick={() => trackEvent(ANALYTICS_EVENTS.DASHBOARD_ACTIVITY_FEED_VIEWED)}>
        <h2>Recent Activity</h2>
        {/* Activity feed content */}
      </section>

      <section onClick={() => trackEvent(ANALYTICS_EVENTS.DASHBOARD_ANALYTICS_VIEWED)}>
        <h2>Your Analytics</h2>
        {/* Analytics content */}
      </section>
    </div>
  );
}
```

## Support

- Full guide: `POSTHOG_TRACKING_GUIDE.md`
- Implementation template: `lib/TRACKING_IMPLEMENTATION_TEMPLATE.ts`
- Page examples: `lib/examples/`
- PostHog docs: https://posthog.com/docs

Happy tracking! 📊

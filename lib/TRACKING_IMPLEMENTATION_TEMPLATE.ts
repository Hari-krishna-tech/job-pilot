/**
 * IMPLEMENTATION TEMPLATE
 * Copy this pattern to add tracking to any component
 */

'use client';

import { useEffect, useCallback } from 'react';
import { usePostHogEvent } from '@/hooks/usePostHogEvent';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

export const YourComponentName = () => {
  const trackEvent = usePostHogEvent();

  // PATTERN 1: Track page/section view on mount
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED); // Replace with your event
    // Add any additional page metadata here
  }, [trackEvent]);

  // PATTERN 2: Track user interactions with callbacks
  const handleUserAction = useCallback((actionData: any) => {
    trackEvent(ANALYTICS_EVENTS.JOB_SAVED, { // Replace with your event
      // Add relevant properties
      job_id: actionData.id,
      timestamp: new Date().toISOString(),
    });
  }, [trackEvent]);

  // PATTERN 3: Track search/filter with debouncing
  const handleSearch = useCallback((query: string) => {
    if (query.length > 2) { // Only track meaningful searches
      trackEvent(ANALYTICS_EVENTS.JOB_SEARCH_PERFORMED, {
        search_query: query,
        query_length: query.length,
      });
    }
  }, [trackEvent]);

  // PATTERN 4: Track async operations
  const handleAsyncAction = useCallback(async () => {
    try {
      const result = await someAsyncOperation();
      
      if (result.success) {
        trackEvent(ANALYTICS_EVENTS.JOB_APPLIED, {
          job_id: result.jobId,
          duration_ms: result.duration,
        });
      } else {
        trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
          error_type: 'job_application_failed',
          error_message: result.error,
        });
      }
    } catch (error) {
      trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
        error_type: 'unexpected_error',
        component: 'YourComponentName',
      });
    }
  }, [trackEvent]);

  return (
    <div>
      {/* JSX with event handlers */}
      <button onClick={() => handleUserAction({ id: '123' })}>
        Action
      </button>

      <input 
        onChange={(e) => handleSearch(e.target.value)} 
        placeholder="Search..."
      />

      <button onClick={handleAsyncAction}>
        Async Action
      </button>
    </div>
  );
};

// ============================================
// QUICK REFERENCE FOR EACH PAGE
// ============================================

/*
DASHBOARD PAGE (app/dashboard/page.tsx):
- Track: DASHBOARD_VIEWED on mount
- Track: DASHBOARD_ACTIVITY_FEED_VIEWED when clicking activity section
- Track: DASHBOARD_ANALYTICS_VIEWED when clicking analytics section
- Track: DASHBOARD_RECENT_ACTIVITY_CLICKED when clicking activity items

FIND JOBS PAGE (app/find-jobs/page.tsx):
- Track: FIND_JOBS_PAGE_VIEWED on mount
- Track: JOB_SEARCH_PERFORMED on search input
- Track: JOB_FILTER_APPLIED when adding filters
- Track: JOB_FILTER_REMOVED when removing filters
- Track: JOB_DETAILS_VIEWED when clicking job cards

JOB DETAILS PAGE (app/find-jobs/[id]/page.tsx):
- Track: JOB_DETAILS_VIEWED on mount with job context
- Track: JOB_RESEARCH_VIEWED when viewing research section
- Track: JOB_COMPANY_DOSSIER_GENERATED when generating dossier
- Track: JOB_APPLIED when applying to job
- Track: JOB_SHARED when sharing job

PROFILE PAGE (app/profile/page.tsx):
- Track: PROFILE_PAGE_VIEWED on mount
- Track: PROFILE_UPDATED when saving profile changes
- Track: RESUME_UPLOADED when uploading resume
- Track: PROFILE_SKILL_ADDED when adding skills
- Track: PROFILE_SKILL_REMOVED when removing skills
- Track: PROFILE_PREFERENCE_CHANGED when changing preferences

NAVIGATION/LAYOUT (components/layout/...):
- Track: NAVIGATION_CLICKED on each main nav link
- Track: LOGOUT when user clicks logout button
*/

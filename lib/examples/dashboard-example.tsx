"use client";

import { useEffect } from "react";
import { usePostHogEvent } from "@/hooks/usePostHogEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

/**
 * EXAMPLE: Dashboard Page Component
 * Shows how to track page views and user interactions
 */
export const DashboardExample = () => {
  const trackEvent = usePostHogEvent();

  // Track page view on mount
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED);
  }, [trackEvent]);

  const handleViewActivityFeed = () => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_ACTIVITY_FEED_VIEWED);
  };

  const handleViewAnalytics = () => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_ANALYTICS_VIEWED);
  };

  const handleActivityItemClicked = (activityId: string, type: string) => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_RECENT_ACTIVITY_CLICKED, {
      activity_id: activityId,
      activity_type: type, // e.g., 'job_applied', 'company_researched'
    });
  };

  return (
    <div className="space-y-6">
      <section onClick={handleViewActivityFeed}>
        {/* Activity feed UI */}
        <h2>Recent Activity</h2>
      </section>

      <section onClick={handleViewAnalytics}>
        {/* Analytics UI */}
        <h2>Your Analytics</h2>
      </section>

      <div onClick={() => handleActivityItemClicked("act-123", "job_applied")}>
        {/* Activity item */}
      </div>
    </div>
  );
};

"use client";

/**
 * REAL-WORLD EXAMPLE: Dashboard Page with Event Tracking
 * This shows how to add tracking to your actual app/dashboard/page.tsx
 */

import { useEffect } from "react";
import { usePostHogEvent } from "@/hooks/usePostHogEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

interface DashboardProps {
  user: any; // Your user type
  recentActivity?: any[];
  analyticsData?: any;
}

export const DashboardPageWithTracking = ({
  user,
  recentActivity = [],
  analyticsData = {},
}: DashboardProps) => {
  const trackEvent = usePostHogEvent();

  // Track dashboard page view on mount
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED, {
      user_id: user?.id,
      has_resume: !!user?.resume,
      profile_completion: calculateProfileCompletion(user),
    });
  }, [trackEvent, user]);

  const handleActivityFeedClick = () => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_ACTIVITY_FEED_VIEWED, {
      activity_count: recentActivity.length,
    });
  };

  const handleAnalyticsClick = () => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_ANALYTICS_VIEWED, {
      has_analytics: !!analyticsData?.metrics,
    });
  };

  const handleActivityItemClick = (activity: any) => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_RECENT_ACTIVITY_CLICKED, {
      activity_id: activity.id,
      activity_type: activity.type, // 'job_applied', 'company_researched', etc
      timestamp: activity.timestamp,
    });
  };

  return (
    <div className="mx-auto max-w-[1440px] p-8">
      <h1 className="text-base font-semibold leading-6 text-text-primary">
        Dashboard
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Activity Feed Section */}
        <div
          className="lg:col-span-2 rounded-lg border border-border-subtle p-6"
          onClick={handleActivityFeedClick}
        >
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="cursor-pointer p-3 hover:bg-background-secondary rounded"
                  onClick={() => handleActivityItemClick(activity)}
                >
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-2">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">
              No recent activity. Start by searching for jobs!
            </p>
          )}
        </div>

        {/* Analytics Section */}
        <div
          className="rounded-lg border border-border-subtle p-6"
          onClick={handleAnalyticsClick}
        >
          <h2 className="text-lg font-semibold mb-4">Your Analytics</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Jobs Applied</span>
              <span className="text-xl font-bold">
                {analyticsData?.jobsApplied || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Jobs Saved</span>
              <span className="text-xl font-bold">
                {analyticsData?.jobsSaved || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">
                Companies Researched
              </span>
              <span className="text-xl font-bold">
                {analyticsData?.companiesResearched || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Success Rate</span>
              <span className="text-xl font-bold">
                {analyticsData?.successRate || "0"}%
              </span>
            </div>
          </div>

          <button className="mt-6 w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">
            View Detailed Analytics
          </button>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Profile Completion"
            value={`${calculateProfileCompletion(user)}%`}
          />
          <StatCard
            label="Resume"
            value={user?.resume ? "Uploaded" : "Pending"}
          />
          <StatCard label="Skills Added" value={user?.skills?.length || 0} />
          <StatCard label="Member Since" value={formatDate(user?.createdAt)} />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-lg border border-border-subtle p-4">
    <p className="text-xs text-text-secondary mb-2">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// Helper Functions
function calculateProfileCompletion(user: any): number {
  if (!user) return 0;
  let completion = 0;
  if (user.name) completion += 25;
  if (user.email) completion += 25;
  if (user.resume) completion += 25;
  if (user.skills && user.skills.length > 0) completion += 25;
  return completion;
}

function formatDate(date: string | undefined): string {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

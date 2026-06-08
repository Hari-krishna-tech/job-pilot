/**
 * Central definition of all PostHog events used in the application
 * This helps maintain consistency across the app and serves as documentation
 */

export const ANALYTICS_EVENTS = {
  // Dashboard
  DASHBOARD_VIEWED: "dashboard_viewed",
  DASHBOARD_ACTIVITY_FEED_VIEWED: "activity_feed_viewed",
  DASHBOARD_ANALYTICS_VIEWED: "analytics_viewed",
  DASHBOARD_RECENT_ACTIVITY_CLICKED: "recent_activity_clicked",

  // Job Finding
  FIND_JOBS_PAGE_VIEWED: "find_jobs_page_viewed",
  JOB_SEARCH_PERFORMED: "job_search_performed",
  JOB_FILTER_APPLIED: "job_filter_applied",
  JOB_FILTER_REMOVED: "job_filter_removed",
  JOB_DETAILS_VIEWED: "job_details_viewed",
  JOB_APPLIED: "job_applied",
  JOB_SAVED: "job_saved",
  JOB_UNSAVED: "job_unsaved",
  JOB_SHARED: "job_shared",
  JOB_RESEARCH_VIEWED: "job_research_viewed",
  JOB_COMPANY_DOSSIER_GENERATED: "company_dossier_generated",

  // Profile
  PROFILE_PAGE_VIEWED: "profile_page_viewed",
  PROFILE_UPDATED: "profile_updated",
  RESUME_UPLOADED: "resume_uploaded",
  RESUME_DELETED: "resume_deleted",
  PROFILE_SKILL_ADDED: "profile_skill_added",
  PROFILE_SKILL_REMOVED: "profile_skill_removed",
  PROFILE_PREFERENCE_CHANGED: "profile_preference_changed",

  // User Actions
  LOGOUT: "user_logged_out",
  NAVIGATION_CLICKED: "navigation_clicked",
  ERROR_OCCURRED: "error_occurred",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

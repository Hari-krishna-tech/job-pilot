"use client";

import { useEffect, useCallback } from "react";
import { usePostHogEvent } from "@/hooks/usePostHogEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

/**
 * EXAMPLE: Find Jobs Page Component
 * Shows how to track searches, filters, and job interactions
 */
export const FindJobsExample = () => {
  const trackEvent = usePostHogEvent();

  // Track page view on mount
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.FIND_JOBS_PAGE_VIEWED);
  }, [trackEvent]);

  const handleSearch = useCallback(
    (query: string, filters: Record<string, any>) => {
      trackEvent(ANALYTICS_EVENTS.JOB_SEARCH_PERFORMED, {
        search_query: query,
        filter_count: Object.keys(filters).length,
        filters: Object.keys(filters), // e.g., ['salary_range', 'job_type', 'location']
      });
    },
    [trackEvent],
  );

  const handleApplyFilter = useCallback(
    (filterName: string, filterValue: any) => {
      trackEvent(ANALYTICS_EVENTS.JOB_FILTER_APPLIED, {
        filter_name: filterName, // e.g., 'job_type', 'salary_range', 'experience_level'
        filter_value: filterValue,
      });
    },
    [trackEvent],
  );

  const handleRemoveFilter = useCallback(
    (filterName: string) => {
      trackEvent(ANALYTICS_EVENTS.JOB_FILTER_REMOVED, {
        filter_name: filterName,
      });
    },
    [trackEvent],
  );

  const handleJobCardClicked = useCallback(
    (jobId: string, jobTitle: string, company: string) => {
      trackEvent(ANALYTICS_EVENTS.JOB_DETAILS_VIEWED, {
        job_id: jobId,
        job_title: jobTitle,
        company_name: company,
      });
    },
    [trackEvent],
  );

  const handleSaveJob = useCallback(
    (jobId: string) => {
      trackEvent(ANALYTICS_EVENTS.JOB_SAVED, {
        job_id: jobId,
      });
    },
    [trackEvent],
  );

  const handleUnsaveJob = useCallback(
    (jobId: string) => {
      trackEvent(ANALYTICS_EVENTS.JOB_UNSAVED, {
        job_id: jobId,
      });
    },
    [trackEvent],
  );

  return (
    <div className="space-y-6">
      <div>
        {/* Search input */}
        <input
          placeholder="Search jobs..."
          onChange={(e) => {
            if (e.target.value.length > 2) {
              handleSearch(e.target.value, {});
            }
          }}
        />
      </div>

      <div>
        {/* Filter controls */}
        <button onClick={() => handleApplyFilter("job_type", "remote")}>
          Remote Only
        </button>
        <button onClick={() => handleRemoveFilter("job_type")}>
          Clear Filter
        </button>
      </div>

      <div>
        {/* Job listing */}
        {/* Example job card */}
        <div
          onClick={() =>
            handleJobCardClicked("job-1", "Senior React Developer", "TechCorp")
          }
        >
          <h3>Senior React Developer</h3>
          <p>TechCorp</p>
          <button onClick={() => handleSaveJob("job-1")}>Save Job</button>
          <button onClick={() => handleUnsaveJob("job-1")}>Unsave Job</button>
        </div>
      </div>
    </div>
  );
};

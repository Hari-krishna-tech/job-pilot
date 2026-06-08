"use client";

import { useEffect, useCallback } from "react";
import { usePostHogEvent } from "@/hooks/usePostHogEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

/**
 * EXAMPLE: Job Details Page Component
 * Shows how to track detailed job interactions and actions
 */
export const JobDetailsExample = ({
  jobId,
  jobTitle,
  company,
}: {
  jobId: string;
  jobTitle: string;
  company: string;
}) => {
  const trackEvent = usePostHogEvent();

  // Track page view with job context
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.JOB_DETAILS_VIEWED, {
      job_id: jobId,
      job_title: jobTitle,
      company_name: company,
    });
  }, [trackEvent, jobId, jobTitle, company]);

  const handleViewResearch = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.JOB_RESEARCH_VIEWED, {
      job_id: jobId,
      company_name: company,
    });
  }, [trackEvent, jobId, company]);

  const handleGenerateDossier = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.JOB_COMPANY_DOSSIER_GENERATED, {
      job_id: jobId,
      company_name: company,
    });
  }, [trackEvent, jobId, company]);

  const handleApplyJob = useCallback(
    (applicationMethod: string) => {
      trackEvent(ANALYTICS_EVENTS.JOB_APPLIED, {
        job_id: jobId,
        job_title: jobTitle,
        company_name: company,
        application_method: applicationMethod, // 'direct', 'email', 'external_link'
      });
    },
    [trackEvent, jobId, jobTitle, company],
  );

  const handleShareJob = useCallback(
    (platform: string) => {
      trackEvent(ANALYTICS_EVENTS.JOB_SHARED, {
        job_id: jobId,
        share_platform: platform, // 'email', 'linkedin', 'twitter', etc.
        company_name: company,
      });
    },
    [trackEvent, jobId, company],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>{jobTitle}</h1>
        <h2>{company}</h2>
      </div>

      <button onClick={handleViewResearch}>View Company Research</button>

      <button onClick={handleGenerateDossier}>Generate Company Dossier</button>

      <button onClick={() => handleApplyJob("direct")}>Apply Now</button>

      <div>
        <button onClick={() => handleShareJob("email")}>Share via Email</button>
        <button onClick={() => handleShareJob("linkedin")}>
          Share on LinkedIn
        </button>
      </div>
    </div>
  );
};

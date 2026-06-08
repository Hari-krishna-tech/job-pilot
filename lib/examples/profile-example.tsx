"use client";

import { useEffect, useCallback } from "react";
import { usePostHogEvent } from "@/hooks/usePostHogEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

/**
 * EXAMPLE: Profile Page Component
 * Shows how to track profile updates and user settings changes
 */
export const ProfileExample = () => {
  const trackEvent = usePostHogEvent();

  // Track page view on mount
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.PROFILE_PAGE_VIEWED);
  }, [trackEvent]);

  const handleProfileUpdate = useCallback(
    (updatedFields: Record<string, any>) => {
      trackEvent(ANALYTICS_EVENTS.PROFILE_UPDATED, {
        fields_updated: Object.keys(updatedFields),
        field_count: Object.keys(updatedFields).length,
        // Include specific details for important fields
        ...Object.fromEntries(
          Object.entries(updatedFields).map(([key, value]) => [
            `updated_${key}`,
            typeof value === "string" ? value.substring(0, 50) : value, // Truncate for privacy
          ]),
        ),
      });
    },
    [trackEvent],
  );

  const handleResumeUpload = useCallback(
    (fileName: string, fileSize: number) => {
      trackEvent(ANALYTICS_EVENTS.RESUME_UPLOADED, {
        file_name: fileName,
        file_size_kb: Math.round(fileSize / 1024),
      });
    },
    [trackEvent],
  );

  const handleResumeDelete = useCallback(
    (fileName: string) => {
      trackEvent(ANALYTICS_EVENTS.RESUME_DELETED, {
        file_name: fileName,
      });
    },
    [trackEvent],
  );

  const handleSkillAdded = useCallback(
    (skill: string, proficiencyLevel?: string) => {
      trackEvent(ANALYTICS_EVENTS.PROFILE_SKILL_ADDED, {
        skill_name: skill,
        proficiency_level: proficiencyLevel || "intermediate", // 'beginner', 'intermediate', 'expert'
      });
    },
    [trackEvent],
  );

  const handleSkillRemoved = useCallback(
    (skill: string) => {
      trackEvent(ANALYTICS_EVENTS.PROFILE_SKILL_REMOVED, {
        skill_name: skill,
      });
    },
    [trackEvent],
  );

  const handlePreferenceChanged = useCallback(
    (preferenceName: string, newValue: any) => {
      trackEvent(ANALYTICS_EVENTS.PROFILE_PREFERENCE_CHANGED, {
        preference_name: preferenceName,
        new_value: newValue,
        // Examples: salary_range, job_type, location, experience_level
      });
    },
    [trackEvent],
  );

  return (
    <div className="space-y-6">
      <section>
        <h2>Profile Information</h2>
        {/* Profile form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProfileUpdate({
              name: "John Doe",
              email: "john@example.com",
              headline: "Senior Developer",
            });
          }}
        >
          <button type="submit">Save Profile</button>
        </form>
      </section>

      <section>
        <h2>Resume</h2>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleResumeUpload(file.name, file.size);
            }
          }}
        />
        <button onClick={() => handleResumeDelete("resume.pdf")}>
          Delete Resume
        </button>
      </section>

      <section>
        <h2>Skills</h2>
        <button onClick={() => handleSkillAdded("React", "expert")}>
          Add React Skill
        </button>
        <button onClick={() => handleSkillRemoved("React")}>
          Remove React Skill
        </button>
      </section>

      <section>
        <h2>Job Preferences</h2>
        <select
          onChange={(e) => handlePreferenceChanged("job_type", e.target.value)}
        >
          <option value="full_time">Full Time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
        </select>

        <select
          onChange={(e) =>
            handlePreferenceChanged("salary_range", e.target.value)
          }
        >
          <option value="50k-75k">$50k - $75k</option>
          <option value="75k-100k">$75k - $100k</option>
          <option value="100k+">$100k+</option>
        </select>
      </section>
    </div>
  );
};

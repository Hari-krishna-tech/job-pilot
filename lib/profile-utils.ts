import type { ProfileFormData } from "@/types";

export const REQUIRED_FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "currentTitle", label: "Current Title" },
  { key: "experienceLevel", label: "Experience Level" },
  { key: "skills", label: "Skills" },
  { key: "workExperience", label: "Work Experience" },
  { key: "education", label: "Education" },
  { key: "jobTitlesSeeking", label: "Job Titles Seeking" },
  { key: "remotePreference", label: "Remote Preference" },
] as const;

export function isFieldComplete(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object" && value !== null) {
    if ("degree" in value) {
      const edu = value as Record<string, string>;
      return edu.degree.length > 0 || edu.field.length > 0 || edu.institution.length > 0;
    }
    return Array.isArray(value) && value.length > 0;
  }
  return false;
}

export function getMissingFields(data: ProfileFormData) {
  const fieldMap = data as unknown as Record<string, unknown>;
  return REQUIRED_FIELDS.filter((f) => !isFieldComplete(fieldMap[f.key]));
}

export function getCompletionPercentage(data: ProfileFormData): number {
  const missing = getMissingFields(data);
  return Math.round(
    ((REQUIRED_FIELDS.length - missing.length) / REQUIRED_FIELDS.length) * 100,
  );
}

export function isProfileComplete(data: ProfileFormData): boolean {
  return getMissingFields(data).length === 0;
}

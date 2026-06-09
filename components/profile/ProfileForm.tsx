"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { ProfileFormData, WorkExperience } from "@/types";
import { TagInput } from "@/components/profile/TagInput";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { saveProfile } from "@/actions/profile";

const EXPERIENCE_LEVELS = [
  { value: "", label: "Select experience level" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const REMOTE_PREFERENCES = [
  { value: "", label: "Select preference" },
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "any", label: "Any" },
];

const COVER_TONES = [
  { value: "", label: "Select tone" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
];

const WORK_AUTHORIZATIONS = [
  { value: "", label: "Select status" },
  { value: "citizen", label: "Citizen" },
  { value: "permanent_resident", label: "Permanent Resident" },
  { value: "visa_required", label: "Visa Required" },
];

const DEGREES = [
  { value: "", label: "Select degree" },
  { value: "Associate", label: "Associate" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "PhD", label: "PhD" },
  { value: "Other", label: "Other" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => {
  const year = CURRENT_YEAR - i;
  return { value: String(year), label: String(year) };
});

function createEmptyExperience(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    companyName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    responsibilities: "",
  };
}

type Props = {
  initialData: ProfileFormData;
  resumeUrl: string | null;
};

function isEmpty(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function mergeFormData(
  current: ProfileFormData,
  extracted: Partial<ProfileFormData>,
): ProfileFormData {
  return {
    ...current,
    fullName: isEmpty(current.fullName) ? (extracted.fullName ?? current.fullName) : current.fullName,
    phone: isEmpty(current.phone) ? (extracted.phone ?? current.phone) : current.phone,
    location: isEmpty(current.location) ? (extracted.location ?? current.location) : current.location,
    linkedinUrl: isEmpty(current.linkedinUrl) ? (extracted.linkedinUrl ?? current.linkedinUrl) : current.linkedinUrl,
    portfolioUrl: isEmpty(current.portfolioUrl) ? (extracted.portfolioUrl ?? current.portfolioUrl) : current.portfolioUrl,
    workAuthorization: isEmpty(current.workAuthorization) ? (extracted.workAuthorization ?? current.workAuthorization) : current.workAuthorization,
    currentTitle: isEmpty(current.currentTitle) ? (extracted.currentTitle ?? current.currentTitle) : current.currentTitle,
    experienceLevel: isEmpty(current.experienceLevel) ? (extracted.experienceLevel ?? current.experienceLevel) : current.experienceLevel,
    yearsExperience: isEmpty(current.yearsExperience) ? (extracted.yearsExperience ?? current.yearsExperience) : current.yearsExperience,
    skills: isEmpty(current.skills) ? (extracted.skills ?? current.skills) : current.skills,
    industries: isEmpty(current.industries) ? (extracted.industries ?? current.industries) : current.industries,
    workExperience: isEmpty(current.workExperience) ? (extracted.workExperience ?? current.workExperience) : current.workExperience,
    education: {
      degree: isEmpty(current.education.degree) ? (extracted.education?.degree ?? current.education.degree) : current.education.degree,
      field: isEmpty(current.education.field) ? (extracted.education?.field ?? current.education.field) : current.education.field,
      institution: isEmpty(current.education.institution) ? (extracted.education?.institution ?? current.education.institution) : current.education.institution,
      year: isEmpty(current.education.year) ? (extracted.education?.year ?? current.education.year) : current.education.year,
    },
    jobTitlesSeeking: isEmpty(current.jobTitlesSeeking) ? (extracted.jobTitlesSeeking ?? current.jobTitlesSeeking) : current.jobTitlesSeeking,
    remotePreference: isEmpty(current.remotePreference) ? (extracted.remotePreference ?? current.remotePreference) : current.remotePreference,
    salaryExpectation: isEmpty(current.salaryExpectation) ? (extracted.salaryExpectation ?? current.salaryExpectation) : current.salaryExpectation,
    preferredLocations: isEmpty(current.preferredLocations) ? (extracted.preferredLocations ?? current.preferredLocations) : current.preferredLocations,
    coverLetterTone: isEmpty(current.coverLetterTone) ? (extracted.coverLetterTone ?? current.coverLetterTone) : current.coverLetterTone,
  };
}

export function ProfileForm({ initialData, resumeUrl }: Props) {
  const [form, setForm] = useState<ProfileFormData>(initialData);
  const [saving, startSave] = useTransition();
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileRef = useRef<File | null>(null);
  const router = useRouter();
  const [currentResumeUrl, setCurrentResumeUrl] = useState(resumeUrl);

  useEffect(() => {
    setCurrentResumeUrl(resumeUrl);
  }, [resumeUrl]);

  useEffect(() => {
    if (feedback?.type === "success") {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleExtract = async () => {
    setFeedback(null);
    setExtracting(true);

    try {
      const payload = new FormData();

      if (fileRef.current) {
        payload.set("resume", fileRef.current);
      }

      const res = await fetch("/api/resume/extract", {
        method: "POST",
        body: payload,
      });

      const json = await res.json();

      if (!json.success) {
        setFeedback({ type: "error", message: json.error ?? "Extraction failed" });
        return;
      }

      setForm((prev) => mergeFormData(prev, json.data));
      setFeedback({ type: "success", message: "Profile fields populated from resume" });
    } catch {
      setFeedback({ type: "error", message: "Failed to extract profile data" });
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    setFeedback(null);
    setGenerating(true);

    try {
      const res = await fetch("/api/resume/generate", { method: "POST" });
      const json = await res.json();

      if (!json.success) {
        setFeedback({ type: "error", message: json.error ?? "Generation failed" });
        return;
      }

      setCurrentResumeUrl(json.data.resumeUrl);
      setFeedback({ type: "success", message: "Resume generated from profile" });
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "Failed to generate resume" });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    setFeedback(null);
    startSave(async () => {
      const payload = new FormData();
      payload.set("profile", JSON.stringify(form));

      if (fileRef.current) {
        payload.set("resume", fileRef.current);
      }

      const result = await saveProfile(payload);
      if (result.success) {
        setFeedback({ type: "success", message: "Profile saved" });
        fileRef.current = null;
      } else {
        setFeedback({
          type: "error",
          message: result.error ?? "Something went wrong",
        });
      }
    });
  };

  const updateField = <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateExperience = (
    index: number,
    field: keyof WorkExperience,
    value: WorkExperience[typeof field],
  ) => {
    setForm((prev) => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: value };
      if (field === "currentlyWorking" && value === true) {
        updated[index].endDate = "";
      }
      return { ...prev, workExperience: updated };
    });
  };

  const addExperience = () => {
    if (form.workExperience.length >= 3) return;
    setForm((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, createEmptyExperience()],
    }));
  };

  const removeExperience = (index: number) => {
    setForm((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const inputClass =
    "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none";

  const labelClass = "block text-sm font-medium text-text-dark mb-1.5";

  return (
    <div className="space-y-6">
      <ResumeUpload
        resumeUrl={currentResumeUrl}
        onFileChange={(file) => {
          fileRef.current = file;
        }}
        onExtract={handleExtract}
        extracting={extracting}
        onGenerate={handleGenerate}
        generating={generating}
      />

      {/* Personal Info */}
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Personal Info
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Aarav Sharma"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.email}
              disabled
              className={`${inputClass} text-text-muted cursor-not-allowed`}
            />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+91 98765 43210"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Bengaluru, KA"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => updateField("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Portfolio / GitHub</label>
            <input
              type="url"
              value={form.portfolioUrl}
              onChange={(e) => updateField("portfolioUrl", e.target.value)}
              placeholder="https://github.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Work Authorization</label>
            <select
              value={form.workAuthorization}
              onChange={(e) =>
                updateField("workAuthorization", e.target.value)
              }
              className={inputClass}
            >
              {WORK_AUTHORIZATIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Professional Info */}
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Professional Info
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Current Job Title</label>
            <input
              type="text"
              value={form.currentTitle}
              onChange={(e) => updateField("currentTitle", e.target.value)}
              placeholder="Software Engineer"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Experience Level</label>
            <select
              value={form.experienceLevel}
              onChange={(e) =>
                updateField("experienceLevel", e.target.value)
              }
              className={inputClass}
            >
              {EXPERIENCE_LEVELS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Years of Experience</label>
            <input
              type="number"
              min="0"
              max="50"
              value={form.yearsExperience}
              onChange={(e) =>
                updateField("yearsExperience", e.target.value)
              }
              placeholder="5"
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Skills</label>
          <TagInput
            tags={form.skills}
            onChange={(tags) => updateField("skills", tags)}
            placeholder="Type a skill and press Enter"
          />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Industries</label>
          <TagInput
            tags={form.industries}
            onChange={(tags) => updateField("industries", tags)}
            placeholder="Type an industry and press Enter"
          />
        </div>
      </section>

      {/* Work Experience */}
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-6 text-text-primary">
            Work Experience
          </h2>
          {form.workExperience.length < 3 && (
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Role
            </button>
          )}
        </div>

        {form.workExperience.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">
            No work experience added yet. Click &quot;Add Role&quot; to get
            started.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {form.workExperience.map((exp, index) => (
              <div
                key={exp.id}
                className="relative rounded-lg border border-border bg-surface-secondary p-4"
              >
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-3 right-3 p-1 text-text-muted hover:text-error transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <p className="mb-3 text-xs font-semibold text-text-dark uppercase">
                  Role {index + 1}
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={exp.companyName}
                      onChange={(e) =>
                        updateExperience(index, "companyName", e.target.value)
                      }
                      placeholder="Acme Inc."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        updateExperience(index, "jobTitle", e.target.value)
                      }
                      placeholder="Software Engineer"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(index, "startDate", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(index, "endDate", e.target.value)
                      }
                      disabled={exp.currentlyWorking}
                      className={`${inputClass} ${
                        exp.currentlyWorking
                          ? "text-text-muted cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.currentlyWorking}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          "currentlyWorking",
                          e.target.checked,
                        )
                      }
                      className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-xs font-medium text-text-secondary">
                      I currently work here
                    </span>
                  </label>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Key Responsibilities
                  </label>
                  <textarea
                    value={exp.responsibilities}
                    onChange={(e) =>
                      updateExperience(
                        index,
                        "responsibilities",
                        e.target.value,
                      )
                    }
                    placeholder="Describe your key responsibilities and achievements..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Education */}
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Education
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Highest Degree</label>
            <select
              value={form.education.degree}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  education: { ...prev.education, degree: e.target.value },
                }))
              }
              className={inputClass}
            >
              {DEGREES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Field of Study</label>
            <input
              type="text"
              value={form.education.field}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  education: { ...prev.education, field: e.target.value },
                }))
              }
              placeholder="Computer Science"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Institution Name</label>
            <input
              type="text"
              value={form.education.institution}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  education: {
                    ...prev.education,
                    institution: e.target.value,
                  },
                }))
              }
              placeholder="MIT"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Graduation Year</label>
            <select
              value={form.education.year}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  education: { ...prev.education, year: e.target.value },
                }))
              }
              className={inputClass}
            >
              <option value="">Select year</option>
              {YEARS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Job Preferences */}
      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Job Preferences
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Remote Preference</label>
            <select
              value={form.remotePreference}
              onChange={(e) =>
                updateField("remotePreference", e.target.value)
              }
              className={inputClass}
            >
              {REMOTE_PREFERENCES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Salary Expectation</label>
            <input
              type="text"
              value={form.salaryExpectation}
              onChange={(e) =>
                updateField("salaryExpectation", e.target.value)
              }
              placeholder="₹12,00,000 - ₹25,00,000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cover Letter Tone</label>
            <select
              value={form.coverLetterTone}
              onChange={(e) =>
                updateField("coverLetterTone", e.target.value)
              }
              className={inputClass}
            >
              {COVER_TONES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Job Titles Seeking</label>
          <TagInput
            tags={form.jobTitlesSeeking}
            onChange={(tags) => updateField("jobTitlesSeeking", tags)}
            placeholder="Type a job title and press Enter"
          />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Preferred Locations</label>
          <TagInput
            tags={form.preferredLocations}
            onChange={(tags) => updateField("preferredLocations", tags)}
            placeholder="Type a location and press Enter"
          />
        </div>
      </section>

      {/* Save Button */}
      <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        {feedback && (
          <p
            className={`text-sm ${
              feedback.type === "success"
                ? "text-success-dark"
                : "text-error"
            }`}
          >
            {feedback.message}
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50 sm:w-auto"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

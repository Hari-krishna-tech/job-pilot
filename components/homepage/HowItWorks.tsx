const steps = [
  {
    number: "01",
    title: "Set Up Your Profile",
    description:
      "Upload your resume and fill in your skills, experience, and job preferences. Our AI can even extract your profile automatically from your resume.",
  },
  {
    number: "02",
    title: "Discover Your Matches",
    description:
      "JobPilot searches across thousands of jobs and scores each one 0-100 against your profile using Deepseek v4 pro. See exactly why you're a fit.",
  },
  {
    number: "03",
    title: "Apply Fully Prepared",
    description:
      "Research any company with one click — get a complete dossier on their tech stack, culture, and what to expect in interviews before you apply.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[30px] font-semibold leading-9 text-text-primary">
            How It Works
          </h2>
          <p className="mt-4 text-sm leading-5 text-text-secondary">
            Three steps from resume to ready-to-apply. No busywork.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <span className="text-[30px] font-semibold leading-9 text-accent">
                {step.number}
              </span>
              <h3 className="mt-4 text-base font-semibold leading-6 text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-5 text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

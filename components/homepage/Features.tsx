const features = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M4.93 19.07l1.41-1.41" />
        <path d="M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    title: "AI-Powered Matching",
    description:
      "Deepseek v4 pro scores every job 0-100 against your actual skills and experience. See exactly which skills match and which gaps to address.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Instant Company Research",
    description:
      "One click researches any company — tech stack, culture, team, and interview talking points. Walk into every interview knowing exactly who you're talking to.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 4-6" />
      </svg>
    ),
    title: "Track Everything in One Place",
    description:
      "Dashboard shows every job found, match scores, company research, and analytics — all in one clean view. No spreadsheets, no scattered bookmarks.",
  },
];

export function Features() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[30px] font-semibold leading-9 text-text-primary">
            Everything You Need to Land the Job
          </h2>
          <p className="mt-4 text-sm leading-5 text-text-secondary">
            Purpose-built for developers who want to job hunt smarter, not
            harder.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-surface-secondary p-6"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-accent-light)" }}
              >
                {feature.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold leading-6 text-text-primary">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-5 text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

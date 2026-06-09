export function Testimonial() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote>
            <p className="text-xl font-medium leading-8 text-text-primary">
              &ldquo;JobPilot cut my job search time in half. Instead of reading
              dozens of job descriptions and researching companies manually, I
              focused on the roles where I was genuinely a strong match.
              Landed my dream role in three weeks.&rdquo;
            </p>
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light">
              <span className="text-sm font-semibold text-accent">SK</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium leading-5 text-text-primary">
                Sarah Kim
              </p>
              <p className="text-xs leading-4 text-text-muted">
                Senior Frontend Engineer at Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

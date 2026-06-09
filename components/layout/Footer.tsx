import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="text-[19px] font-bold leading-7 text-text-darkest">
              JobPilot
            </Link>
            <p className="mt-3 text-sm leading-5 text-text-secondary">
              AI-powered job hunting assistant that finds, scores, and researches
              jobs so you land the right role.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold leading-5 text-text-primary">
              Product
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/find-jobs"
                  className="text-sm leading-5 text-text-secondary transition-colors hover:text-accent"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm leading-5 text-text-secondary transition-colors hover:text-accent"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm leading-5 text-text-secondary transition-colors hover:text-accent"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold leading-5 text-text-primary">
              Resources
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm leading-5 text-text-secondary transition-colors hover:text-accent"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold leading-5 text-text-primary">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm leading-5 text-text-secondary">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm leading-5 text-text-secondary">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs leading-4 text-text-muted">
            &copy; {new Date().getFullYear()} JobPilot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

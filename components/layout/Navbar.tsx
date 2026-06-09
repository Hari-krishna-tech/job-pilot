import Image from "next/image";
import Link from "next/link";
import { createInsforgeServer } from "@/lib/insforge-server";
import { logoutAction } from "@/app/actions/auth";
import { MobileNav } from "@/components/layout/MobileNav";

export async function Navbar() {
  let user = null;

  try {
    const insforge = await createInsforgeServer();
    const { data } = await insforge.auth.getCurrentUser();
    user = data?.user ?? null;
  } catch (err) {
    console.error("[navbar]", err);
  }

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-surface border-b border-border">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={100}
            height={100}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-text-dark transition-colors hover:text-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className="text-sm font-medium text-text-dark transition-colors hover:text-accent"
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-text-dark transition-colors hover:text-accent"
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <form action={logoutAction} className="hidden md:block">
              <button
                type="submit"
                className="rounded-md bg-overlay-dark px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
              >
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-md bg-overlay-dark px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90 md:block"
            >
              Start for free
            </Link>
          )}
          <MobileNav user={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}

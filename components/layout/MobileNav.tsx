"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, LogOutIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logoutAction } from "@/app/actions/auth";

interface MobileNavProps {
  user: boolean;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex items-center justify-center rounded-md p-2 text-text-primary hover:bg-surface-secondary transition-colors md:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-surface p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-sm font-semibold text-text-primary">
            JobPilot
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/find-jobs", label: "Find Jobs" },
            { href: "/profile", label: "Profile" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-text-dark transition-colors hover:bg-surface-secondary hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border px-3 py-4">
          {user ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-error transition-colors hover:bg-surface-secondary"
              >
                <LogOutIcon className="size-4" />
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Start for free
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

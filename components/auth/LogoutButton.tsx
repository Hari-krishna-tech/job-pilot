"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleLogout}
      className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:opacity-50"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}

import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function FindJobsPage() {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error,
    } = await insforge.auth.getCurrentUser();

    if (error || !user) redirect("/login");
  } catch (err) {
    console.error("[find-jobs]", err);
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-[1440px] p-8">
      <h1 className="text-base font-semibold leading-6 text-text-primary">
        Find Jobs
      </h1>
    </div>
  );
}

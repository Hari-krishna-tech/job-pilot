import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: Props) {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error,
    } = await insforge.auth.getCurrentUser();

    if (error || !user) redirect("/login");
  } catch (err) {
    console.error("[find-jobs/[id]]", err);
    redirect("/login");
  }

  const { id } = await params;

  return (
    <div className="mx-auto max-w-[1440px] p-8">
      <h1 className="text-base font-semibold leading-6 text-text-primary">
        Job Details — {id}
      </h1>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function ProfilePage() {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error,
    } = await insforge.auth.getCurrentUser();

    if (error || !user) redirect("/login");
  } catch (err) {
    console.error("[profile]", err);
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-[1440px] p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold leading-6 text-text-primary">
          Profile
        </h1>
        <LogoutButton />
      </div>
    </div>
  );
}

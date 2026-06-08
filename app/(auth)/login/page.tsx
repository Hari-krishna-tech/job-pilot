import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (user) redirect("/dashboard");

  return <LoginForm />;
}

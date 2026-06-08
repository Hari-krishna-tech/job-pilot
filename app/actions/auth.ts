"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function logoutAction() {
  const insforge = await createInsforgeServer();
  await insforge.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("insforge_access_token");
  cookieStore.delete("insforge_refresh_token");

  redirect("/");
}

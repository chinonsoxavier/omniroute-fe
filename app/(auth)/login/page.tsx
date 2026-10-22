import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — OmniStock",
  description:
    "Sign in to the OmniStock operations suite to manage inventory, POS telemetry and AI restocking.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/");

  const params = await searchParams;
  const from = params.from && params.from.startsWith("/") ? params.from : "/";

  return <LoginForm from={from} />;
}

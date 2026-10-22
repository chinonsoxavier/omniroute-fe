import type { Metadata } from "next";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = {
  title: "Set new password — OmniStock",
  description: "Choose a new password for your OmniStock operator account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  return <ResetPasswordForm token={token} />;
}

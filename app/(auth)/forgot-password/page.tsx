import type { Metadata } from "next";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password — OmniStock",
  description:
    "Request a reset token to recover access to your OmniStock operator account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

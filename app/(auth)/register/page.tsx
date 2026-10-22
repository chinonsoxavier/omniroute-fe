import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Create account — OmniStock",
  description:
    "Create an OmniStock operator account to run inventory, receiving and POS operations for your store.",
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/");

  return <RegisterForm />;
}

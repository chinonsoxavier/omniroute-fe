"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  type SessionDraft,
} from "@/lib/auth";

export type AuthState = {
  error?: string;
  success?: string;
  resetToken?: string;
  fields?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FACILITIES = [
  "#104 Flagship",
  "#108 Supercenter",
  "#202 Express Metro",
];

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "operator";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ") || "Store Operator";
}

function safeRedirectTarget(target: string) {
  return target.startsWith("/") && !target.startsWith("//") ? target : "/";
}

async function startSession(draft: SessionDraft) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(draft), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function signInAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const facility = readField(formData, "facility");
  const from = readField(formData, "from");

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid work email address.", fields: { email } };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      fields: { email, facility },
    };
  }

  await startSession({
    email,
    name: nameFromEmail(email),
    role: "Store Director",
    facility: FACILITIES.includes(facility) ? facility : FACILITIES[0],
  });

  redirect(safeRedirectTarget(from));
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const fullName = readField(formData, "fullName");
  const email = readField(formData, "email");
  const facility = readField(formData, "facility");
  const password = readField(formData, "password");
  const confirmPassword = readField(formData, "confirmPassword");
  const acceptedTerms = formData.get("terms") === "on";

  const fields = { fullName, email, facility };

  if (fullName.length < 2) {
    return { error: "Tell us your full name.", fields };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid work email address.", fields };
  }

  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return {
      error: "Use at least 8 characters with a letter and a number.",
      fields,
    };
  }

  if (password !== confirmPassword) {
    return { error: "Those passwords do not match.", fields };
  }

  if (!acceptedTerms) {
    return { error: "Accept the operator agreement to continue.", fields };
  }

  await startSession({
    email,
    name: fullName,
    role: "Store Manager",
    facility: FACILITIES.includes(facility) ? facility : FACILITIES[0],
  });

  redirect("/");
}

export async function requestPasswordResetAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = readField(formData, "email");

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid work email address.", fields: { email } };
  }

  return {
    success:
      "Reset instructions issued. Use the demo token below to set a new password.",
    resetToken: Buffer.from(email, "utf8")
      .toString("base64url")
      .slice(0, 24)
      .toUpperCase(),
    fields: { email },
  };
}

export async function resetPasswordAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const token = readField(formData, "token");
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const confirmPassword = readField(formData, "confirmPassword");
  const fields = { email };

  if (!token) {
    return { error: "Paste the reset token from your email.", fields };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter the account email for this token.", fields };
  }

  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return {
      error: "Use at least 8 characters with a letter and a number.",
      fields,
    };
  }

  if (password !== confirmPassword) {
    return { error: "Those passwords do not match.", fields };
  }

  await startSession({
    email,
    name: nameFromEmail(email),
    role: "Store Director",
    facility: FACILITIES[0],
  });

  redirect("/");
}

export async function signOutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

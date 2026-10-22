"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MailCheck, UserRound } from "lucide-react";
import { requestPasswordResetAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AuthAlert, SubmitButton } from "@/components/auth/form-parts";

const initialState: AuthState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState
  );
  const [copied, setCopied] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-6">
      <LoadingScreen active={isPending} label="Issuing reset token" />
      <div className="space-y-1.5 text-center lg:text-left">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
          Reset your password
        </h1>
        <p className="text-sm text-[#64748B]">
          We&apos;ll issue a reset token for the operator account on your facility.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}
        {state.success && (
          <AuthAlert variant="success">{state.success}</AuthAlert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-[#334155]">
            Work email
          </Label>
          <div className="relative">
            <UserRound className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@omnistock.io"
              defaultValue={state.fields?.email ?? ""}
              className="h-9 pl-9"
              required
            />
          </div>
        </div>

        <SubmitButton pendingLabel="Issuing token...">
          Send reset token
        </SubmitButton>
      </form>

      {state.resetToken && (
        <div className="space-y-2 rounded-lg border border-[#E2E8F0] bg-white p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#065F46]">
            <MailCheck className="w-3.5 h-3.5" />
            DEMO RESET TOKEN
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-[#F1F5F9] px-2 py-1.5 font-mono text-[11px] tracking-wider text-[#0F172A]">
              {state.resetToken}
            </code>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(state.resetToken!);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-2 py-1.5 rounded-md border border-[#CBD5E1] text-[11px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-[11px] text-[#64748B]">
            In production this token is emailed. Paste it on the next step to finish
            recovery.
          </p>
          <Link
            href={`/reset-password?token=${state.resetToken}`}
            className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-md bg-[#064E3B] text-white text-[11px] font-semibold hover:bg-[#022C22] transition-colors"
          >
            Continue with this token
            <ArrowRight className="w-3.5 h-3.5 text-[#34D399]" />
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <Link
          href="/reset-password"
          className="font-semibold text-[#047857] hover:text-[#064E3B]"
        >
          I already have a token
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#0F172A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

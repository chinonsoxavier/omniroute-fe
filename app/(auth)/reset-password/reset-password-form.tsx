"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, KeyRound, Ticket, UserRound } from "lucide-react";
import { resetPasswordAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import {
  AuthAlert,
  FieldHint,
  PasswordStrength,
  SubmitButton,
} from "@/components/auth/form-parts";

const initialState: AuthState = {};

export default function ResetPasswordForm({ token }: { token?: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-sm space-y-6">
      <LoadingScreen active={isPending} label="Updating credentials" />
      <div className="space-y-1.5 text-center lg:text-left">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
          Set a new password
        </h1>
        <p className="text-sm text-[#64748B]">
          Verify your reset token, then choose new operator credentials.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}

        <div className="space-y-1.5">
          <Label htmlFor="token" className="text-xs text-[#334155]">
            Reset token
          </Label>
          <div className="relative">
            <Ticket className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="token"
              name="token"
              placeholder="Paste token"
              defaultValue={token}
              className="h-9 pl-9 font-mono text-xs tracking-wider"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-[#334155]">
            Account email
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

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs text-[#334155]">
            New password
          </Label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="h-9 pl-9 pr-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {password.length > 0 ? (
            <PasswordStrength password={password} />
          ) : (
            <FieldHint>Use 8+ characters with a letter and a number.</FieldHint>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs text-[#334155]">
            Confirm new password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="h-9"
            required
          />
        </div>

        <SubmitButton pendingLabel="Updating credentials...">
          Update password
        </SubmitButton>
      </form>

      <div className="flex items-center justify-between text-xs">
        <Link
          href="/forgot-password"
          className="font-semibold text-[#047857] hover:text-[#064E3B]"
        >
          Request a new token
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

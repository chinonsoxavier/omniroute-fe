"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Radio, ShieldCheck, UserRound } from "lucide-react";
import { signInAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AuthAlert, SubmitButton } from "@/components/auth/form-parts";

const FACILITIES = ["#104 Flagship", "#108 Supercenter", "#202 Express Metro"];

const initialState: AuthState = {};

export default function LoginForm({ from }: { from: string }) {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-6">
      <LoadingScreen active={isPending} label="Authenticating operator" />
      <div className="space-y-1.5 text-center lg:text-left">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
          Welcome back
        </h1>
        <p className="text-sm text-[#64748B]">
          Sign in to your store operations workspace.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="from" value={from} />

        {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}

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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs text-[#334155]">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#047857] hover:text-[#064E3B]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-9 pr-9"
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
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="facility" className="text-xs text-[#334155]">
            Facility
          </Label>
          <select
            id="facility"
            name="facility"
            defaultValue={state.fields?.facility ?? FACILITIES[0]}
            className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 cursor-pointer"
          >
            {FACILITIES.map(facility => (
              <option key={facility} value={facility}>
                {facility}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-[#475569] cursor-pointer">
            <Checkbox id="remember" name="remember" defaultChecked />
            Keep me signed in
          </label>
        </div>

        <SubmitButton pendingLabel="Authenticating...">
          Sign in to operations
        </SubmitButton>
      </form>

      <div className="flex items-center gap-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-2 text-[11px] text-[#065F46]">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>
          Demo build — any email with 6+ character password signs you in as store
          director.
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
        <Radio className="w-3.5 h-3.5 text-[#10B981]" />
        <span>42 POS terminals synced · telemetry nominal</span>
      </div>

      <p className="text-center text-xs text-[#64748B]">
        New to OmniStock?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#047857] hover:text-[#064E3B]"
        >
          Create an operator account
        </Link>
      </p>
    </div>
  );
}

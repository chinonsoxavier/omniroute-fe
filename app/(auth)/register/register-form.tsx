"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  UserRound,
} from "lucide-react";
import { signUpAction, type AuthState } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingScreen } from "@/components/ui/loading-screen";
import {
  AuthAlert,
  FieldHint,
  PasswordStrength,
  SubmitButton,
} from "@/components/auth/form-parts";

const FACILITIES = ["#104 Flagship", "#108 Supercenter", "#202 Express Metro"];

const initialState: AuthState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-sm space-y-6">
      <LoadingScreen active={isPending} label="Provisioning operator access" />
      <div className="space-y-1.5 text-center lg:text-left">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
          Create your operator account
        </h1>
        <p className="text-sm text-[#64748B]">
          Provision store access for inventory, receiving and register telemetry.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && <AuthAlert variant="error">{state.error}</AuthAlert>}

        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs text-[#334155]">
            Full name
          </Label>
          <div className="relative">
            <UserRound className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Alex Moreno"
              defaultValue={state.fields?.fullName ?? ""}
              className="h-9 pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-[#334155]">
            Work email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@omnistock.io"
            defaultValue={state.fields?.email ?? ""}
            className="h-9"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="facility" className="text-xs text-[#334155]">
            Primary facility
          </Label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="facility"
              name="facility"
              defaultValue={state.fields?.facility ?? FACILITIES[0]}
              className="h-9 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 cursor-pointer"
            >
              {FACILITIES.map(facility => (
                <option key={facility} value={facility}>
                  {facility}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs text-[#334155]">
            Password
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
          {password.length > 0 && <PasswordStrength password={password} />}
          {password.length === 0 && (
            <FieldHint>Use 8+ characters with a letter and a number.</FieldHint>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs text-[#334155]">
            Confirm password
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

        <label className="flex items-start gap-2 text-xs text-[#475569] cursor-pointer">
          <Checkbox id="terms" name="terms" className="mt-0.5" />
          <span>
            I agree to the operator data policy and store telemetry terms for this
            facility.
          </span>
        </label>

        <SubmitButton pendingLabel="Provisioning access...">
          Create account
        </SubmitButton>
      </form>

      <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
        <BadgeCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
        <span>
          Access is scoped per facility. Directors can approve additional operators
          in settings.
        </span>
      </div>

      <p className="text-center text-xs text-[#64748B]">
        Already provisioned?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#047857] hover:text-[#064E3B]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

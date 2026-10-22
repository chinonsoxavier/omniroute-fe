"use client";

import { useFormStatus } from "react-dom";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthAlert({
  variant,
  children,
}: {
  variant: "error" | "success";
  children: React.ReactNode;
}) {
  const isError = variant === "error";

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs animate-in fade-in duration-150",
        isError
          ? "bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]"
          : "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
      )}
    >
      {isError ? (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-px" />
      )}
      <span className="font-medium leading-snug">{children}</span>
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full h-9 inline-flex items-center justify-center gap-2 rounded-lg bg-[#064E3B] text-white text-sm font-semibold hover:bg-[#022C22] transition-colors shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{pending ? pendingLabel : children}</span>
    </button>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-[#64748B] leading-snug">{children}</p>;
}

export function PasswordStrength({ password }: { password: string }) {
  const score = Math.min(
    4,
    (password.length >= 8 ? 1 : 0) +
      (password.length >= 12 ? 1 : 0) +
      (/[a-zA-Z]/.test(password) && /\d/.test(password) ? 1 : 0) +
      (/[^a-zA-Z0-9]/.test(password) ? 1 : 0)
  );
  const labels = ["Too short", "Weak", "Fair", "Strong", "Excellent"];
  const colors = [
    "bg-[#E2E8F0]",
    "bg-[#FECDD3]",
    "bg-[#FDE68A]",
    "bg-[#6EE7B7]",
    "bg-[#10B981]",
  ];

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(index => (
          <div
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full",
              index < score ? colors[score] : "bg-[#E2E8F0]"
            )}
          />
        ))}
      </div>
      <p className="text-[11px] text-[#64748B]">
        Strength: <span className="font-semibold text-[#334155]">{labels[score]}</span>
      </p>
    </div>
  );
}

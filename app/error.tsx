"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl shadow-xs p-8 text-center space-y-5">
        <div className="w-11 h-11 rounded-lg bg-[#FFF1F2] text-[#9F1239] flex items-center justify-center mx-auto">
          <TriangleAlert className="w-6 h-6 text-[#E11D48]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Telemetry interrupted
          </h1>
          <p className="text-sm text-[#64748B]">
            The operations view hit an unexpected fault. The floor data is safe — retry
            the request to resume.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-[#94A3B8]">Ref: {error.digest}</p>
          )}
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#34D399]" />
          Retry request
        </button>
      </div>
    </div>
  );
}

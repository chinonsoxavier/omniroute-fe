import Link from "next/link";
import { LayoutDashboard, PackageSearch, Store } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl shadow-xs p-8 text-center space-y-5">
        <div className="w-11 h-11 rounded-lg bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mx-auto">
          <PackageSearch className="w-6 h-6 text-[#10B981]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Aisle not found
          </h1>
          <p className="text-sm text-[#64748B]">
            This route is not on the floor plan. It may have been moved, renamed, or
            never existed in the OmniStock operations surface.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-[#34D399]" />
            Back to dashboard
          </Link>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-md transition-colors"
          >
            <Store className="w-4 h-4 text-[#064E3B]" />
            Open inventory
          </Link>
        </div>
      </div>
    </div>
  );
}

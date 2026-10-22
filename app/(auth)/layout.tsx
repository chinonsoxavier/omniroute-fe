import Link from "next/link";
import {
  Store,
  LineChart,
  ScanBarcode,
  Boxes,
  Bot,
  ShieldCheck,
} from "lucide-react";

const highlights = [
  {
    icon: LineChart,
    title: "Live POS telemetry",
    body: "Real-time register velocity, basket size and hourly rush forecasting.",
  },
  {
    icon: Boxes,
    title: "Predictive restocking",
    body: "Safety buffer monitoring with one-click purchase order drafting.",
  },
  {
    icon: ScanBarcode,
    title: "Barcode sync",
    body: "EAN-13 handheld scanning wired straight into your floor stock ledger.",
  },
  {
    icon: Bot,
    title: "AI floor copilot",
    body: "Markdown, relocation and audit recommendations grounded in store data.",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:grid lg:grid-cols-[1fr_minmax(0,560px)]">
      {/* Brand / marketing panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-[#064E3B] p-10 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #34D399 0, transparent 45%), radial-gradient(circle at 80% 70%, #6EE7B7 0, transparent 40%)",
          }}
        />

        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
            <Store className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold tracking-tight text-[16px]">
                OmniStock
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1 py-0.5 bg-[#34D399]/15 text-[#6EE7B7] rounded">
                OPS &amp; AI
              </span>
            </div>
            <p className="text-[11px] text-[#A7F3D0] font-medium leading-tight">
              SUPERMARKET SUITE
            </p>
          </div>
        </Link>

        <div className="relative space-y-7">
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-extrabold leading-tight tracking-tight">
              Run every aisle,
              <br />
              every shift, in sync.
            </h2>
            <p className="text-sm text-[#A7F3D0] max-w-md leading-relaxed">
              Inventory, sales telemetry and AI restocking for multi-store grocery
              operations — unified on a single operations surface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {highlights.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-3 rounded-lg bg-white/[0.06] ring-1 ring-white/10"
              >
                <Icon className="w-4 h-4 text-[#34D399]" />
                <div className="text-[13px] font-semibold mt-2">{title}</div>
                <p className="text-[11px] text-[#A7F3D0] mt-0.5 leading-snug">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-[11px] text-[#A7F3D0]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          <span>
            SOC 2 aligned telemetry · 18 aisles instrumented · 42 POS terminals
            synced
          </span>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex flex-col min-h-screen lg:min-h-0">
        <div className="lg:hidden p-4 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] flex items-center justify-center">
              <Store className="w-4 h-4 text-[#34D399]" />
            </div>
            <span className="font-heading font-bold text-[15px] tracking-tight text-[#0F172A]">
              OmniStock
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-5 sm:p-8">
          {children}
        </div>

        <div className="p-4 text-center text-[11px] text-[#94A3B8]">
          © {new Date().getFullYear()} OmniStock Retail Systems. All telemetry
          rights reserved.
        </div>
      </div>
    </div>
  );
}

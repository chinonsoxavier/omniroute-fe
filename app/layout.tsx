import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OmniStock — Supermarket Inventory & AI Retail Operations Suite",
  description: "Enterprise supermarket inventory operations, live POS sales telemetry, predictive restocking analytics, and AI store management suite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F8FAFC] text-[#0F172A] font-sans">
        {children}
      </body>
    </html>
  );
}

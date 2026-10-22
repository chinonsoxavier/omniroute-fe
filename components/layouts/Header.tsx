'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  PlusCircle,
  PackagePlus,
  Radio,
  ChevronRight,
  AlertTriangle,
  Clock,
  Sparkles,
  DollarSign,
  LogOut,
  Settings,
  UserRound
} from 'lucide-react';
import { signOutAction } from '@/actions/auth';
import { initialsOf } from '@/lib/auth';
import { useInventory } from '@/lib/inventory-context';

interface HeaderProps {
  user?: { name: string; email: string; role: string } | null;
  onOpenRecordSale?: () => void;
  onOpenIntakeStock?: () => void;
  onOpenQuickSearch?: () => void;
}

export default function Header({
  user,
  onOpenRecordSale,
  onOpenIntakeStock,
  onOpenQuickSearch
}: HeaderProps) {
  const { products, telemetry } = useInventory();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const displayName = user?.name ?? 'Sarah Jenkins';
  const displayRole = user?.role ?? 'General Store Director';
  const displayEmail = user?.email ?? 'sarah.jenkins@omnistock.io';
  const displayInitials = initialsOf(displayName) || 'SJ';

  // Compute urgent alerts
  const lowBufferProducts = products.filter(p => p.currentStock <= p.reorderPoint);
  const expiringProducts = products.filter(p => p.daysUntilExpiry !== undefined && p.daysUntilExpiry <= 3);
  const totalAlerts = lowBufferProducts.length + expiringProducts.length;

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-1/3 min-w-[280px]">
        <div
          onClick={onOpenQuickSearch}
          className="w-full flex items-center justify-between bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs text-[#64748B] hover:border-[#10B981] hover:bg-white transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Quick search SKU, Barcode (EAN-13)...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#CBD5E1] rounded text-[#475569] shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-3">
        {/* Shift & Registers status */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-md px-2.5 py-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#1E293B]">
            <span className="font-bold text-[#064E3B]">SHIFT 1</span>
            <span className="text-[#94A3B8]">•</span>
            <span>REGISTERS: {telemetry.activeRegisters}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <button
          onClick={onOpenRecordSale}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#064E3B] text-[#064E3B] hover:bg-[#F0FDF4] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Record Sale</span>
        </button>

        <button
          onClick={onOpenIntakeStock}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
        >
          <PackagePlus className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Intake Stock</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-md border border-[#E2E8F0] flex items-center justify-center text-[#334155] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E11D48] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {totalAlerts}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-[#0F172A]">Store Operations Alerts</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-[#FFF1F2] text-[#9F1239] font-bold rounded">
                    {totalAlerts} Active
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#64748B] hover:text-[#0F172A]"
                >
                  Close
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {lowBufferProducts.map(p => (
                  <div
                    key={p.id}
                    className="p-2 rounded bg-[#FFFBEB] border border-[#FDE68A] text-xs flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#92400E]">{p.name}</div>
                      <div className="text-[11px] text-[#B45309]">
                        Stock: {p.currentStock} {p.unit} (Reorder threshold: {p.reorderPoint})
                      </div>
                    </div>
                  </div>
                ))}

                {expiringProducts.map(p => (
                  <div
                    key={p.id}
                    className="p-2 rounded bg-[#FFF1F2] border border-[#FECDD3] text-xs flex items-start gap-2"
                  >
                    <Clock className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#9F1239]">{p.name}</div>
                      <div className="text-[11px] text-[#BE123C]">
                        Expiring in {p.daysUntilExpiry} days • 20% Markdown recommended
                      </div>
                    </div>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <div className="py-6 text-center text-xs text-[#64748B]">
                    No urgent stock or expiry alerts. Inventory is optimal!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(value => !value)}
            className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] cursor-pointer"
            aria-label="Account menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#064E3B] text-[#34D399] font-bold text-xs flex items-center justify-center ring-1 ring-[#064E3B]/20">
              {displayInitials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-[#0F172A] leading-tight">{displayName}</div>
              <div className="text-[10px] text-[#64748B] font-medium leading-tight uppercase">{displayRole}</div>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 text-[#64748B] hidden sm:block transition-transform ${showProfile ? 'rotate-90' : ''}`}
            />
          </button>

          {showProfile && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfile(false)}
                aria-hidden
              />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-2 border-b border-[#F1F5F9]">
                  <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <UserRound className="w-3.5 h-3.5 text-[#10B981]" />
                    {displayName}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">{displayEmail}</div>
                  <div className="text-[10px] text-[#059669] font-semibold uppercase mt-0.5">{displayRole}</div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-xs text-[#334155] hover:bg-[#F1F5F9] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Store settings</span>
                </Link>

                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-xs text-[#9F1239] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

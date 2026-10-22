'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  LineChart,
  Bot,
  ShoppingCart,
  Truck,
  Users,
  ScanBarcode,
  Settings,
  Store,
  ChevronDown,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';

export default function Sidebar() {
  const pathname = usePathname();
  const { activeFacility, setActiveFacility, products, telemetry } = useInventory();

  const navOperationsCore = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Inventory & Stocks',
      href: '/inventory',
      icon: Boxes,
      badge: products.filter(p => p.currentStock <= p.reorderPoint).length > 0 ? `${products.filter(p => p.currentStock <= p.reorderPoint).length}` : null
    },
    {
      name: 'Analytics & Reports',
      href: '/analytics',
      icon: LineChart,
      badge: null
    },
    {
      name: 'AI Copilot',
      href: '/ai-copilot',
      icon: Bot,
      badge: 'AI'
    }
  ];

  const navCommerceTelemetry = [
    {
      name: 'POS & Sales Register',
      href: '/sales',
      icon: ShoppingCart,
      badge: null
    },
    {
      name: 'Intake & PO Receiving',
      href: '/intake',
      icon: Truck,
      badge: null
    },
    {
      name: 'Suppliers & POs',
      href: '/suppliers',
      icon: Users,
      badge: null
    },
    {
      name: 'Barcode Scanner Sync',
      href: '/scanner',
      icon: ScanBarcode,
      badge: null
    }
  ];

  const facilities = ['#104 Flagship', '#108 Supercenter', '#202 Express Metro'];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#064E3B] flex items-center justify-center text-white shadow-sm ring-1 ring-[#064E3B]/20">
            <Store className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0F172A] tracking-tight text-[16px] font-heading">OmniStock</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1 py-0.2 bg-[#ECFDF5] text-[#065F46] rounded">OPS & AI</span>
            </div>
            <p className="text-[11px] text-[#64748B] font-medium leading-tight">SUPERMARKET SUITE</p>
          </div>
        </Link>
      </div>

      {/* Facility Switcher */}
      <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider mb-1 px-1">CURRENT FACILITY</div>
        <div className="relative group">
          <div className="w-full bg-white border border-[#CBD5E1] rounded-md p-2 flex items-center justify-between hover:border-[#064E3B] transition-colors cursor-pointer shadow-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-xs text-[#0F172A] truncate">{activeFacility}</div>
                <div className="text-[10px] text-[#64748B] truncate">Floor Aisle 1-18 • Active</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          </div>

          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-lg p-1 hidden group-hover:block z-50">
            {facilities.map(f => (
              <button
                key={f}
                onClick={() => setActiveFacility(f)}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center justify-between hover:bg-[#F0FDF4] transition-colors ${
                  activeFacility === f ? 'font-semibold text-[#064E3B] bg-[#ECFDF5]' : 'text-[#334155]'
                }`}
              >
                <span>{f}</span>
                {activeFacility === f && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Operations Core */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider px-2 mb-1.5">OPERATIONS CORE</div>
          <nav className="space-y-0.5">
            {navOperationsCore.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#064E3B] text-white shadow-xs font-semibold'
                      : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#64748B]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-emerald-800 text-emerald-100'
                          : item.badge === 'AI'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Commerce & Supply Telemetry */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider px-2 mb-1.5">COMMERCE & TELEMETRY</div>
          <nav className="space-y-0.5">
            {navCommerceTelemetry.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#064E3B] text-white shadow-xs font-semibold'
                      : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#64748B]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#E2E8F0] text-[#334155]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
        <div className="bg-white border border-[#E2E8F0] rounded-md p-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#0F172A] mb-1">
            <span className="text-[#64748B]">TELEMETRY LINK</span>
            <span className="flex items-center gap-1 text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              {telemetry.telemetryStatus}
            </span>
          </div>
          <div className="text-[10px] text-[#64748B] flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#10B981]" />
            <span>Handheld Units: {telemetry.handheldUnitsOnline}</span>
          </div>
        </div>

        <Link
          href="/settings"
          className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
            pathname === '/settings' ? 'bg-[#064E3B] text-white' : 'text-[#334155] hover:bg-[#F1F5F9]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#64748B]" />
          <span>Store Settings</span>
        </Link>
      </div>
    </aside>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Boxes,
  Clock,
  Sparkles,
  ShoppingBag,
  DollarSign,
  Plus,
  RefreshCw,
  CheckCircle2,
  Truck,
  ScanLine,
  Layers,
  FileSpreadsheet,
  Zap,
  ArrowRight,
  Radio,
  Flame,
  Snowflake,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { ProductThumb } from '@/components/shared/media';
import StockOverrideDrawer from '@/components/modals/StockOverrideDrawer';
import RecordSaleModal from '@/components/modals/RecordSaleModal';
import IntakeStockModal from '@/components/modals/IntakeStockModal';
import { Product } from '@/lib/types';

export default function DashboardPage() {
  const {
    products,
    telemetry,
    sales,
    auditLogs,
    activeFacility,
    autoDraftLowStockPOs,
    runFloorAudit,
    overridePrice
  } = useInventory();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [isIntakeStockOpen, setIsIntakeStockOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [draftedCount, setDraftedCount] = useState<number | null>(null);

  // Critical safety buffer items (stock <= reorder point)
  const criticalItems = products.filter(p => p.currentStock <= p.reorderPoint);

  // Velocity Spotlights
  const topVelocityItems = [...products].sort((a, b) => b.unitsSoldToday - a.unitsSoldToday).slice(0, 3);
  const zeroVelocityItems = products.filter(p => p.daysIdle > 10).slice(0, 2);

  // Handle One-Click Auto Reorder
  const handleAutoReorder = () => {
    const count = autoDraftLowStockPOs();
    setDraftedCount(count);
    setTimeout(() => setDraftedCount(null), 3500);
  };

  // Handle Run AI Floor Audit
  const handleRunFloorAudit = async () => {
    setIsAuditing(true);
    const result = await runFloorAudit();
    setIsAuditing(false);
    setAuditMessage(result);
    setTimeout(() => setAuditMessage(null), 6000);
  };

  // Apply Quick Markdown
  const handleQuickMarkdown = (product: Product, percentage: number) => {
    const newPrice = Number((product.retailPrice * (1 - percentage / 100)).toFixed(2));
    overridePrice(product.id, newPrice, product.wholesaleCost, `Quick Markdown -${percentage}% applied from Operations Dashboard`, true);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Top Banner: Store Operations & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] font-semibold rounded-md border border-[#A7F3D0]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              POS TERMINALS SYNCED 42S AGO
            </span>
            <span className="text-[#64748B]">•</span>
            <span className="text-[#475569] font-medium">{telemetry.weather}</span>
            <span className="text-[#64748B]">•</span>
            <span className="px-2 py-0.5 bg-[#FFFBEB] text-[#92400E] font-medium rounded-md border border-[#FDE68A] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#D97706]" />
              Peak Foot Traffic: {telemetry.peakFootTraffic}
            </span>
          </div>

          <div className="flex items-baseline gap-3 pt-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] font-heading">
              Today&apos;s Store Operations
            </h1>
            <span className="text-xs text-[#64748B] font-mono">
              Telemetry Shift 01 • Active Store ID: {activeFacility}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsRecordSaleOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#34D399]" />
            <span>New Sale / Batch Entry</span>
          </button>

          <button
            onClick={() => setIsIntakeStockOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#064E3B]" />
            <span>Scan Inbound PO</span>
          </button>

          <button
            onClick={handleRunFloorAudit}
            disabled={isAuditing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5] text-xs font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-[#10B981] ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing 18 Aisles...' : 'Run AI Floor Audit'}</span>
          </button>
        </div>
      </div>

      {/* Audit notification banner */}
      {auditMessage && (
        <div className="p-3 bg-[#ECFDF5] border border-[#10B981] rounded-lg text-xs text-[#065F46] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-medium">{auditMessage}</span>
          </div>
          <Link href="/inventory" className="font-bold underline text-[#064E3B] hover:text-[#022C22]">
            View Shelves
          </Link>
        </div>
      )}

      {/* Drafted PO notification */}
      {draftedCount !== null && (
        <div className="p-3 bg-[#EFF6FF] border border-[#3B82F6] rounded-lg text-xs text-[#1E40AF] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <span>Successfully drafted {draftedCount} purchase order(s) for low safety buffer items!</span>
          </div>
          <Link href="/suppliers" className="font-bold underline text-[#1E40AF]">
            View POs
          </Link>
        </div>
      )}

      {/* 4 Core Operational KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Today's Gross Sales */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                TODAY&apos;S GROSS SALES
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono tracking-tight">
                ${telemetry.todayGrossSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">
              84.3% of ${telemetry.todayTargetSales.toLocaleString()} Target
            </span>
            <span className="font-semibold text-[#059669] flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{telemetry.salesGrowthVsYest}% vs Yest
            </span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between font-mono">
            <span>{telemetry.totalTransactions.toLocaleString()} Checkout Tx</span>
            <span>Avg Basket: ${telemetry.avgBasketSize.toFixed(2)}</span>
          </div>
        </div>

        {/* Card 2: Stock Valuation & Volume */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                STOCK VALUATION & VOLUME
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono tracking-tight">
                14,820 <span className="text-xs font-normal text-[#64748B]">SKUs</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#064E3B] flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Store Ledger Value:</span>
            <span className="font-bold font-mono text-[#0F172A]">${telemetry.storeLedgerValue.toLocaleString()}</span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between">
            <span className="flex items-center gap-1 text-[#059669] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {telemetry.inStockFillRate}% In-Stock Fill
            </span>
            <span>12 Active Depts</span>
          </div>
        </div>

        {/* Card 3: Stockout Alerts */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                STOCKOUT ALERTS
              </span>
              <div className="text-2xl font-bold text-rose-600 mt-1 font-mono tracking-tight flex items-baseline gap-2">
                {products.filter(p => p.currentStock === 0).length}{' '}
                <span className="text-xs font-semibold text-rose-500">Out of Stock</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">{criticalItems.length} Items Low Buffer</span>
            <button
              onClick={handleAutoReorder}
              className="px-2 py-0.5 rounded bg-[#FFFBEB] text-[#92400E] hover:bg-[#FDE68A] font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Needs Reorder
            </button>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between font-medium">
            <span className="text-[#059669] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-PO Ready
            </span>
            <span>Safety Buffer: 91%</span>
          </div>
        </div>

        {/* Card 4: Shrinkage & Spoilage Risk */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                SHRINKAGE & SPOILAGE RISK
              </span>
              <div className="text-2xl font-bold text-[#D97706] mt-1 font-mono tracking-tight">
                ${telemetry.shrinkageRiskAmount.toFixed(2)}
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">
              {products.filter(p => p.daysUntilExpiry && p.daysUntilExpiry <= 3).length} Perishables at Risk
            </span>
            <span className="font-semibold text-[#059669]">-18% vs Last Wk</span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between">
            <span className="text-[#065F46] font-medium">Produce & Dairy Priority</span>
            <span>Cold Chain: {telemetry.coldChainTempAvg}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Velocity Curve & Breakdown, Right 24h Spotlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Real-Time Terminal Velocity & Dept Breakdown */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <h2 className="text-sm font-bold text-[#0F172A]">Live Velocity & Department Breakdown</h2>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Real-time register scan streams across 5 major grocery sectors
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-md text-xs font-semibold">
                <span className="px-2.5 py-1 bg-white text-[#064E3B] rounded shadow-2xs">Today</span>
                <span className="px-2.5 py-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer">7D Trend</span>
                <span className="px-2.5 py-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer">Dept Heatmap</span>
              </div>
            </div>

            {/* Department Sales Distribution Stack Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0F172A]">Department Sales Contribution</span>
                <span className="font-mono text-xs text-[#64748B]">Hourly velocity: $3,490/hr</span>
              </div>

              {/* Segmented Color Bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 bg-[#F1F5F9]">
                <div style={{ width: '28%' }} className="bg-[#064E3B]" title="Produce (28%)" />
                <div style={{ width: '22%' }} className="bg-[#10B981]" title="Dairy & Eggs (22%)" />
                <div style={{ width: '19%' }} className="bg-[#059669]" title="Meat/Seafood (19%)" />
                <div style={{ width: '17%' }} className="bg-[#6EE7B7]" title="Packaged (17%)" />
                <div style={{ width: '14%' }} className="bg-[#022C22]" title="Bakery (14%)" />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#475569] pt-1 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#064E3B]" /> Produce (28%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]" /> Dairy & Eggs (22%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#059669]" /> Meat/Seafood (19%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6EE7B7]" /> Packaged (17%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#022C22]" /> Bakery (14%)</span>
              </div>
            </div>

            {/* Hourly Velocity SVG Curve Visualization */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-[11px] text-[#64748B] uppercase tracking-wider">
                  HOURLY CHECKOUT VELOCITY & REGISTER RUSH TREND
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#059669] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Live Register Pulse
                </span>
              </div>

              <div className="relative h-44 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 flex flex-col justify-end">
                <svg className="w-full h-32 overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="grad-pulse" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M 0,100 Q 80,90 140,85 T 260,50 T 360,60 T 480,20 T 600,70 L 600,120 L 0,120 Z"
                    fill="url(#grad-pulse)"
                  />
                  {/* Stroke spline */}
                  <path
                    d="M 0,100 Q 80,90 140,85 T 260,50 T 360,60 T 480,20 T 600,70"
                    fill="none"
                    stroke="#064E3B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Peak Point */}
                  <circle cx="480" cy="20" r="4.5" fill="#064E3B" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Peak callout overlay */}
                <div className="absolute top-4 right-[20%] bg-[#064E3B] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  5:30 PM Peak Projected
                </div>

                {/* X Axis Timeline Labels */}
                <div className="flex justify-between text-[10px] text-[#64748B] pt-2 border-t border-[#E2E8F0] font-mono">
                  <span>07:00 AM (Open)</span>
                  <span>10:00 AM</span>
                  <span>12:30 PM (Lunch)</span>
                  <span>03:00 PM</span>
                  <span className="font-bold text-[#064E3B]">05:30 PM (Evening Rush)</span>
                  <span>08:00 PM</span>
                  <span>10:00 PM (Close)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): 24h Velocity Spotlights */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#064E3B]" />
                <h2 className="text-sm font-bold text-[#0F172A]">24h Velocity Spotlights</h2>
              </div>
              <span className="text-[10px] font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                Rolling 24H
              </span>
            </div>

            {/* Top Sales Velocity */}
            <div>
              <div className="text-[10px] uppercase font-bold text-[#059669] tracking-wider mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                TOP SALES VELOCITY
              </div>

              <div className="space-y-2">
                {topVelocityItems.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#10B981] hover:bg-[#F0FDF4] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <ProductThumb
                        src={prod.imageUrl}
                        alt={prod.name}
                        department={prod.department}
                        size={28}
                        rounded="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-xs text-[#0F172A]">{prod.name}</div>
                        <div className="text-[10px] text-[#64748B]">
                          {prod.department} • ${prod.retailPrice.toFixed(2)}/{prod.unit}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-xs text-[#064E3B]">
                        {prod.unitsSoldToday} sold
                      </div>
                      <div className="text-[10px] text-[#059669] font-medium font-mono">
                        +${(prod.unitsSoldToday * prod.retailPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero Velocity Attention */}
            <div className="pt-2 border-t border-[#E2E8F0]">
              <div className="text-[10px] uppercase font-bold text-[#E11D48] tracking-wider mb-2 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                ZERO-VELOCITY ATTENTION
              </div>

              <div className="space-y-2">
                {zeroVelocityItems.map(prod => (
                  <div
                    key={prod.id}
                    className="p-2.5 rounded-lg bg-[#FFF1F2]/60 border border-[#FECDD3] text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-[#0F172A]">{prod.name}</div>
                        <div className="text-[10px] text-[#64748B]">
                          {prod.aisle} ({prod.bay}) • ${prod.retailPrice.toFixed(2)}
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 bg-[#FFE4E6] text-[#9F1239] font-bold text-[10px] rounded">
                        0 sold / {prod.daysIdle} days
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#FECDD3]/50">
                      <span className="text-[10px] text-[#9F1239] font-medium">
                        AI: Flash Markdown or Relocate
                      </span>
                      <button
                        onClick={() => handleQuickMarkdown(prod, 25)}
                        className="text-[10px] font-bold bg-[#E11D48] text-white px-2 py-0.5 rounded hover:bg-[#BE123C] transition-colors"
                      >
                        -25% Markdown
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Left Urgent Reorders Table, Right Shift Receiving Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Reorders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Critical Safety Buffers & Urgent Reorders</h2>
              </div>
              <p className="text-xs text-[#64748B]">High-velocity SKUs nearing minimum floor replenishment thresholds</p>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FFF1F2] text-[#9F1239] rounded-full border border-[#FECDD3]">
              {criticalItems.length} Requires Action Now
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F1F5F9] text-[#475569] uppercase text-[10px] font-bold border-b border-[#CBD5E1]">
                  <th className="py-2 px-3">Product / Department</th>
                  <th className="py-2 px-3 text-right">Floor Stock</th>
                  <th className="py-2 px-3 text-center">Safety Run Rate</th>
                  <th className="py-2 px-3 text-center">Status / AI Guidance</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {criticalItems.slice(0, 5).map(prod => (
                  <tr key={prod.id} className="inventory-row">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <ProductThumb
                          src={prod.imageUrl}
                          alt={prod.name}
                          department={prod.department}
                          size={32}
                        />
                        <div>
                          <div className="font-semibold text-[#0F172A]">{prod.name}</div>
                          <div className="text-[11px] text-[#64748B]">
                            {prod.sku} • {prod.supplierName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={prod.currentStock === 0 ? 'text-rose-600' : 'text-[#D97706]'}>
                        {prod.currentStock} {prod.unit}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center text-[11px] text-[#64748B] font-mono">
                      ~{Math.max(1, Math.round(prod.currentStock / 2.5))} hrs of supply
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.currentStock === 0
                            ? 'bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3]'
                            : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                        }`}
                      >
                        {prod.currentStock === 0 ? 'Stockout Imminent' : 'Low Buffer'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="px-2.5 py-1 bg-[#064E3B] text-white hover:bg-[#022C22] rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        One-Click PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift Receiving & Activity Log (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#064E3B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Receiving & Shift Log</h2>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map(log => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">{log.productName}</span>
                  <span className="text-[10px] font-mono text-[#64748B]">{log.timestamp}</span>
                </div>
                <div className="text-[11px] text-[#475569]">{log.reason}</div>
                <div className="text-[10px] text-[#059669] font-medium flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                  <span>By {log.user}</span>
                  <span className="font-mono">{log.actionType}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/inventory"
            className="w-full block text-center py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-md text-xs font-semibold transition-colors"
          >
            View Complete Audit Log ({auditLogs.length} Events)
          </Link>
        </div>
      </div>

      {/* Stock Override Drawer Trigger Modal */}
      <StockOverrideDrawer
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Record Sale Modal */}
      <RecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
      />

      {/* Intake Stock Modal */}
      <IntakeStockModal
        isOpen={isIntakeStockOpen}
        onClose={() => setIsIntakeStockOpen(false)}
      />
    </div>
  );
}

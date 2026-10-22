'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  ShoppingBag,
  Percent,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Tag,
  Flame,
  Snowflake,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { Product, DeadStockAlert } from '@/lib/types';
import StockOverrideDrawer from '@/components/modals/StockOverrideDrawer';

export default function AnalyticsPage() {
  const {
    products,
    deadStockAlerts,
    applyDeadStockAction,
    demandForecasts,
    analyticsPeriod,
    setAnalyticsPeriod,
    selectedDepartment,
    setSelectedDepartment,
    exportSalesCSV,
    generateShiftReport
  } = useInventory();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showExecutiveReportModal, setShowExecutiveReportModal] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filter products by selected department if active
  const filteredProducts = selectedDepartment === 'All Departments'
    ? products
    : products.filter(p => p.department.includes(selectedDepartment) || selectedDepartment.includes(p.department));

  // Top sold velocity drivers
  const topSoldItems = [...filteredProducts].sort((a, b) => b.unitsSoldMonth - a.unitsSoldMonth);

  // Handle dead stock action
  const handleDeadStockResolution = (alert: DeadStockAlert) => {
    applyDeadStockAction(alert.id, alert.actionType);
    setActionSuccessMsg(`Action "${alert.recommendedAction}" executed for ${alert.productName}! Price and ESL updated.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Period multiplier simulations
  const periodMultiplier = analyticsPeriod === 'daily' ? 0.033 : analyticsPeriod === 'weekly' ? 0.23 : analyticsPeriod === 'yearly' ? 12 : 1;

  const baseGrossRev = 284520 * periodMultiplier;
  const baseUnits = Math.round(68410 * periodMultiplier);
  const baseGrossProfit = 108686 * periodMultiplier;
  const baseCogs = 175834 * periodMultiplier;

  const handleCopyReport = () => {
    const reportText = generateShiftReport();
    navigator.clipboard.writeText(reportText);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2000);
  };

  const departments = [
    'All Departments',
    'Produce',
    'Dairy',
    'Meat & Deli',
    'Bakery',
    'Grocery / Dry'
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Top Banner: Predictive Retail Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              PREDICTIVE RETAIL TELEMETRY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] font-heading mt-0.5">
            Supermarket Sales & Demand Intelligence
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActionSuccessMsg('Comparing current period against previous 30-day baseline (+18.4% Revenue delta).')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Compare vs Previous Period</span>
          </button>

          <button
            onClick={() => setActionSuccessMsg('Automated shift summary email scheduled for delivery at 21:00 Daily.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Schedule Automated Email</span>
          </button>

          <button
            onClick={() => setShowExecutiveReportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#34D399]" />
            <span>Download Executive Report (PDF/Excel)</span>
          </button>
        </div>
      </div>

      {/* Success banner */}
      {actionSuccessMsg && (
        <div className="p-3 bg-[#ECFDF5] border border-[#10B981] rounded-lg text-xs text-[#065F46] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-medium">{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-[#064E3B] font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Period & Department Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-xs">
        {/* Period Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'daily', label: 'Daily (Today)' },
            { id: 'weekly', label: 'Weekly (W43)' },
            { id: 'monthly', label: 'Monthly (October 2024)' },
            { id: 'yearly', label: 'Yearly (FY 2024)' },
            { id: 'custom', label: 'Custom' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAnalyticsPeriod(tab.id as any)}
              className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                analyticsPeriod === tab.id
                  ? 'bg-[#064E3B] text-white shadow-2xs'
                  : 'bg-white text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] uppercase font-bold text-[#64748B] shrink-0">DEPT:</span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedDepartment === dept
                  ? 'bg-[#064E3B] text-white font-semibold shadow-2xs'
                  : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Total Gross Revenue */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                TOTAL GROSS REVENUE
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono tracking-tight">
                ${baseGrossRev.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#059669] font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4% vs prev. month
            </span>
            <span className="text-[11px] text-[#64748B] font-mono">
              (${(baseGrossRev * 0.84).toLocaleString('en-US', { maximumFractionDigits: 0 })})
            </span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between">
            <span>Target: ${(baseGrossRev * 0.96).toLocaleString('en-US', { maximumFractionDigits: 0 })} (103.4%)</span>
            <span className="text-[#059669] font-bold">Beat Quota</span>
          </div>
        </div>

        {/* Metric 2: Units Dispensed */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                UNITS DISPENSED
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono tracking-tight">
                {baseUnits.toLocaleString()} Units
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#064E3B] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#059669] font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +9.1% vs prev. period
            </span>
            <span className="text-[11px] text-[#64748B] font-mono">
              ({(baseUnits * 0.91).toFixed(0)} units)
            </span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between font-mono">
            <span>Scan Rate: 34.2 units/min</span>
            <span>POS: 99.4%</span>
          </div>
        </div>

        {/* Metric 3: Gross Profit Margin */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                GROSS PROFIT MARGIN
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono tracking-tight">
                38.2%
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center">
              <Percent className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#059669] font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +1.6 pts
            </span>
            <span className="text-[11px] font-mono text-[#0F172A] font-bold">
              ${baseGrossProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} gross profit
            </span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between font-mono">
            <span>COGS: ${baseCogs.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            <span>Waste Shrinkage: 1.1%</span>
          </div>
        </div>

        {/* Metric 4: Avg Transaction Value */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                AVG TRANSACTION VALUE
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono tracking-tight">
                $41.58
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#064E3B] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#059669] font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +$3.48 up
            </span>
            <span className="text-[11px] text-[#64748B] font-mono">
              from $38.10 base
            </span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] flex justify-between font-mono">
            <span>6,842 Checkout Orders</span>
            <span>Avg Cart: 10.0 Items</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Left Revenue & Volume Curve, Right Sales Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue & Volume Velocity Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">Revenue & Volume Velocity Trend</h2>
                <p className="text-xs text-[#64748B]">
                  Daily breakdown across period • Bars represent Dollar Revenue ($k), Green spline indicates Footfall Basket Count
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#064E3B] rounded-xs" /> Daily Gross Rev ($k)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#10B981] rounded-full" /> Baskets (Count)</span>
              </div>
            </div>

            {/* Custom Interactive SVG Chart */}
            <div className="mt-4 relative h-56 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col justify-end">
              {/* Bars + Spline */}
              <div className="relative h-40 w-full flex items-end justify-between px-2 gap-2">
                {[
                  { day: 'Oct 01', rev: 45, baskets: 180 },
                  { day: 'Oct 03', rev: 52, baskets: 210 },
                  { day: 'Oct 05', rev: 68, baskets: 290 },
                  { day: 'Oct 08', rev: 48, baskets: 190 },
                  { day: 'Oct 10', rev: 72, baskets: 310 },
                  { day: 'Oct 12', rev: 59, baskets: 240 },
                  { day: 'Oct 15', rev: 64, baskets: 270 },
                  { day: 'Oct 18', rev: 80, baskets: 340 },
                  { day: 'Oct 20', rev: 71, baskets: 295 },
                  { day: 'Oct 22', rev: 60, baskets: 250 },
                  { day: 'Oct 25', rev: 85, baskets: 360 },
                  { day: 'Oct 28', rev: 78, baskets: 320 },
                  { day: 'Oct 30', rev: 95, baskets: 395 },
                  { day: 'Oct 31', rev: 88, baskets: 370 }
                ].map((pt, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-[#0F172A] text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      ${pt.rev * 150} • {pt.baskets} baskets
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${pt.rev}%` }}
                      className="w-full max-w-[20px] bg-[#064E3B] group-hover:bg-[#10B981] transition-colors rounded-t-xs"
                    />
                  </div>
                ))}
              </div>

              {/* Timeline labels */}
              <div className="flex justify-between text-[10px] text-[#64748B] pt-2 border-t border-[#E2E8F0] font-mono mt-2">
                <span>Oct 01</span>
                <span>Oct 05</span>
                <span>Oct 10</span>
                <span>Oct 15</span>
                <span>Oct 20</span>
                <span>Oct 25</span>
                <span className="font-bold text-[#064E3B]">Oct 31 (Today)</span>
              </div>
            </div>
          </div>

          {/* Footer Callouts */}
          <div className="mt-4 pt-3 border-t border-[#F1F5F9] grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B]">HIGHEST DAY</div>
              <div className="font-bold text-[#0F172A] mt-0.5">Oct 30 ($16.4k • 384 Baskets)</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B]">AVERAGE RUN RATE</div>
              <div className="font-bold text-[#0F172A] mt-0.5">$9,178 / 24-hr cycle</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B]">PROMO UPLIFT FACTOR</div>
              <div className="font-bold text-[#059669] mt-0.5">+23.8% on Flash Weekends</div>
            </div>
          </div>
        </div>

        {/* Right: Sales Contribution by Department (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Sales Contribution</h2>
              <p className="text-xs text-[#64748B]">Aggregate revenue split across 5 sectors</p>
            </div>
            <span className="text-[10px] font-bold uppercase bg-[#F1F5F9] text-[#334155] px-2 py-0.5 rounded">
              BY DEPARTMENT
            </span>
          </div>

          {/* Stacked bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 bg-[#F1F5F9]">
            <div style={{ width: '27%' }} className="bg-[#064E3B]" title="Produce (27%)" />
            <div style={{ width: '22%' }} className="bg-[#10B981]" title="Meat/Seafood (22%)" />
            <div style={{ width: '21%' }} className="bg-[#059669]" title="Dairy (21%)" />
            <div style={{ width: '19%' }} className="bg-[#6EE7B7]" title="Packaged (19%)" />
            <div style={{ width: '11%' }} className="bg-[#022C22]" title="Bakery (11%)" />
          </div>

          {/* Department Breakdown List */}
          <div className="space-y-2.5 text-xs">
            <div className="p-2 bg-[#F8FAFC] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#064E3B]" />
                <div>
                  <div className="font-semibold text-[#0F172A]">Produce (Fresh Greens & Fruit)</div>
                  <div className="text-[10px] text-[#64748B]">High Velocity • $76,820</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#0F172A] font-mono">27%</div>
                <div className="text-[10px] text-[#059669] font-medium">+3.2% YoY</div>
              </div>
            </div>

            <div className="p-2 bg-[#F8FAFC] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <div>
                  <div className="font-semibold text-[#0F172A]">Meat, Seafood & Deli</div>
                  <div className="text-[10px] text-[#64748B]">High Value • $62,594</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#0F172A] font-mono">22%</div>
                <div className="text-[10px] text-[#059669] font-medium">+1.8% YoY</div>
              </div>
            </div>

            <div className="p-2 bg-[#F8FAFC] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                <div>
                  <div className="font-semibold text-[#0F172A]">Dairy, Eggs & Plant Milk</div>
                  <div className="text-[10px] text-[#64748B]">Stable Staple • $59,749</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#0F172A] font-mono">21%</div>
                <div className="text-[10px] text-[#64748B] font-medium">0.0% YoY</div>
              </div>
            </div>

            <div className="p-2 bg-[#F8FAFC] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6EE7B7]" />
                <div>
                  <div className="font-semibold text-[#0F172A]">Packaged / Canned Dry Goods</div>
                  <div className="text-[10px] text-[#64748B]">Long Shelf • $54,058</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#0F172A] font-mono">19%</div>
                <div className="text-[10px] text-rose-600 font-medium">-2.1% YoY</div>
              </div>
            </div>

            <div className="p-2 bg-[#F8FAFC] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#022C22]" />
                <div>
                  <div className="font-semibold text-[#0F172A]">Bakery & Artisan Breads</div>
                  <div className="text-[10px] text-[#64748B]">Fresh Batch • $31,297</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#0F172A] font-mono">11%</div>
                <div className="text-[10px] text-[#059669] font-medium">+4.5% YoY</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs flex justify-between items-center">
            <span className="text-[#065F46] font-medium">Top Grossing Dept:</span>
            <span className="font-bold text-[#064E3B] font-mono">Produce ($76.8k)</span>
          </div>
        </div>
      </div>

      {/* Lower Section: Left Most Sold (Velocity Drivers), Right Dead Stock & Low Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Sold Items Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#059669]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Top Sold Items (Velocity Drivers)</h2>
              </div>
              <p className="text-xs text-[#64748B]">Ranked by volumetric units dispensed and gross contribution</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] rounded">
              TOP 5 OF 10
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F1F5F9] text-[#334155] uppercase text-[10px] font-bold border-b border-[#CBD5E1]">
                  <th className="py-2 px-3">RANK / SKU</th>
                  <th className="py-2 px-3">PRODUCT NAME</th>
                  <th className="py-2 px-3 text-right">UNITS SOLD</th>
                  <th className="py-2 px-3 text-right">TOTAL REV</th>
                  <th className="py-2 px-3 text-center">MARGIN</th>
                  <th className="py-2 px-3 text-right">TURNOVER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {topSoldItems.slice(0, 5).map((prod, idx) => (
                  <tr
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="inventory-row cursor-pointer"
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#064E3B] font-mono">#{idx + 1}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">{prod.sku}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#0F172A]">{prod.name}</div>
                      <div className="text-[10px] text-[#64748B]">{prod.aisle} • {prod.department}</div>
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0F172A]">
                      {prod.unitsSoldMonth.toLocaleString()}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#064E3B]">
                      ${prod.revenueMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                        {prod.grossMargin}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-[#475569]">
                      {prod.turnoverRate}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dead Stock & Low Velocity Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Dead Stock & Low Velocity Alerts</h2>
              </div>
              <p className="text-xs text-[#64748B]">Identified shelf dwell days without checkout events</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FFF1F2] text-[#9F1239] rounded">
              ACTION REQUIRED
            </span>
          </div>

          <div className="space-y-3">
            {deadStockAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-[#0F172A]">{alert.productName}</div>
                    <div className="text-[10px] text-[#64748B]">{alert.shelfLocation}</div>
                  </div>
                  <span className="font-mono font-bold text-[#E11D48] text-xs">
                    {alert.daysIdle} d idle
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1 border-t border-[#F1F5F9]">
                  <span>Stock: <strong>{alert.stock} {alert.unit}</strong></span>
                  <span>Tied Capital: <strong className="text-[#0F172A]">${alert.tiedCapital.toFixed(2)}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#92400E] font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#D97706]" />
                    AI Recommendation
                  </span>
                  <button
                    onClick={() => handleDeadStockResolution(alert)}
                    className="px-2.5 py-1 bg-[#064E3B] hover:bg-[#022C22] text-white font-semibold text-[10px] rounded transition-colors"
                  >
                    {alert.recommendedAction}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-lg text-xs flex justify-between items-center">
            <span className="text-[#9F1239] font-semibold">Tied Capital Recovery Potential:</span>
            <span className="font-bold text-rose-700 font-mono">$902.50 at risk</span>
          </div>
        </div>
      </div>

      {/* Upcoming Demand Forecast & Seasonal Trends */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Upcoming Demand Forecast & Seasonal Trends
              </h2>
              <p className="text-xs text-[#64748B]">
                Machine learning forecast based on previous 3-year historical weekend telemetry and local weather events
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] rounded">
            AI PROJECTED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demandForecasts.map(fc => (
            <div
              key={fc.id}
              className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    {fc.tag}
                  </span>
                  <span
                    className={`font-bold text-xs font-mono px-2 py-0.5 rounded ${
                      fc.isPositive
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                        : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                    }`}
                  >
                    {fc.changePercentage}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#0F172A]">{fc.title}</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  {fc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#64748B]">Supplier Lead: {fc.supplierLead}</span>
                <Link
                  href="/suppliers"
                  className="font-bold text-[#064E3B] hover:text-[#022C22] flex items-center gap-1"
                >
                  <span>{fc.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Report Download Modal */}
      {showExecutiveReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#0F172A]">Supermarket Executive Intelligence Report</h3>
              <button
                onClick={() => setShowExecutiveReportModal(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-[#0F172A] text-emerald-300 font-mono text-xs p-4 rounded-lg overflow-x-auto max-h-60 whitespace-pre-wrap leading-relaxed">
                {generateShiftReport()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyReport}
                  className="flex-1 py-2 bg-white border border-[#CBD5E1] text-[#334155] rounded-md text-xs font-semibold hover:bg-[#F1F5F9] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{reportCopied ? 'Copied to Clipboard!' : 'Copy Shift Summary'}</span>
                </button>

                <button
                  onClick={exportSalesCSV}
                  className="flex-1 py-2 bg-[#064E3B] text-white rounded-md text-xs font-semibold hover:bg-[#022C22] flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Export Sales (CSV)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Override Drawer Trigger */}
      <StockOverrideDrawer
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

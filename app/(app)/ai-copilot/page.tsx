'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  Send,
  RefreshCw,
  FileText,
  Boxes,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  Truck,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Download,
  Terminal,
  ScanLine
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { AIMessage } from '@/lib/types';

export default function AiCopilotPage() {
  const {
    products,
    telemetry,
    suppliers,
    purchaseOrders,
    deadStockAlerts,
    aiMessages,
    isAiTyping,
    sendAiMessage,
    runFloorAudit,
    autoDraftLowStockPOs,
    generateShiftReport,
    activeFacility
  } = useInventory();

  const [inputQuery, setInputQuery] = useState('');
  const [activeReportTab, setActiveReportTab] = useState<'chat' | 'shift_report' | 'floor_audit' | 'margin_audit'>('chat');
  const [auditProgress, setAuditProgress] = useState<{ running: boolean; result?: string }>({ running: false });
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const quickPrompts = [
    { label: 'Generate Morning Restock Order', icon: Truck, query: 'Recommend reorders to prevent weekend stockouts on produce and dairy' },
    { label: 'Identify Dead Stock & Margin Leaks', icon: AlertTriangle, query: 'Which items are idle with tied up capital and need promotional markdowns?' },
    { label: 'Analyze Expiring Perishables (≤ 48h)', icon: Clock, query: 'List all perishable batches nearing expiration within 48-72 hours' },
    { label: 'Top Sales Velocity Drivers', icon: TrendingUp, query: 'Show me the top 5 most sold items by revenue and margin' },
    { label: 'Cold-Chain & Spoilage Health', icon: ShieldCheck, query: 'Audit cold-chain temperatures and daily shrinkage risk amount' }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAiTyping) return;
    sendAiMessage(inputQuery);
    setInputQuery('');
  };

  const handleQuickPromptClick = (query: string) => {
    sendAiMessage(query);
  };

  const handleExecuteAction = (actionId: string) => {
    if (actionId === 'auto_draft_po') {
      const count = autoDraftLowStockPOs();
      setActionNotice(`Auto-drafted ${count} Purchase Orders for all low-buffer items!`);
      setTimeout(() => setActionNotice(null), 4000);
    } else if (actionId === 'run_floor_audit') {
      handleTriggerFloorAudit();
    } else {
      setActionNotice(`Action executed successfully across 2.4GHz Electronic Shelf Labels.`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleTriggerFloorAudit = async () => {
    setAuditProgress({ running: true });
    const res = await runFloorAudit();
    setAuditProgress({ running: false, result: res });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center ring-2 ring-[#10B981]/30 shadow-xs">
            <Bot className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#0F172A] font-heading">
                OmniStock AI Inventory Copilot
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Live Context Connected
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Autonomous retail telemetry, algorithmic demand forecasting & stockout mitigation engine
            </p>
          </div>
        </div>

        {/* View mode tabs */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveReportTab('chat')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeReportTab === 'chat' ? 'bg-[#064E3B] text-white shadow-2xs' : 'text-[#475569] hover:bg-white'
            }`}
          >
            Copilot Chat
          </button>
          <button
            onClick={() => setActiveReportTab('shift_report')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeReportTab === 'shift_report' ? 'bg-[#064E3B] text-white shadow-2xs' : 'text-[#475569] hover:bg-white'
            }`}
          >
            Executive Shift Brief
          </button>
          <button
            onClick={() => setActiveReportTab('floor_audit')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeReportTab === 'floor_audit' ? 'bg-[#064E3B] text-white shadow-2xs' : 'text-[#475569] hover:bg-white'
            }`}
          >
            AI Floor Audit Simulator
          </button>
        </div>
      </div>

      {/* Action notification */}
      {actionNotice && (
        <div className="p-3 bg-[#ECFDF5] border border-[#10B981] rounded-lg text-xs text-[#065F46] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold">{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-[#064E3B] font-bold">✕</button>
        </div>
      )}

      {/* Main Viewport Content */}
      {activeReportTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
          {/* Left: Chat Conversation Window (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex flex-col overflow-hidden">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {aiMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4 text-[#34D399]" />
                    </div>
                  )}

                  <div className={`max-w-2xl space-y-2.5 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                    {/* Speech bubble */}
                    <div
                      className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#064E3B] text-white rounded-tr-xs'
                          : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {/* Structured Data Attachment (if present) */}
                    {msg.structuredData && (
                      <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl shadow-sm text-xs space-y-3">
                        {msg.structuredData.title && (
                          <div className="font-bold text-[#0F172A] flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                              {msg.structuredData.title}
                            </span>
                            <span className="text-[10px] font-mono text-[#64748B] uppercase">Real-time Telemetry</span>
                          </div>
                        )}

                        {/* Metric grid */}
                        {msg.structuredData.metrics && (
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(msg.structuredData.metrics).map(([k, v]) => (
                              <div key={k} className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                                <div className="text-[10px] text-[#64748B] font-medium">{k}</div>
                                <div className="text-xs font-bold text-[#0F172A] font-mono mt-0.5">{v}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Items list */}
                        {msg.structuredData.items && (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {msg.structuredData.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-semibold text-[#0F172A]">{it.name || it.productName}</div>
                                  <div className="text-[10px] text-[#64748B]">
                                    {it.sku && `${it.sku} • `}
                                    {it.currentStock && `Stock: ${it.currentStock} • `}
                                    {it.supplier && `Supplier: ${it.supplier}`}
                                    {it.location && `Location: ${it.location}`}
                                    {it.idle && `Idle: ${it.idle}`}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {it.revenue && <div className="font-bold text-[#064E3B] font-mono">{it.revenue}</div>}
                                  {it.unitsSold && <div className="text-[10px] text-[#64748B] font-mono">{it.unitsSold}</div>}
                                  {it.tiedCapital && <div className="font-bold text-[#E11D48] font-mono">{it.tiedCapital}</div>}
                                  {it.recommendedPrice && <div className="font-bold text-[#059669] font-mono">{it.recommendedPrice}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        {msg.structuredData.actions && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F1F5F9]">
                            {msg.structuredData.actions.map(act => (
                              <button
                                key={act.actionId}
                                onClick={() => handleExecuteAction(act.actionId)}
                                className="px-3 py-1.5 bg-[#064E3B] hover:bg-[#022C22] text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <Zap className="w-3 h-3 text-[#34D399]" />
                                <span>{act.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-[10px] text-[#94A3B8] font-mono px-1">
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] text-[#064E3B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      SJ
                    </div>
                  )}
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Bot className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs flex items-center gap-2 text-[#64748B]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    <span>Analyzing 14,820 SKU catalog & store telemetry...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask OmniStock AI: 'What products are expiring this weekend?', 'Draft POs for low stock'..."
                className="flex-1 bg-white border border-[#CBD5E1] rounded-md px-3.5 py-2 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isAiTyping}
                className="px-4 py-2 bg-[#064E3B] hover:bg-[#022C22] disabled:opacity-50 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Right: Quick Action Insights & Prompts (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Action Prompt Chips */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <Zap className="w-4 h-4 text-[#064E3B]" />
                <h3 className="font-bold text-xs text-[#0F172A]">Instant AI Workflows</h3>
              </div>

              <div className="space-y-2">
                {quickPrompts.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuickPromptClick(p.query)}
                      className="w-full text-left p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#10B981] hover:bg-[#F0FDF4] transition-all text-xs flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-white text-[#064E3B] border border-[#E2E8F0] group-hover:border-[#10B981] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-[#0F172A] group-hover:text-[#064E3B]">
                          {p.label}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#064E3B]" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Telemetry Context Summary */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#064E3B]" />
                  <h3 className="font-bold text-xs text-[#0F172A]">Copilot Telemetry Feed</h3>
                </div>
                <span className="text-[10px] font-mono text-[#059669] font-bold">100% ONLINE</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Active Facility:</span>
                  <span className="font-semibold text-[#0F172A]">{activeFacility}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Tracked SKUs:</span>
                  <span className="font-mono text-[#0F172A]">14,820 Active</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Low Safety Buffers:</span>
                  <span className="font-mono font-bold text-[#D97706]">
                    {products.filter(p => p.currentStock <= p.reorderPoint).length} Items
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Cold-Chain Telemetry:</span>
                  <span className="font-mono text-[#059669]">{telemetry.coldChainTempAvg}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>ESL Wireless Gateway:</span>
                  <span className="font-mono text-[#059669]">2.4GHz Synced</span>
                </div>
              </div>

              <button
                onClick={() => autoDraftLowStockPOs()}
                className="w-full py-2 bg-[#064E3B] text-white hover:bg-[#022C22] rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Truck className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Auto-Draft All Restock POs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewport Tab: Executive Shift Report */}
      {activeReportTab === 'shift_report' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Executive Shift Handover & Operations Brief</h2>
              <p className="text-xs text-[#64748B]">Synthesized from live POS transactions, backroom intake, and shelf scans</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateShiftReport());
                setActionNotice('Shift Report copied to clipboard!');
                setTimeout(() => setActionNotice(null), 3000);
              }}
              className="px-3.5 py-1.5 bg-[#064E3B] text-white rounded-md text-xs font-semibold hover:bg-[#022C22] flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Copy Shift Report</span>
            </button>
          </div>

          <div className="bg-[#0F172A] text-emerald-300 font-mono text-xs p-5 rounded-lg leading-relaxed whitespace-pre-wrap">
            {generateShiftReport()}
          </div>
        </div>
      )}

      {/* Viewport Tab: AI Floor Audit Simulator */}
      {activeReportTab === 'floor_audit' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">18-Aisle Electronic Shelf & Telemetry Audit</h2>
              <p className="text-xs text-[#64748B]">Live 2.4GHz gateway broadcast verifying shelf pricing, stockouts & misplacement</p>
            </div>
            <button
              onClick={handleTriggerFloorAudit}
              disabled={auditProgress.running}
              className="px-4 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] rounded-md text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-[#34D399] ${auditProgress.running ? 'animate-spin' : ''}`} />
              <span>{auditProgress.running ? 'Auditing Aisles 1-18...' : 'Run New Store Audit'}</span>
            </button>
          </div>

          {/* Audit Results Card */}
          {auditProgress.result && (
            <div className="p-4 bg-[#ECFDF5] border border-[#10B981] rounded-lg text-xs text-[#065F46] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              <div>
                <span className="font-bold block">Audit Completed:</span>
                <span>{auditProgress.result}</span>
              </div>
            </div>
          )}

          {/* Visual Aisle Grid Simulator */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 18 }, (_, i) => {
              const aisleNum = i + 1;
              const hasAlert = aisleNum === 2 || aisleNum === 8;
              return (
                <div
                  key={aisleNum}
                  className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                    hasAlert
                      ? 'bg-[#FFFBEB] border-[#FDE68A]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A]">Aisle {aisleNum}</span>
                    <span className={`w-2 h-2 rounded-full ${hasAlert ? 'bg-[#D97706]' : 'bg-[#10B981]'}`} />
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-2">
                    {aisleNum <= 2 ? 'Produce & Greens' : aisleNum <= 4 ? 'Dairy & Cold Chain' : aisleNum <= 8 ? 'Pantry & Grocery' : 'Beverages & Household'}
                  </div>
                  <div className="text-[10px] font-mono text-[#064E3B] font-semibold mt-1">
                    {hasAlert ? '1 Flagged SKU' : '100% Synced'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

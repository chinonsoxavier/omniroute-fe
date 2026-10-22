'use client';

import React, { useState } from 'react';
import {
  Settings,
  Store,
  Radio,
  Thermometer,
  ShieldCheck,
  Bell,
  RefreshCw,
  CheckCircle2,
  Database,
  Layers,
  SlidersHorizontal,
  Key,
  Cpu
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';

export default function SettingsPage() {
  const {
    activeFacility,
    setActiveFacility,
    telemetry,
    resetToSampleData,
    exportInventoryCSV,
    exportSalesCSV
  } = useInventory();

  const [safetyBufferDays, setSafetyBufferDays] = useState(3);
  const [coldChainMin, setColdChainMin] = useState(32);
  const [coldChainMax, setColdChainMax] = useState(38);
  const [eslChannel, setEslChannel] = useState('2.4GHz Channel 11 (Auto-hopping)');
  const [posSyncInterval, setPosSyncInterval] = useState('30s (Real-time Stream)');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice('Store telemetry parameters & ESL gateway thresholds updated successfully!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all supermarket inventory, sales, and AI logs to demo initial data?')) {
      resetToSampleData();
      setSavedNotice('Database reset to fresh supermarket mock data!');
      setTimeout(() => setSavedNotice(null), 3500);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
            <Settings className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
              Store Settings & System Telemetry Configuration
            </h1>
            <p className="text-xs text-[#64748B]">
              Supermarket Facility Parameters • Safety Buffer Limits • Electronic Shelf Gateways
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#CBD5E1] text-rose-700 hover:bg-[#FFF1F2] text-xs font-semibold rounded-md transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-rose-600" />
          <span>Reset Sample Demo Data</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-[#ECFDF5] border border-[#10B981] rounded-lg text-xs text-[#065F46] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold">{savedNotice}</span>
          </div>
          <button onClick={() => setSavedNotice(null)} className="text-[#064E3B] font-bold">✕</button>
        </div>
      )}

      {/* Main Settings Forms */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Facilities & Reorder Safety Buffers */}
        <div className="lg:col-span-6 space-y-6">
          {/* Facility Selection */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <Store className="w-4 h-4 text-[#064E3B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Active Supermarket Facility</h2>
            </div>

            <div className="space-y-2">
              {[
                { name: '#104 Flagship', desc: 'Aisles 1-18 • 14 POS Terminals • Full Cold-Chain Vault' },
                { name: '#108 Supercenter', desc: 'Aisles 1-28 • 22 POS Terminals • Bakery & Butcher On-site' },
                { name: '#202 Express Metro', desc: 'Aisles 1-8 • 6 Express Registers • Grab & Go Focus' }
              ].map(fac => (
                <div
                  key={fac.name}
                  onClick={() => setActiveFacility(fac.name)}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    activeFacility === fac.name
                      ? 'bg-[#ECFDF5] border-[#10B981] text-[#064E3B]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div>
                    <div className="font-bold">{fac.name}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">{fac.desc}</div>
                  </div>
                  {activeFacility === fac.name && (
                    <span className="w-5 h-5 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Buffer & Auto-PO Rules */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <SlidersHorizontal className="w-4 h-4 text-[#064E3B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Safety Buffer & Reorder Rules</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  Default Days of Supply Safety Buffer (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={safetyBufferDays}
                  onChange={e => setSafetyBufferDays(Number(e.target.value))}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold text-[#0F172A]"
                />
                <p className="text-[11px] text-[#64748B] mt-1">
                  AI Copilot triggers restock draft when shelf inventory drops below {safetyBufferDays} days of velocity.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  POS Register Stream Sync Rate
                </label>
                <select
                  value={posSyncInterval}
                  onChange={e => setPosSyncInterval(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
                >
                  <option value="10s (High-Frequency Stream)">10s (High-Frequency Stream)</option>
                  <option value="30s (Real-time Stream)">30s (Real-time Stream)</option>
                  <option value="60s (Standard Shift)">60s (Standard Shift)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Hardware Telemetry & ESL */}
        <div className="lg:col-span-6 space-y-6">
          {/* Cold-Chain Thresholds */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <Thermometer className="w-4 h-4 text-[#064E3B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Cold-Chain Telemetry Alarm Limits</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Chilled Dairy Min Temp (°F)</label>
                <input
                  type="number"
                  value={coldChainMin}
                  onChange={e => setColdChainMin(Number(e.target.value))}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Chilled Dairy Max Temp (°F)</label>
                <input
                  type="number"
                  value={coldChainMax}
                  onChange={e => setColdChainMax(Number(e.target.value))}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#065F46] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Current Average Floor Reading: <strong>{telemetry.coldChainTempAvg}</strong> (Normal Operating Range)</span>
            </div>
          </div>

          {/* Electronic Shelf Label (ESL) Gateways */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <Radio className="w-4 h-4 text-[#064E3B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Electronic Shelf Label (ESL) Wireless Gateway</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Broadcast Radio Protocol</label>
                <select
                  value={eslChannel}
                  onChange={e => setEslChannel(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
                >
                  <option value="2.4GHz Channel 11 (Auto-hopping)">2.4GHz Channel 11 (Auto-hopping)</option>
                  <option value="2.4GHz Channel 15 (Low-Noise Band)">2.4GHz Channel 15 (Low-Noise Band)</option>
                  <option value="Sub-1GHz ISM 915MHz">Sub-1GHz ISM 915MHz (Long Range)</option>
                </select>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Connected ESL Tags:</span>
                  <span className="font-mono text-[#064E3B]">14,820 / 14,820 (100% Synced)</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Average Tag Battery:</span>
                  <span className="font-mono text-[#059669]">98.2% (Estimated 5.4 yrs life)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#064E3B] hover:bg-[#022C22] text-white font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>Save & Apply Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

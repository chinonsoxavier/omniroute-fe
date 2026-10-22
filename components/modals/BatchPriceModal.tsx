'use client';

import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Percent,
  Layers,
  CheckCircle2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { Department } from '@/lib/types';

interface BatchPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BatchPriceModal({ isOpen, onClose }: BatchPriceModalProps) {
  const { batchUpdatePrices, products } = useInventory();

  const [percentage, setPercentage] = useState<number>(5);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const targetCount = selectedDepartment === 'All Departments'
    ? products.length
    : products.filter(p => p.department === selectedDepartment).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    batchUpdatePrices(percentage, selectedDepartment);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  const departments = [
    'All Departments',
    'Produce',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery & Artisan',
    'Pantry & Dry Goods',
    'Beverages',
    'Frozen',
    'Snacks & Confectionery'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#34D399]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Batch Price & Margin Shift</h2>
              <p className="text-[11px] text-[#64748B]">Mass price update & automatic ESL tag sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto ring-8 ring-[#A7F3D0]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">Batch Prices Updated!</h3>
            <p className="text-xs text-[#64748B]">
              Updated {targetCount} products and synced 2.4GHz Electronic Shelf Tags.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Target Department / Category
              </label>
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Price Adjustment Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={percentage}
                  onChange={e => setPercentage(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md pl-3 pr-8 py-2 text-sm font-mono font-bold text-[#0F172A]"
                />
                <span className="absolute right-3 top-2 text-xs text-[#64748B] font-bold">%</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Use positive values (e.g. +5%) to increase prices, or negative (e.g. -15%) for category markdowns.
              </p>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs space-y-1">
              <div className="flex justify-between font-semibold text-[#0F172A]">
                <span>Impacted Products:</span>
                <span className="font-mono text-[#064E3B]">{targetCount} SKUs</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Shelf Label Sync:</span>
                <span className="text-[#059669] font-medium">Automatic 2.4GHz Push</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-[#CBD5E1] text-[#334155] rounded-md text-xs font-semibold hover:bg-[#F1F5F9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#064E3B] text-white rounded-md text-xs font-bold hover:bg-[#022C22] transition-colors"
              >
                Execute Batch Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

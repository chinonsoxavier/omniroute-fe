'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Radio,
  CheckCircle2,
  RefreshCw,
  Calculator,
  ShieldCheck,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { Product, StockReason } from '@/lib/types';
import { useInventory } from '@/lib/inventory-context';
import { ProductThumb } from '@/components/shared/media';

interface StockOverrideDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockOverrideDrawer({
  product,
  isOpen,
  onClose
}: StockOverrideDrawerProps) {
  const { adjustStock, overridePrice } = useInventory();

  const [stockCount, setStockCount] = useState<number>(0);
  const [retailPrice, setRetailPrice] = useState<number>(0);
  const [wholesaleCost, setWholesaleCost] = useState<number>(0);
  const [reason, setReason] = useState<StockReason>('Inbound shipment arrival (PO Intake)');
  const [auditNotes, setAuditNotes] = useState<string>('');
  const [pushToESL, setPushToESL] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setStockCount(product.currentStock);
      setRetailPrice(product.retailPrice);
      setWholesaleCost(product.wholesaleCost);
      setAuditNotes('');
      setIsSaved(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const calculatedMargin = retailPrice > 0 
    ? Number((((retailPrice - wholesaleCost) / retailPrice) * 100).toFixed(1))
    : 0;

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if stock changed
    if (stockCount !== product.currentStock) {
      adjustStock(product.id, stockCount, reason, auditNotes, pushToESL);
    }

    // Check if price changed
    if (retailPrice !== product.retailPrice || wholesaleCost !== product.wholesaleCost) {
      overridePrice(product.id, retailPrice, wholesaleCost, auditNotes, pushToESL);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#064E3B] text-white flex items-center justify-center">
                <PackageCheck className="w-4 h-4 text-[#34D399]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">Stock & Price Override</h2>
                <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">OMNISTOCK BACKROOM CONSOLE</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Product Banner */}
          <div className="p-4 mx-4 mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <div className="flex items-center gap-3">
              <ProductThumb
                src={product.imageUrl}
                alt={product.name}
                department={product.department}
                size={40}
              />
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm text-[#0F172A] truncate">{product.name}</h3>
                <div className="text-xs text-[#64748B] flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[#064E3B]">SKU {product.sku}</span>
                  <span>•</span>
                  <span className="text-[11px] text-[#059669] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {product.eslChannel || 'Shelf Sync Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCommit} className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Physical Stock On Hand Stepper */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Physical Stock On Hand ({product.unit})
              </label>
              <div className="flex items-center gap-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setStockCount(prev => Math.max(0, prev - 1))}
                  className="w-10 h-10 rounded bg-white text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center font-bold shadow-xs transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={stockCount}
                  onChange={e => setStockCount(Number(e.target.value))}
                  className="flex-1 bg-transparent text-center font-bold text-xl text-[#0F172A] font-mono focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setStockCount(prev => prev + 1)}
                  className="w-10 h-10 rounded bg-white text-[#0F172A] hover:bg-[#E2E8F0] flex items-center justify-center font-bold shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">Adjust count directly or scan handheld barcode scanner</p>
            </div>

            {/* Reason for Count Change */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Reason for Count Change <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as StockReason)}
                className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
              >
                <option value="Inbound shipment arrival (PO Intake)">Inbound shipment arrival (PO Intake)</option>
                <option value="Cycle count audit adjustment">Cycle count audit adjustment</option>
                <option value="Breakage / Spoilage write-off">Breakage / Spoilage write-off</option>
                <option value="POS adjustment">POS adjustment</option>
                <option value="Backroom floor pull">Backroom floor pull</option>
                <option value="Return to vendor (RTV)">Return to vendor (RTV)</option>
              </select>
            </div>

            {/* Price & Margin Simulator */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#064E3B]" />
                  PRICE & MARGIN SIMULATOR
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  {calculatedMargin}% Margin
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">RETAIL SALE ($)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-[#64748B]">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={retailPrice}
                      onChange={e => setRetailPrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#CBD5E1] rounded-md pl-6 pr-2 py-1.5 text-xs font-mono font-bold text-[#0F172A] focus:ring-1 focus:ring-[#10B981] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#64748B] mb-1">WHOLESALE COST ($)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-[#64748B]">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={wholesaleCost}
                      onChange={e => setWholesaleCost(Number(e.target.value))}
                      className="w-full bg-white border border-[#CBD5E1] rounded-md pl-6 pr-2 py-1.5 text-xs font-mono font-bold text-[#0F172A] focus:ring-1 focus:ring-[#10B981] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Log Notes */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Audit Log Notes</label>
              <textarea
                rows={3}
                value={auditNotes}
                onChange={e => setAuditNotes(e.target.value)}
                placeholder="Add optional inspection remarks or supplier discrepancy notes..."
                className="w-full bg-white border border-[#CBD5E1] rounded-md p-2.5 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
              />
            </div>

            {/* Electronic Shelf Label Push */}
            <div className="flex items-start gap-3 p-3 bg-[#F0FDF4] border border-[#A7F3D0] rounded-lg">
              <input
                type="checkbox"
                id="pushESL"
                checked={pushToESL}
                onChange={e => setPushToESL(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#064E3B] focus:ring-[#10B981] border-[#CBD5E1]"
              />
              <label htmlFor="pushESL" className="text-xs cursor-pointer">
                <span className="font-bold text-[#064E3B] block">Push to Electronic Shelf Labels (ESL)</span>
                <span className="text-[11px] text-[#059669]">Updates 2.4GHz E-ink tag on {product.aisle} within 4 seconds</span>
              </label>
            </div>
          </form>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9] text-xs font-semibold rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCommit}
              disabled={isSaved}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md text-white transition-all ${
                isSaved ? 'bg-[#10B981]' : 'bg-[#064E3B] hover:bg-[#022C22]'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Committed & Synced!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Commit & Sync Shelf</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

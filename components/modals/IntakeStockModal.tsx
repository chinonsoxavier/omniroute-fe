'use client';

import React, { useState } from 'react';
import {
  X,
  PackagePlus,
  Truck,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { ProductThumb, SupplierThumb } from '@/components/shared/media';

interface IntakeStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntakeStockModal({ isOpen, onClose }: IntakeStockModalProps) {
  const { purchaseOrders, suppliers, products, receivePurchaseOrder } = useInventory();

  const pendingPOs = purchaseOrders.filter(p => p.status === 'In Transit' || p.status === 'Submitted' || p.status === 'Draft');
  
  const [selectedPOId, setSelectedPOId] = useState<string>(pendingPOs[0]?.id || '');
  const [dockNumber, setDockNumber] = useState<string>('Dock Bay 2 (Produce & General)');
  const [temperature, setTemperature] = useState<string>('36.4°F (Cold-Chain Verified)');
  const [notes, setNotes] = useState<string>('Inbound pallets checked for packaging integrity, lot codes logged.');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedPO = purchaseOrders.find(p => p.id === selectedPOId);

  const handleReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOId) return;

    receivePurchaseOrder(selectedPOId, dockNumber, temperature, notes);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center">
              <PackagePlus className="w-4 h-4 text-[#34D399]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Inbound Stock & PO Intake</h2>
              <p className="text-[11px] text-[#64748B]">Dock Receiving & Cold-Chain Telemetry Verification</p>
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
            <h3 className="text-lg font-bold text-[#0F172A]">Shipment Received & Checked In!</h3>
            <p className="text-xs text-[#64748B]">
              Inventory counts have been updated and stock added to active shelves.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReceive} className="p-5 space-y-4">
            {/* PO Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Select Inbound Purchase Order <span className="text-rose-500">*</span>
              </label>
              {pendingPOs.length > 0 ? (
                <select
                  value={selectedPOId}
                  onChange={e => setSelectedPOId(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
                >
                  {pendingPOs.map(po => (
                    <option key={po.id} value={po.id}>
                      {po.poNumber} — {po.supplierName} (${po.totalAmount.toFixed(2)} • {po.items.length} items)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-md text-xs text-[#92400E]">
                  No pending POs found. All purchase orders are currently up to date!
                </div>
              )}
            </div>

            {selectedPO && (
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-xs space-y-1.5 font-mono">
                <div className="flex items-center gap-2.5 pb-2 mb-1 border-b border-[#E2E8F0]">
                  <SupplierThumb
                    src={suppliers.find(s => s.id === selectedPO.supplierId)?.imageUrl}
                    alt={selectedPO.supplierName}
                    size={28}
                    className="w-7 h-7 rounded"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-[#0F172A] truncate">{selectedPO.supplierName}</div>
                    <div className="text-[10px] text-[#64748B]">
                      {selectedPO.poNumber} • ETA {selectedPO.expectedDelivery}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-[#0F172A] flex justify-between">
                  <span>Manifest Items:</span>
                  <span>{selectedPO.items.length} Line Items</span>
                </div>
                {selectedPO.items.map((it, idx) => {
                  const itemProduct = products.find(p => p.id === it.productId);
                  return (
                    <div key={idx} className="flex justify-between items-center gap-2 text-[#64748B]">
                      <span className="flex items-center gap-2 min-w-0">
                        <ProductThumb
                          src={itemProduct?.imageUrl}
                          alt={it.name}
                          size={18}
                          className="w-[18px] h-[18px] rounded"
                        />
                        <span className="truncate">{it.name}</span>
                      </span>
                      <span className="shrink-0">+{it.orderedQty} {it.unit}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dock Bay Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Receiving Dock / Bay
              </label>
              <select
                value={dockNumber}
                onChange={e => setDockNumber(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
              >
                <option value="Dock Bay 1 (Refrigerated / Cold-chain)">Dock Bay 1 (Refrigerated / Cold-chain)</option>
                <option value="Dock Bay 2 (Produce & General)">Dock Bay 2 (Produce & General)</option>
                <option value="Dock Bay 3 (Dry Pantry & Bakery DSD)">Dock Bay 3 (Dry Pantry & Bakery DSD)</option>
              </select>
            </div>

            {/* Cold Chain Inspection */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#064E3B]" />
                Cold-Chain Temperature Telemetry Log
              </label>
              <input
                type="text"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
                placeholder="e.g. 36.4°F (Checked with handheld infrared)"
              />
            </div>

            {/* Receiving Notes */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">Receiving Remarks</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-md p-2 text-xs text-[#0F172A]"
                placeholder="Inspection notes or damage comments..."
              />
            </div>

            {/* Footer */}
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
                disabled={!selectedPOId}
                className="px-4 py-2 bg-[#064E3B] text-white rounded-md text-xs font-bold hover:bg-[#022C22] disabled:opacity-50 transition-colors"
              >
                Verify & Intake Stock
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

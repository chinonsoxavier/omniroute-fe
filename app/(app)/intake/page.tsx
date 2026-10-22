'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  PackageCheck,
  Thermometer,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  Boxes,
  Plus,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import IntakeStockModal from '@/components/modals/IntakeStockModal';

export default function IntakePage() {
  const { purchaseOrders, receivePurchaseOrder } = useInventory();
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [selectedPOForIntake, setSelectedPOForIntake] = useState<string | null>(null);

  const pendingPOs = purchaseOrders.filter(p => p.status !== 'Received');
  const receivedPOs = purchaseOrders.filter(p => p.status === 'Received');

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
            <Truck className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
              Inbound Stock Intake & Loading Bay Receiving
            </h1>
            <p className="text-xs text-[#64748B]">
              Dock Bay Manifests • Cold-Chain Telemetry Inspection & Inventory Restocking
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsIntakeModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#34D399]" />
          <span>Intake New Shipment</span>
        </button>
      </div>

      {/* Dock Status & Cold-Chain Telemetry Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">DOCK BAY 1 (COLD-CHAIN)</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <div className="mt-2 text-xs text-[#0F172A]">
            <div className="font-bold text-sm">34°F - 38°F Active Cooler</div>
            <div className="text-[11px] text-[#059669] mt-0.5">Verified Ready for Dairy & Seafood</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">DOCK BAY 2 (PRODUCE / GENERAL)</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <div className="mt-2 text-xs text-[#0F172A]">
            <div className="font-bold text-sm">Ambient Checked 58°F</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">2 Inbound Trucks Scheduled Today</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">PENDING INTAKE VALUE</span>
            <Boxes className="w-4 h-4 text-[#064E3B]" />
          </div>
          <div className="mt-2 text-xs text-[#0F172A]">
            <div className="font-bold text-sm font-mono text-[#064E3B]">
              ${pendingPOs.reduce((acc, p) => acc + p.totalAmount, 0).toFixed(2)}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">{pendingPOs.length} Purchase Orders in Pipeline</div>
          </div>
        </div>
      </div>

      {/* Pending Inbound POs Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Inbound Purchase Orders Pending Dock Check-In</h2>
            <p className="text-xs text-[#64748B]">Carrier shipments scheduled for unloading and barcode verification</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] text-[#92400E]">
            {pendingPOs.length} Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F1F5F9] text-[#334155] uppercase text-[10px] font-bold border-b border-[#CBD5E1]">
                <th className="py-2.5 px-4">PO Number</th>
                <th className="py-2.5 px-4">Supplier</th>
                <th className="py-2.5 px-4">Expected Delivery</th>
                <th className="py-2.5 px-4">Items Manifest</th>
                <th className="py-2.5 px-4 text-right">Total Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {pendingPOs.map(po => (
                <tr key={po.id} className="inventory-row">
                  <td className="py-3 px-4 font-mono font-bold text-[#064E3B]">
                    {po.poNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#0F172A]">{po.supplierName}</div>
                    <div className="text-[10px] text-[#64748B]">{po.notes}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    {po.expectedDelivery}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{po.items.length} SKUs</span>
                    <div className="text-[10px] text-[#64748B] truncate max-w-xs">
                      {po.items.map(i => `${i.name} (${i.orderedQty} ${i.unit})`).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#0F172A]">
                    ${po.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        po.status === 'In Transit'
                          ? 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]'
                          : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setIsIntakeModalOpen(true)}
                      className="px-3 py-1 bg-[#064E3B] text-white hover:bg-[#022C22] rounded text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Receive & Check-In
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Received Inbound Shipments Log */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Dock Receiving & Cold-Chain Telemetry Log</h2>
            <p className="text-xs text-[#64748B]">Historical log of verified inbound supplier shipments</p>
          </div>
          <span className="text-xs text-[#059669] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            {receivedPOs.length} Verified Deliveries
          </span>
        </div>

        <div className="space-y-3">
          {receivedPOs.map(po => (
            <div
              key={po.id}
              className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#064E3B] text-sm">{po.poNumber}</span>
                  <span className="text-[#64748B]">•</span>
                  <span className="font-bold text-[#0F172A]">{po.supplierName}</span>
                </div>
                <span className="text-[11px] text-[#64748B] font-mono">{po.receivedDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#475569] pt-1 border-t border-[#F1F5F9]">
                <div>
                  <span className="text-[#64748B]">Dock Location: </span>
                  <strong>{po.dockNumber || 'Bay 2'}</strong>
                </div>
                <div>
                  <span className="text-[#64748B]">Cold-Chain Log: </span>
                  <strong className="text-[#059669]">{po.temperatureReading || 'In-Spec'}</strong>
                </div>
                <div>
                  <span className="text-[#64748B]">Verified By: </span>
                  <strong>{po.verifiedBy || 'Sarah Jenkins'}</strong>
                </div>
              </div>

              <div className="text-[11px] text-[#64748B] italic">
                {po.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      <IntakeStockModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
      />
    </div>
  );
}

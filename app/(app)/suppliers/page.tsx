'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Plus,
  Truck,
  Sparkles,
  FileText,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Package
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { SupplierThumb } from '@/components/shared/media';
import { Supplier, PurchaseOrder } from '@/lib/types';

export default function SuppliersPage() {
  const {
    suppliers,
    purchaseOrders,
    products,
    createPurchaseOrder,
    autoDraftLowStockPOs
  } = useInventory();

  const supplierById = useMemo(
    () => new Map(suppliers.map(supplier => [supplier.id, supplier])),
    [suppliers]
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleAutoDraft = () => {
    const count = autoDraftLowStockPOs();
    setNotice(`Auto-drafted ${count} Purchase Orders for all products below reorder thresholds!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || orderItems.length === 0) return;

    const suppProducts = products.filter(p => p.supplierId === selectedSupplierId);
    const items = orderItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        orderedQty: item.quantity,
        unitCost: prod?.wholesaleCost || 0
      };
    });

    createPurchaseOrder(selectedSupplierId, items, orderNotes);
    setIsCreateModalOpen(false);
    setOrderItems([]);
    setOrderNotes('');
    setNotice('New Purchase Order submitted successfully to vendor EDI link!');
    setTimeout(() => setNotice(null), 4000);
  };

  const supplierProducts = products.filter(p => p.supplierId === selectedSupplierId);

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
              Suppliers & Purchase Order Management
            </h1>
            <p className="text-xs text-[#64748B]">
              Vendor Directory • EDI Integration • Lead Time Reliability & Automated Replenishment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAutoDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>AI Auto-Draft POs</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#34D399]" />
            <span>New Purchase Order</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-[#ECFDF5] border border-[#10B981] rounded-lg text-xs text-[#065F46] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold">{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-[#064E3B] font-bold">✕</button>
        </div>
      )}

      {/* Supplier Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {suppliers.map(supp => (
          <div
            key={supp.id}
            className="bg-white border border-[#E2E8F0] hover:border-[#10B981] rounded-xl p-4 shadow-xs transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#064E3B] flex items-center justify-center font-bold text-xs overflow-hidden">
                  {supp.imageUrl ? (
                    <SupplierThumb
                      src={supp.imageUrl}
                      alt={supp.name}
                      size={32}
                      className="w-full h-full rounded-lg border-0"
                    />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  {supp.reliabilityRating}% On-Time
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#0F172A] mt-2">{supp.name}</h3>
              <p className="text-[11px] text-[#64748B]">{supp.contactPerson} • {supp.paymentTerms}</p>

              <div className="space-y-1 text-xs text-[#475569] mt-3 pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 text-[11px] truncate">
                  <Mail className="w-3 h-3 text-[#94A3B8] shrink-0" />
                  <span className="truncate">{supp.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3 h-3 text-[#94A3B8] shrink-0" />
                  <span>{supp.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3 h-3 text-[#94A3B8] shrink-0" />
                  <span>Lead Time: <strong>{supp.leadTimeHours} hours</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#64748B]">
                Categories: {supp.category.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Purchase Orders Pipeline */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Supermarket Purchase Orders Pipeline</h2>
            <p className="text-xs text-[#64748B]">All active purchase orders, order drafts, and inbound tracking</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#064E3B]">
            {purchaseOrders.length} Total Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F1F5F9] text-[#334155] uppercase text-[10px] font-bold border-b border-[#CBD5E1]">
                <th className="py-2.5 px-4">PO Number</th>
                <th className="py-2.5 px-4">Supplier</th>
                <th className="py-2.5 px-4">Order Date</th>
                <th className="py-2.5 px-4">Expected Delivery</th>
                <th className="py-2.5 px-4">Line Items</th>
                <th className="py-2.5 px-4 text-right">Total ($)</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {purchaseOrders.map(po => (
                <tr key={po.id} className="inventory-row">
                  <td className="py-3 px-4 font-mono font-bold text-[#064E3B]">
                    {po.poNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <SupplierThumb
                        src={supplierById.get(po.supplierId)?.imageUrl}
                        alt={po.supplierName}
                        size={24}
                        className="rounded"
                      />
                      <div>
                        <div className="font-semibold text-[#0F172A]">{po.supplierName}</div>
                        <div className="text-[10px] text-[#64748B]">{po.notes}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#64748B] font-mono">
                    {po.orderDate}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    {po.expectedDelivery}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{po.items.length} SKUs</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#0F172A]">
                    ${po.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        po.status === 'Received'
                          ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                          : po.status === 'In Transit'
                          ? 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]'
                          : 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {po.status !== 'Received' ? (
                      <Link
                        href="/intake"
                        className="px-2.5 py-1 bg-[#064E3B] text-white hover:bg-[#022C22] rounded text-[11px] font-semibold transition-colors"
                      >
                        Receive
                      </Link>
                    ) : (
                      <span className="text-[11px] text-[#059669] font-medium">Checked In</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create PO Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#0F172A]">Create New Purchase Order</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#64748B]">✕</button>
            </div>

            <form onSubmit={handleCreatePO} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Select Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => {
                    setSelectedSupplierId(e.target.value);
                    setOrderItems([]);
                  }}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Items picker */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Select Products to Reorder</label>
                <div className="max-h-48 overflow-y-auto space-y-2 border border-[#E2E8F0] p-2 rounded-md">
                  {supplierProducts.map(prod => {
                    const selected = orderItems.find(i => i.productId === prod.id);
                    return (
                      <div key={prod.id} className="p-2 bg-[#F8FAFC] rounded flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold">{prod.name}</div>
                          <div className="text-[10px] text-[#64748B]">
                            Cost: ${prod.wholesaleCost.toFixed(2)} • On Hand: {prod.currentStock} {prod.unit}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            value={selected?.quantity || ''}
                            onChange={e => {
                              const val = Number(e.target.value);
                              if (val <= 0) {
                                setOrderItems(prev => prev.filter(i => i.productId !== prod.id));
                              } else {
                                setOrderItems(prev => {
                                  const exists = prev.find(i => i.productId === prod.id);
                                  if (exists) {
                                    return prev.map(i => i.productId === prod.id ? { ...i, quantity: val } : i);
                                  }
                                  return [...prev, { productId: prod.id, quantity: val }];
                                });
                              }
                            }}
                            className="w-16 bg-white border border-[#CBD5E1] rounded px-2 py-1 text-xs font-mono"
                          />
                          <span className="text-[10px] text-[#64748B] w-8">{prod.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">PO Notes / Special Instructions</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="e.g. Standard replenishment for weekend surge..."
                  className="w-full bg-white border border-[#CBD5E1] rounded-md p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#CBD5E1] text-[#334155] rounded-md text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orderItems.length === 0}
                  className="px-4 py-2 bg-[#064E3B] text-white rounded-md text-xs font-bold hover:bg-[#022C22] disabled:opacity-50"
                >
                  Submit Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

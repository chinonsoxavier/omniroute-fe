'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Receipt,
  Search,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  Smartphone,
  Gift,
  CheckCircle2,
  RotateCcw,
  UserCheck,
  Tag,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { ProductThumb } from '@/components/shared/media';
import { Product, SaleTransaction } from '@/lib/types';

export default function SalesPage() {
  const { products, sales, recordSale, refundSale, exportSalesCSV } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [cart, setCart] = useState<{ product: Product; quantity: number; discount: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit / Debit Card' | 'Apple Pay / Contactless' | 'Supermarket Gift Card'>('Apple Pay / Contactless');
  const [customerType, setCustomerType] = useState<'Regular' | 'Loyalty Member' | 'VIP SuperClub'>('Regular');
  const [activeReceipt, setActiveReceipt] = useState<SaleTransaction | null>(null);
  const [completedTx, setCompletedTx] = useState<SaleTransaction | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    const matchesDept = selectedDept === 'All' || p.department.includes(selectedDept);
    return matchesSearch && matchesDept;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const updateDiscount = (productId: string, disc: number) => {
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, discount: Math.min(100, Math.max(0, disc)) } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => {
    const effPrice = item.product.retailPrice * (1 - item.discount / 100);
    return acc + effPrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const items = cart.map(i => ({
      productId: i.product.id,
      quantity: i.quantity,
      discount: i.discount
    }));
    const tx = recordSale(items, paymentMethod, customerType);
    setCompletedTx(tx);
    setCart([]);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
            <ShoppingCart className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
              Point of Sale & Register Terminal
            </h1>
            <p className="text-xs text-[#64748B]">
              Active Register REG-04 • Real-time inventory sync and cashier checkout
            </p>
          </div>
        </div>

        <button
          onClick={exportSalesCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-md transition-colors shadow-2xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
          <span>Export Sales Ledger (CSV)</span>
        </button>
      </div>

      {/* POS Screen: Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selection Grid (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col h-[680px]">
          {/* Search and Dept Tabs */}
          <div className="space-y-3 pb-3 border-b border-[#E2E8F0]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Scan barcode or type SKU / Product name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {['All', 'Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Beverages'].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDept(d)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedDept === d ? 'bg-[#064E3B] text-white font-bold' : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
            {filteredProducts.map(prod => (
              <button
                key={prod.id}
                onClick={() => addToCart(prod)}
                className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#10B981] hover:bg-[#F0FDF4] rounded-lg text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <ProductThumb
                    src={prod.imageUrl}
                    alt={prod.name}
                    size={96}
                    className="w-full h-20 rounded-md mb-2"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#065F46] bg-[#ECFDF5] px-1.5 py-0.2 rounded">
                      {prod.department.slice(0, 6)}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      {prod.currentStock} {prod.unit}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[#0F172A] line-clamp-2 leading-tight">
                    {prod.name}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#E2E8F0] pt-2">
                  <span className="font-mono font-bold text-xs text-[#064E3B]">
                    ${prod.retailPrice.toFixed(2)}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-[#E2E8F0] group-hover:bg-[#064E3B] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                    +
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Cashier Basket (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex flex-col justify-between h-[680px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#064E3B]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Active Checkout Cart ({cart.length})</h2>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart List */}
            <div className="max-h-72 overflow-y-auto space-y-2 py-3 pr-1">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#94A3B8]">
                  Cart is empty.<br />Click products on the left or scan items to add.
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.product.id}
                    className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <ProductThumb
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        size={36}
                        className="w-9 h-9 rounded shrink-0"
                      />
                      <div className="overflow-hidden pr-2">
                        <div className="font-bold text-[#0F172A] truncate">{item.product.name}</div>
                        <div className="text-[10px] text-[#64748B] font-mono">
                          ${item.product.retailPrice.toFixed(2)} / {item.product.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#94A3B8] hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-1.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 bg-white border border-[#CBD5E1] rounded flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 bg-white border border-[#CBD5E1] rounded flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-mono font-bold text-sm text-[#064E3B]">
                        ${(item.product.retailPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Payment & Checkout */}
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'Apple Pay / Contactless', label: 'NFC / Apple Pay', icon: Smartphone },
                { id: 'Credit / Debit Card', label: 'Card Chip / Tap', icon: CreditCard },
                { id: 'Cash', label: 'Cash Tender', icon: DollarSign },
                { id: 'Supermarket Gift Card', label: 'Gift Card', icon: Gift }
              ].map(p => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-1.5 rounded-md border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === p.id
                        ? 'bg-[#064E3B] text-white border-[#064E3B]'
                        : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Calculations Box */}
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal:</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Sales Tax (8%):</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#0F172A] border-t border-[#E2E8F0] pt-1">
                <span>Total Amount:</span>
                <span className="font-mono text-[#064E3B]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-2.5 bg-[#064E3B] hover:bg-[#022C22] disabled:opacity-50 text-white font-bold text-xs rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              Complete Sale (${total.toFixed(2)})
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Recent Register Transactions Ledger</h2>
            <p className="text-xs text-[#64748B]">Audit trail of completed sales, items sold, and cashier reconciliations</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#064E3B]">
            {sales.length} Transactions Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F1F5F9] text-[#334155] uppercase text-[10px] font-bold border-b border-[#CBD5E1]">
                <th className="py-2.5 px-4">Receipt #</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Register / Cashier</th>
                <th className="py-2.5 px-4">Items</th>
                <th className="py-2.5 px-4">Payment Method</th>
                <th className="py-2.5 px-4 text-right">Total ($)</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sales.map(tx => (
                <tr key={tx.id} className="inventory-row">
                  <td className="py-3 px-4 font-mono font-bold text-[#064E3B]">
                    {tx.receiptNumber}
                  </td>
                  <td className="py-3 px-4 text-[#64748B] font-mono">
                    {tx.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#0F172A]">{tx.registerId}</div>
                    <div className="text-[10px] text-[#64748B]">{tx.cashierName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0F172A]">{tx.items.length} items</span>
                    <div className="text-[10px] text-[#64748B] truncate max-w-xs">
                      {tx.items.map(i => i.name).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">
                    {tx.paymentMethod}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#0F172A]">
                    ${tx.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'Completed'
                          ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                          : 'bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {tx.status === 'Completed' && (
                      <button
                        onClick={() => refundSale(tx.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Refund / Restock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

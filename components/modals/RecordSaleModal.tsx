'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  Smartphone,
  Gift,
  CheckCircle2,
  Receipt,
  Search,
  Sparkles
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { ProductThumb } from '@/components/shared/media';
import { Product, SaleTransaction } from '@/lib/types';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordSaleModal({ isOpen, onClose }: RecordSaleModalProps) {
  const { products, recordSale } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number; discount: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit / Debit Card' | 'Apple Pay / Contactless' | 'Supermarket Gift Card'>('Apple Pay / Contactless');
  const [customerType, setCustomerType] = useState<'Regular' | 'Loyalty Member' | 'VIP SuperClub'>('Regular');
  const [completedTx, setCompletedTx] = useState<SaleTransaction | null>(null);

  if (!isOpen) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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

  const totalCost = cart.reduce((acc, item) => acc + item.product.wholesaleCost * item.quantity, 0);
  const estimatedMargin = subtotal > 0 ? ((subtotal - totalCost) / subtotal) * 100 : 0;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const items = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      discount: item.discount
    }));

    const tx = recordSale(items, paymentMethod, customerType);
    setCompletedTx(tx);
  };

  const handleReset = () => {
    setCart([]);
    setCompletedTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#34D399]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Supermarket POS Cashier Terminal</h2>
              <p className="text-[11px] text-[#64748B]">Terminal 04 • Fast Barcode Scan & Instant Stock Sync</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-md hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Completed Sale View */}
        {completedTx ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#065F46] flex items-center justify-center ring-8 ring-[#A7F3D0]/30">
              <CheckCircle2 className="w-9 h-9 text-[#10B981]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">Transaction Completed Successfully!</h3>
            <p className="text-xs text-[#64748B] max-w-sm">
              Receipt <span className="font-mono font-bold text-[#064E3B]">{completedTx.receiptNumber}</span> logged. Physical stock balances deducted and Electronic Shelf Labels updated.
            </p>

            <div className="w-full max-w-md bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between border-b pb-2 font-bold text-[#0F172A]">
                <span>Total Items Dispensed:</span>
                <span>{completedTx.items.reduce((a, b) => a + b.quantity, 0)} units</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal:</span>
                <span>${completedTx.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Sales Tax (8%):</span>
                <span>${completedTx.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#064E3B] border-t pt-2">
                <span>Total Amount Paid:</span>
                <span>${completedTx.total.toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-[#059669] pt-1">
                Payment: {completedTx.paymentMethod} • Cashier: {completedTx.cashierName}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCompletedTx(null)}
                className="px-5 py-2.5 bg-[#064E3B] text-white rounded-md text-xs font-semibold hover:bg-[#022C22] transition-colors"
              >
                Start New Transaction
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-white border border-[#CBD5E1] text-[#334155] rounded-md text-xs font-semibold hover:bg-[#F1F5F9]"
              >
                Close Terminal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left: Product Picker & Fast Lookup */}
            <div className="md:col-span-7 border-r border-[#E2E8F0] flex flex-col p-4 overflow-hidden">
              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Scan barcode or search SKU / Item name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
                  autoFocus
                />
              </div>

              {/* Product Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredProducts.slice(0, 12).map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => addToCart(prod)}
                    className="p-2.5 bg-white border border-[#E2E8F0] hover:border-[#10B981] hover:bg-[#F0FDF4] rounded-lg text-left transition-all flex flex-col justify-between group shadow-2xs cursor-pointer"
                  >
                    <div>
                      <ProductThumb
                        src={prod.imageUrl}
                        alt={prod.name}
                        size={80}
                        className="w-full h-16 rounded-md mb-1.5"
                      />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-[#065F46] bg-[#ECFDF5] px-1 rounded">
                          {prod.department.slice(0, 7)}
                        </span>
                        <span className="text-[10px] font-mono text-[#64748B]">
                          {prod.currentStock} {prod.unit}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-[#0F172A] line-clamp-2 leading-tight">
                        {prod.name}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-[#F1F5F9] pt-1.5">
                      <span className="font-bold text-xs text-[#064E3B] font-mono">
                        ${prod.retailPrice.toFixed(2)}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-[#E2E8F0] group-hover:bg-[#064E3B] group-hover:text-white flex items-center justify-center text-xs transition-colors">
                        +
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Checkout Basket & Payment */}
            <div className="md:col-span-5 bg-[#F8FAFC] flex flex-col p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-2">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-[#064E3B]" />
                  Active Basket ({cart.length} items)
                </span>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#94A3B8]">
                    Basket is empty.<br />Click products on the left to add to sale.
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.product.id}
                      className="p-2.5 bg-white border border-[#E2E8F0] rounded-md shadow-2xs text-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <ProductThumb
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          size={32}
                          className="w-8 h-8 rounded shrink-0"
                        />
                        <div className="overflow-hidden pr-2">
                          <div className="font-semibold text-[#0F172A] truncate">{item.product.name}</div>
                          <div className="text-[10px] text-[#64748B] font-mono">
                            ${item.product.retailPrice.toFixed(2)} / {item.product.unit}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#94A3B8] hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-1.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-5 h-5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => updateQuantity(item.product.id, Number(e.target.value))}
                            className="w-10 text-center font-bold text-xs bg-transparent border border-[#E2E8F0] rounded py-0.5"
                          />
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-5 h-5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-bold text-[#064E3B] font-mono">
                          ${(item.product.retailPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Loyalty & Payment Method */}
              <div className="pt-3 border-t border-[#E2E8F0] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#64748B]">Customer Loyalty:</span>
                  <select
                    value={customerType}
                    onChange={e => setCustomerType(e.target.value as any)}
                    className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-[11px] text-[#0F172A]"
                  >
                    <option value="Regular">Regular Shopper</option>
                    <option value="Loyalty Member">Loyalty Member (ClubCard)</option>
                    <option value="VIP SuperClub">VIP SuperClub (+5% bonus)</option>
                  </select>
                </div>

                {/* Payment Buttons */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'Apple Pay / Contactless', label: 'NFC / Apple Pay', icon: Smartphone },
                    { id: 'Credit / Debit Card', label: 'Card Chip / Tap', icon: CreditCard },
                    { id: 'Cash', label: 'Cash Tender', icon: DollarSign },
                    { id: 'Supermarket Gift Card', label: 'Store Card', icon: Gift }
                  ].map(p => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-1.5 text-[11px] font-semibold rounded border flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === p.id
                            ? 'bg-[#064E3B] text-white border-[#064E3B]'
                            : 'bg-white text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Subtotal & Total */}
                <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs space-y-1">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Subtotal:</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Sales Tax (8%):</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#0F172A] border-t border-[#F1F5F9] pt-1">
                    <span>Total Due:</span>
                    <span className="font-mono text-[#064E3B]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="w-full py-2.5 bg-[#064E3B] hover:bg-[#022C22] disabled:opacity-50 text-white rounded-md text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Confirm Payment (${total.toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

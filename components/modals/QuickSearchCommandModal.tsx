'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Boxes,
  LineChart,
  Bot,
  ShoppingCart,
  Truck,
  ScanBarcode,
  Settings,
  ArrowRight,
  Package,
  Layers
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { ProductThumb } from '@/components/shared/media';
import { Product } from '@/lib/types';

interface QuickSearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function QuickSearchCommandModal({
  isOpen,
  onClose,
  onSelectProduct
}: QuickSearchCommandModalProps) {
  const router = useRouter();
  const { products } = useInventory();
  const [query, setQuery] = useState('');

  // Handle global ⌘K or Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger toggle if parent provides it
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()) ||
      p.barcode.includes(query) ||
      p.department.toLowerCase().includes(query.toLowerCase()) ||
      p.aisle.toLowerCase().includes(query.toLowerCase())
  );

  const navigationShortcuts = [
    { name: 'Inventory & Stocks Catalog', href: '/inventory', icon: Boxes, desc: 'Manage 14,820 SKUs & price overrides' },
    { name: 'Supermarket Sales & Demand Intelligence', href: '/analytics', icon: LineChart, desc: 'Daily, weekly, monthly & yearly reports' },
    { name: 'AI Inventory Copilot & Floor Audits', href: '/ai-copilot', icon: Bot, desc: 'Interactive AI stock manager & restocking assistant' },
    { name: 'Point of Sale (POS) Cashier', href: '/sales', icon: ShoppingCart, desc: 'Live register & transaction recording' },
    { name: 'Inbound PO & Stock Intake', href: '/intake', icon: Truck, desc: 'Dock receiving and cold chain check' },
    { name: 'Handheld Barcode Scanner Terminal', href: '/scanner', icon: ScanBarcode, desc: 'Zebra RF terminal simulation & shelf scans' },
    { name: 'Store Settings & ESL Gateways', href: '/settings', icon: Settings, desc: 'Facility configuration and thresholds' }
  ].filter(nav => nav.name.toLowerCase().includes(query.toLowerCase()) || nav.desc.toLowerCase().includes(query.toLowerCase()));

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleProductClick = (prod: Product) => {
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      router.push(`/inventory?sku=${encodeURIComponent(prod.sku)}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#064E3B]" />
          <input
            type="text"
            placeholder="Search SKU, Barcode, Item, Aisle location, or quick jump..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-hidden"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#CBD5E1] rounded text-[#475569]">
            ESC
          </kbd>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#0F172A]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Products Matching */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider px-2 mb-1.5">
                INVENTORY CATALOG ({filteredProducts.length})
              </div>
              <div className="space-y-1">
                {filteredProducts.slice(0, 6).map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleProductClick(p)}
                    className="p-2 rounded-lg hover:bg-[#F0FDF4] border border-transparent hover:border-[#A7F3D0] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <ProductThumb
                        src={p.imageUrl}
                        alt={p.name}
                        size={32}
                        fallback={p.department.slice(0, 2).toUpperCase()}
                        className="w-8 h-8 rounded shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-xs text-[#0F172A] truncate">{p.name}</div>
                        <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                          <span className="font-mono text-[#064E3B] font-semibold">{p.sku}</span>
                          <span>•</span>
                          <span>{p.aisle} ({p.bay})</span>
                          <span>•</span>
                          <span className="font-mono">{p.currentStock} {p.unit} on hand</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-xs text-[#064E3B]">${p.retailPrice.toFixed(2)}</div>
                      <div className="text-[10px] text-[#059669] font-medium">{p.grossMargin}% margin</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Links */}
          {navigationShortcuts.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider px-2 mb-1.5">
                QUICK NAVIGATION & MODULES
              </div>
              <div className="space-y-1">
                {navigationShortcuts.map(nav => {
                  const Icon = nav.icon;
                  return (
                    <div
                      key={nav.href}
                      onClick={() => handleNavigate(nav.href)}
                      className="p-2 rounded-lg hover:bg-[#F1F5F9] border border-transparent hover:border-[#CBD5E1] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#F1F5F9] text-[#064E3B] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#0F172A]">{nav.name}</div>
                          <div className="text-[11px] text-[#64748B]">{nav.desc}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredProducts.length === 0 && navigationShortcuts.length === 0 && (
            <div className="py-8 text-center text-xs text-[#64748B]">
              No inventory products or navigation shortcuts matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

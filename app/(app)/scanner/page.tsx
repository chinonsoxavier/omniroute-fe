'use client';

import React, { useState } from 'react';
import {
  ScanBarcode,
  Radio,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Search,
  Volume2,
  VolumeX,
  RefreshCw,
  Edit2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { Product } from '@/lib/types';
import StockOverrideDrawer from '@/components/modals/StockOverrideDrawer';

export default function BarcodeScannerPage() {
  const { products, telemetry } = useInventory();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scanMode, setScanMode] = useState<'price_check' | 'cycle_count' | 'shelf_audit'>('price_check');
  const [scanHistory, setScanHistory] = useState<{ barcode: string; product: Product; timestamp: string }[]>([]);
  const [selectedProductForDrawer, setSelectedProductForDrawer] = useState<Product | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sampleBarcodes = [
    { code: '071844901234', name: 'Honeycrisp Apples (#PROD-7729)' },
    { code: '093966000142', name: 'Organic Valley Whole Milk (#DAIR-4102)' },
    { code: '023456789012', name: 'Grass-Fed Ribeye Steak (#MEAT-8819)' },
    { code: '072220001948', name: 'Wonder White Bread (#BAKE-1940)' },
    { code: '894700010045', name: 'Chobani Greek Yogurt (#DAIR-6601)' },
    { code: '190646630044', name: 'Oatly Barista Oat Milk (#BEV-9014)' }
  ];

  const handleScan = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    const match = products.find(p => p.barcode === cleanCode || p.sku.toLowerCase().includes(cleanCode.toLowerCase()));
    if (match) {
      setScannedProduct(match);
      setScanHistory(prev => [
        { barcode: cleanCode, product: match, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 7)
      ]);
    } else {
      setScannedProduct(null);
    }
    setBarcodeInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(barcodeInput);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
            <ScanBarcode className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
                Handheld Barcode Scanner Terminal
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
                8/8 Handhelds Online
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Zebra TC52 / Honeywell RF terminal emulator for shelf price audits, stock verification & ESL tag pairing
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg text-xs font-semibold">
          {[
            { id: 'price_check', label: 'Price & ESL Check' },
            { id: 'cycle_count', label: 'Cycle Count Audit' },
            { id: 'shelf_audit', label: 'Shelf Facing Audit' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setScanMode(m.id as any)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                scanMode === m.id ? 'bg-[#064E3B] text-white shadow-2xs' : 'text-[#475569] hover:bg-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Handheld Laser Scanner Screen (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <h2 className="text-sm font-bold text-[#0F172A]">RF Handheld Terminal #04 (Aisle 1-18)</h2>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-[#64748B] hover:text-[#0F172A] p-1"
                title="Toggle Beep"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#064E3B]" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Laser Viewfinder Animation */}
            <div className="my-4 relative h-48 bg-[#0F172A] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#1E293B]">
              <div className="scanner-laser" />
              <div className="border-2 border-dashed border-emerald-500/40 rounded-lg w-4/5 h-4/5 flex flex-col items-center justify-center text-center p-4">
                <ScanBarcode className="w-10 h-10 text-emerald-400/70 mb-2" />
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  AIM SCANNER AT BARCODE OR E-INK TAG
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Supports EAN-13, UPC-A, Code 128, DataMatrix & 2.4GHz ESL
                </span>
              </div>
            </div>

            {/* Manual Barcode Input */}
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Type barcode or paste EAN (e.g. 071844901234)..."
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                Scan
              </button>
            </form>
          </div>

          {/* Quick Barcode Simulator Buttons */}
          <div className="pt-3 border-t border-[#E2E8F0]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
              SIMULATE HARDWARE BARCODE TRIGGER:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {sampleBarcodes.map(b => (
                <button
                  key={b.code}
                  onClick={() => handleScan(b.code)}
                  className="p-2 text-left bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#10B981] hover:bg-[#F0FDF4] rounded-md text-[11px] font-mono text-[#0F172A] transition-all truncate cursor-pointer"
                >
                  <span className="font-bold text-[#064E3B] block truncate">{b.name}</span>
                  <span className="text-[#64748B] text-[10px]">{b.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Scanned Telemetry Output (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#064E3B]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Real-Time Shelf Telemetry & Match</h2>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                {scannedProduct ? 'Match Found' : 'Awaiting Scan'}
              </span>
            </div>

            {/* Scanned Product Card */}
            {scannedProduct ? (
              <div className="mt-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <ProductThumb
                      src={scannedProduct.imageUrl}
                      alt={scannedProduct.name}
                      size={64}
                      className="w-16 h-16 rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded">
                        {scannedProduct.department}
                      </span>
                      <h3 className="font-bold text-base text-[#0F172A] mt-1">{scannedProduct.name}</h3>
                      <div className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-[#064E3B]">{scannedProduct.sku}</span>
                        <span>•</span>
                        <span className="font-mono">{scannedProduct.barcode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold font-mono text-[#064E3B]">
                      ${scannedProduct.retailPrice.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-[#059669] font-medium font-mono">
                      {scannedProduct.grossMargin}% Gross Margin
                    </div>
                  </div>
                </div>

                {/* Location and Stock Details */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E2E8F0] text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">SHELF LOCATION</span>
                    <span className="font-bold text-[#0F172A]">{scannedProduct.aisle} • {scannedProduct.bay}</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">{scannedProduct.shelfPlacement}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] block">PHYSICAL ON-HAND</span>
                    <span className="font-bold text-[#0F172A] font-mono">{scannedProduct.currentStock} {scannedProduct.unit}</span>
                    <span className="text-[10px] text-[#059669] block mt-0.5">ESL: {scannedProduct.eslChannel}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedProductForDrawer(scannedProduct)}
                    className="flex-1 py-2 bg-[#064E3B] hover:bg-[#022C22] text-white rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Quick Override Price / Count</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="my-8 text-center p-8 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl text-xs text-[#64748B] space-y-1">
                <ScanBarcode className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <div className="font-bold text-[#0F172A]">No Active Scan</div>
                <div>Trigger a barcode above to view live inventory health & pricing</div>
              </div>
            )}
          </div>

          {/* Scan History Feed */}
          <div className="pt-3 border-t border-[#E2E8F0]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
              RECENT SCAN SESSION LOG:
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {scanHistory.map((h, idx) => (
                <div
                  key={idx}
                  onClick={() => setScannedProduct(h.product)}
                  className="p-2 bg-[#F8FAFC] hover:bg-[#F0FDF4] rounded border border-[#E2E8F0] text-xs flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="truncate">
                    <span className="font-bold text-[#0F172A]">{h.product.name}</span>
                    <span className="text-[10px] text-[#64748B] ml-2 font-mono">{h.barcode}</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-mono shrink-0">{h.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Override Drawer Trigger */}
      <StockOverrideDrawer
        product={selectedProductForDrawer}
        isOpen={!!selectedProductForDrawer}
        onClose={() => setSelectedProductForDrawer(null)}
      />
    </div>
  );
}

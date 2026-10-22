'use client';

import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Package,
  Store,
  DollarSign,
  Barcode,
  Layers,
  Calendar,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { Department } from '@/lib/types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { suppliers, addProduct } = useInventory();

  const [name, setName] = useState('');
  const [sku, setSku] = useState(`PROD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [barcode, setBarcode] = useState(`0${Math.floor(10000000000 + Math.random() * 90000000000)}`);
  const [brand, setBrand] = useState('');
  const [department, setDepartment] = useState<Department>('Produce');
  const [packageType, setPackageType] = useState('Bulk / Pack');
  const [aisle, setAisle] = useState('Aisle 1-A');
  const [bay, setBay] = useState('Bay 1');
  const [shelfPlacement, setShelfPlacement] = useState('Ambient Wet Rack');
  const [unit, setUnit] = useState('units');
  const [retailPrice, setRetailPrice] = useState<number>(3.99);
  const [wholesaleCost, setWholesaleCost] = useState<number>(2.20);
  const [currentStock, setCurrentStock] = useState<number>(50);
  const [reorderPoint, setReorderPoint] = useState<number>(15);
  const [criticalThreshold, setCriticalThreshold] = useState<number>(5);
  const [maxCapacity, setMaxCapacity] = useState<number>(100);
  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || 'supp-1');
  const [expiryDate, setExpiryDate] = useState('2026-10-30');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const margin = retailPrice > 0 ? (((retailPrice - wholesaleCost) / retailPrice) * 100).toFixed(1) : '0';
  const selectedSupplier = suppliers.find(s => s.id === supplierId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      sku: `#${sku.replace('#', '')}`,
      barcode,
      name,
      brand: brand || 'House Brand',
      packageType,
      department,
      aisle,
      bay,
      shelfPlacement,
      unit,
      retailPrice: Number(retailPrice),
      wholesaleCost: Number(wholesaleCost),
      currentStock: Number(currentStock),
      reorderPoint: Number(reorderPoint),
      criticalThreshold: Number(criticalThreshold),
      maxCapacity: Number(maxCapacity),
      supplierId,
      supplierName: selectedSupplier?.name || 'Local Supplier',
      expiryDate,
      daysUntilExpiry: 30
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      onClose();
    }, 700);
  };

  const departments: Department[] = [
    'Produce',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery & Artisan',
    'Pantry & Dry Goods',
    'Beverages',
    'Frozen',
    'Snacks & Confectionery',
    'Deli & Prepared Foods',
    'Health & Wellness',
    'Household & Cleaning',
    'Floral & Seasonal'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center">
              <PlusCircle className="w-4 h-4 text-[#34D399]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Add New Product to Supermarket Catalog</h2>
              <p className="text-[11px] text-[#64748B]">SKU generation, Electronic Shelf Tag pairing & initial stock intake</p>
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
            <h3 className="text-lg font-bold text-[#0F172A]">Product Added to Catalog!</h3>
            <p className="text-xs text-[#64748B]">
              ESL tag queued for broadcast and inventory logged.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Product Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Organic Honeycrisp Apples 3lb Bag"
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A] focus:ring-2 focus:ring-[#10B981] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="e.g. Valley Orchards"
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value as Department)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">SKU Number</label>
                <input
                  type="text"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Barcode (EAN-13 / UPC)</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={e => setBarcode(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs font-mono text-[#0F172A]"
                />
              </div>
            </div>

            {/* Shelf Location & Packaging */}
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">Aisle Location</label>
                <input
                  type="text"
                  value={aisle}
                  onChange={e => setAisle(e.target.value)}
                  placeholder="e.g. Aisle 1-A"
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">Bay / Section</label>
                <input
                  type="text"
                  value={bay}
                  onChange={e => setBay(e.target.value)}
                  placeholder="e.g. Bay 3"
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">Package / Unit</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-2 py-1.5 text-xs"
                >
                  <option value="units">Units / Ea</option>
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="ctn">Carton (ctn)</option>
                  <option value="pack">Pack</option>
                  <option value="bag">Bag</option>
                  <option value="bottle">Bottle</option>
                </select>
              </div>
            </div>

            {/* Pricing & Margin Calculator */}
            <div className="p-4 bg-[#F0FDF4] border border-[#A7F3D0] rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#064E3B] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" />
                  Pricing & Gross Margin Simulator
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#064E3B] text-white">
                  {margin}% Projected Margin
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#065F46] mb-1">Retail Sale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={retailPrice}
                    onChange={e => setRetailPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs font-mono font-bold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#065F46] mb-1">Wholesale Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={wholesaleCost}
                    onChange={e => setWholesaleCost(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs font-mono font-bold text-[#0F172A]"
                  />
                </div>
              </div>
            </div>

            {/* Stock Levels */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Initial Stock Count</label>
                <input
                  type="number"
                  min="0"
                  value={currentStock}
                  onChange={e => setCurrentStock(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Reorder Point (Low Buffer)</label>
                <input
                  type="number"
                  min="0"
                  value={reorderPoint}
                  onChange={e => setReorderPoint(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Max Shelf Capacity</label>
                <input
                  type="number"
                  min="0"
                  value={maxCapacity}
                  onChange={e => setMaxCapacity(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                />
              </div>
            </div>

            {/* Supplier & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Supplier Vendor</label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">Batch Expiration Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-2 text-xs text-[#0F172A]"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-[#CBD5E1] text-[#334155] rounded-md text-xs font-semibold hover:bg-[#F1F5F9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#064E3B] text-white rounded-md text-xs font-bold hover:bg-[#022C22] transition-colors shadow-xs"
              >
                Save & Broadcast to ESL Tag
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Boxes,
  Search,
  Plus,
  ScanBarcode,
  TrendingUp,
  FileSpreadsheet,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Layers,
  ChevronDown,
  Edit2,
  Trash2,
  ArrowUpDown,
  Radio,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Sparkles,
  Truck,
} from "lucide-react";
import { useInventory } from "@/lib/inventory-context";
import { ProductThumb } from "@/components/shared/media";
import { Product, Department, StockHealthStatus } from "@/lib/types";
import StockOverrideDrawer from "@/components/modals/StockOverrideDrawer";
import AddProductModal from "@/components/modals/AddProductModal";
import BatchPriceModal from "@/components/modals/BatchPriceModal";

export default function InventoryPage() {
  const {
    products,
    suppliers,
    exportInventoryCSV,
    activeFacility,
    deleteProduct,
    overridePrice,
  } = useInventory();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Stocks");
  const [selectedAisle, setSelectedAisle] = useState<string>("All Aisles");
  const [selectedSupplier, setSelectedSupplier] =
    useState<string>("All Vendors");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortField, setSortField] = useState<
    "health" | "name" | "stock" | "price" | "margin"
  >("health");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Selected Products for Bulk Action
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals & Drawers
  const [selectedProductForDrawer, setSelectedProductForDrawer] =
    useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isBatchPriceOpen, setIsBatchPriceOpen] = useState(false);

  // Filter computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Search text
        const matchesSearch =
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.barcode.includes(searchQuery) ||
          prod.brand.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Department
        if (
          selectedDept !== "All Departments" &&
          prod.department !== selectedDept
        ) {
          return false;
        }

        // Status
        if (selectedStatus !== "All Stocks") {
          if (
            selectedStatus === "In Stock" &&
            (prod.currentStock === 0 || prod.currentStock <= prod.reorderPoint)
          )
            return false;
          if (
            selectedStatus === "Low Buffer" &&
            (prod.currentStock === 0 || prod.currentStock > prod.reorderPoint)
          )
            return false;
          if (
            selectedStatus === "Critical Low" &&
            (prod.currentStock === 0 ||
              prod.currentStock > prod.criticalThreshold)
          )
            return false;
          if (selectedStatus === "Out of Stock" && prod.currentStock > 0)
            return false;
          if (
            selectedStatus === "Expiring" &&
            (!prod.daysUntilExpiry || prod.daysUntilExpiry > 3)
          )
            return false;
        }

        // Aisle
        if (
          selectedAisle !== "All Aisles" &&
          !prod.aisle.includes(selectedAisle)
        ) {
          return false;
        }

        // Supplier
        if (
          selectedSupplier !== "All Vendors" &&
          prod.supplierId !== selectedSupplier
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === "health") {
          const scoreA =
            a.currentStock === 0
              ? 0
              : a.currentStock <= a.criticalThreshold
                ? 1
                : a.currentStock <= a.reorderPoint
                  ? 2
                  : 3;
          const scoreB =
            b.currentStock === 0
              ? 0
              : b.currentStock <= b.criticalThreshold
                ? 1
                : b.currentStock <= b.reorderPoint
                  ? 2
                  : 3;
          return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA;
        }
        if (sortField === "name") {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortField === "stock") {
          return sortDirection === "asc"
            ? a.currentStock - b.currentStock
            : b.currentStock - a.currentStock;
        }
        if (sortField === "price") {
          return sortDirection === "asc"
            ? a.retailPrice - b.retailPrice
            : b.retailPrice - a.retailPrice;
        }
        if (sortField === "margin") {
          return sortDirection === "asc"
            ? a.grossMargin - b.grossMargin
            : b.grossMargin - a.grossMargin;
        }
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedDept,
    selectedStatus,
    selectedAisle,
    selectedSupplier,
    sortField,
    sortDirection,
  ]);

  // Telemetry KPIs
  const totalCatalogCount = products.length;
  const inStockActiveCount = products.filter(
    (p) => p.currentStock > p.reorderPoint,
  ).length;
  const lowBufferCount = products.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.reorderPoint,
  ).length;
  const outOfStockCount = products.filter((p) => p.currentStock === 0).length;
  const expiringCount = products.filter(
    (p) => p.daysUntilExpiry !== undefined && p.daysUntilExpiry <= 3,
  ).length;

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDept("All Departments");
    setSelectedStatus("All Stocks");
    setSelectedAisle("All Aisles");
    setSelectedSupplier("All Vendors");
  };

  const departments: Department[] = [
    "Produce",
    "Dairy & Eggs",
    "Meat & Seafood",
    "Bakery & Artisan",
    "Pantry & Dry Goods",
    "Beverages",
    "Frozen",
    "Snacks & Confectionery",
    "Deli & Prepared Foods",
    "Health & Wellness",
    "Household & Cleaning",
    "Floral & Seasonal",
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] font-heading">
              Inventory Catalog & Stock Operations
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage 14,820 active SKUs, track shelf aisles, update pricing, and
            log batch shipments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#34D399]" />
            <span>Add New Product</span>
          </button>

          <Link
            href="/scanner"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white hover:bg-[#022C22] text-xs font-semibold rounded-md transition-colors shadow-2xs"
          >
            <ScanBarcode className="w-4 h-4 text-[#34D399]" />
            <span>Scan Barcode / Inbound</span>
          </Link>

          <button
            onClick={() => setIsBatchPriceOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Batch Price Update</span>
          </button>

          <button
            onClick={exportInventoryCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 5 Telemetry Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Catalog */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              TOTAL CATALOG
            </span>
            <Boxes className="w-3.5 h-3.5 text-[#64748B]" />
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-mono text-[#0F172A]">
              14,820
            </div>
            <div className="text-[10px] text-[#059669] font-medium mt-0.5 font-mono">
              +18 this wk
            </div>
          </div>
        </div>

        {/* In Stock Active */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              IN STOCK ACTIVE
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-mono text-[#0F172A]">
              14,198
            </div>
            <div className="text-[10px] text-[#64748B] font-medium mt-0.5">
              95.8% fill rate
            </div>
          </div>
        </div>

        {/* Low Buffer */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
              LOW BUFFER
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-mono text-[#D97706]">
              584
            </div>
            <div className="text-[10px] text-[#92400E] font-medium mt-0.5">
              Restock Req.
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              OUT OF STOCK
            </span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-mono text-rose-600">38</div>
            <div className="text-[10px] text-rose-600 font-medium mt-0.5">
              0.25% lost opp.
            </div>
          </div>
        </div>

        {/* Expiring <= 3 Days */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
              EXPIRING ≤ 3 DAYS
            </span>
            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-mono text-[#D97706]">42</div>
            <div className="text-[10px] text-[#065F46] font-medium mt-0.5">
              Markdown 30%
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          {/* Search Query */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search SKU, Barcode, Item Name, Brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#0F172A] focus:bg-white focus:ring-1 focus:ring-[#10B981] focus:outline-hidden"
            />
          </div>

          {/* Department */}
          <div className="lg:col-span-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs text-[#0F172A]"
            >
              <option value="All Departments">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs text-[#0F172A]"
            >
              <option value="All Stocks">Status: All Stocks</option>
              <option value="In Stock">In Stock (Optimal)</option>
              <option value="Low Buffer">Low Buffer (&lt; Reorder)</option>
              <option value="Critical Low">Critical Low</option>
              <option value="Out of Stock">Out of Stock (0)</option>
              <option value="Expiring">Expiring (&le; 3 Days)</option>
            </select>
          </div>

          {/* Location / Aisle */}
          <div className="lg:col-span-2">
            <select
              value={selectedAisle}
              onChange={(e) => setSelectedAisle(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs text-[#0F172A]"
            >
              <option value="All Aisles">Location: All Aisles</option>
              <option value="Aisle 1">Aisle 1 (Produce)</option>
              <option value="Aisle 2">Aisle 2 (Dairy & Plant)</option>
              <option value="Aisle 3">Aisle 3 (Meat & Seafood)</option>
              <option value="Aisle 4">Aisle 4 (Bakery & Pantry)</option>
              <option value="Aisle 7">Aisle 7 (Dry Goods)</option>
              <option value="Aisle 8">Aisle 8 (Beverages)</option>
              <option value="Front">Front Registers / Stands</option>
            </select>
          </div>

          {/* Supplier Vendor */}
          <div className="lg:col-span-2">
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-xs text-[#0F172A]"
            >
              <option value="All Vendors">Supplier: All Vendors</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters & View Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-[#64748B] font-semibold">
              ACTIVE FILTERS:
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#334155] font-medium flex items-center gap-1">
              Facility: {activeFacility}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#334155] font-medium flex items-center gap-1">
              Sort: {sortField} ({sortDirection})
            </span>
            {(searchQuery ||
              selectedDept !== "All Departments" ||
              selectedStatus !== "All Stocks" ||
              selectedAisle !== "All Aisles" ||
              selectedSupplier !== "All Vendors") && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-[#064E3B] hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#64748B] font-mono">
              Showing{" "}
              <span className="font-bold text-[#0F172A]">
                {filteredProducts.length}
              </span>{" "}
              of {totalCatalogCount} products
            </span>
            <div className="flex items-center border border-[#CBD5E1] rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 ${viewMode === "table" ? "bg-[#064E3B] text-white" : "bg-white text-[#64748B] hover:bg-[#F1F5F9]"}`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-[#064E3B] text-white" : "bg-white text-[#64748B] hover:bg-[#F1F5F9]"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      {viewMode === "table" ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#F1F5F9] text-[#334155] uppercase text-[10px] font-bold border-b border-[#CBD5E1]">
                  <th className="py-2.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedProductIds.length > 0 &&
                        selectedProductIds.length === filteredProducts.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#10B981]"
                    />
                  </th>
                  <th
                    className="py-2.5 px-4 cursor-pointer hover:text-[#064E3B]"
                    onClick={() => {
                      setSortField("name");
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      );
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>PRODUCT SKU & BARCODE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-4">DEPT & AISLE PLACEMENT</th>
                  <th
                    className="py-2.5 px-4 text-right cursor-pointer hover:text-[#064E3B]"
                    onClick={() => {
                      setSortField("price");
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      );
                    }}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>UNIT PRICE / MARGIN</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-4 text-right cursor-pointer hover:text-[#064E3B]"
                    onClick={() => {
                      setSortField("stock");
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      );
                    }}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>STOCK LEVEL & HEALTH</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredProducts.map((prod) => {
                  const isSelected = selectedProductIds.includes(prod.id);
                  const isOutOfStock = prod.currentStock === 0;
                  const isLow =
                    !isOutOfStock && prod.currentStock <= prod.reorderPoint;
                  const isCritical =
                    !isOutOfStock &&
                    prod.currentStock <= prod.criticalThreshold;
                  const capacityPercent = Math.min(
                    100,
                    Math.round((prod.currentStock / prod.maxCapacity) * 100),
                  );

                  return (
                    <tr
                      key={prod.id}
                      className={`inventory-row ${isSelected ? "bg-[#ECFDF5]/60" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProduct(prod.id)}
                          className="rounded border-[#CBD5E1] text-[#064E3B] focus:ring-[#10B981]"
                        />
                      </td>

                      {/* Product SKU & Barcode */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {prod.imageUrl ? (
                            <div className="w-10 h-20" >
                            <Image
                              src={prod.imageUrl}
                              alt={prod.name}
                             width={30}
                             height={30}
                              className="object-contain max-w-20 w-full h-full"
                            />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono font-bold text-xs text-emerald-300 bg-[#064E3B]">
                              {prod.department.slice(0, 3).toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#0F172A] truncate">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                              <span className="font-mono font-semibold text-[#064E3B]">
                                {prod.sku}
                              </span>
                              <span>•</span>
                              <span className="font-mono">{prod.barcode}</span>
                            </div>
                            <div className="text-[10px] text-[#94A3B8]">
                              {prod.brand} • {prod.packageType}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Aisle Placement */}
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-bold text-xs text-[#0F172A]">
                            {prod.department}
                          </div>
                          <div className="text-[11px] text-[#059669] font-medium flex items-center gap-1 mt-0.5">
                            <span>
                              {prod.aisle} / {prod.bay}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            {prod.shelfPlacement}{" "}
                            {prod.storageTemp && `• ${prod.storageTemp}`}
                          </div>
                        </div>
                      </td>

                      {/* Unit Price / Margin */}
                      <td className="py-3 px-4 text-right">
                        <div>
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="font-mono font-bold text-sm text-[#0F172A]">
                              ${prod.retailPrice.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-[#64748B]">
                              / {prod.unit}
                            </span>
                            <button
                              onClick={() => setSelectedProductForDrawer(prod)}
                              className="text-[#94A3B8] hover:text-[#064E3B] p-0.5"
                              title="Override Price"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                            Cost: ${prod.wholesaleCost.toFixed(2)}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                                prod.grossMargin >= 40
                                  ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                                  : prod.grossMargin >= 25
                                    ? "bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]"
                                    : "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                              }`}
                            >
                              {prod.grossMargin.toFixed(1)}% margin
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Stock Level & Health */}
                      <td className="py-3 px-4 text-right">
                        <div>
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-mono font-bold text-xs text-[#0F172A]">
                              {prod.currentStock} {prod.unit}
                            </span>
                            {isOutOfStock ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0F172A] text-white">
                                OUT OF STOCK
                              </span>
                            ) : isCritical ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                                Critical Low
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                                Low Buffer
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                Optimal
                              </span>
                            )}
                          </div>

                          {/* Capacity Bar */}
                          <div className="w-32 ml-auto mt-1.5">
                            <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                              <div
                                style={{ width: `${capacityPercent}%` }}
                                className={`h-full rounded-full ${
                                  isOutOfStock
                                    ? "bg-rose-500"
                                    : isLow
                                      ? "bg-[#D97706]"
                                      : "bg-[#064E3B]"
                                }`}
                              />
                            </div>
                            <div className="text-[10px] text-[#94A3B8] text-right mt-0.5 font-mono">
                              {capacityPercent}% of {prod.maxCapacity} cap
                            </div>
                          </div>

                          {/* In transit or reorder note */}
                          {prod.transitStock ? (
                            <div className="text-[10px] text-[#059669] font-medium mt-0.5 flex items-center justify-end gap-1">
                              <Truck className="w-3 h-3" />
                              <span>
                                {prod.transitPO} in transit (ETA:{" "}
                                {prod.transitETA})
                              </span>
                            </div>
                          ) : isLow ? (
                            <div className="text-[10px] text-[#92400E] mt-0.5">
                              Below reorder minimum ({prod.reorderPoint})
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProductForDrawer(prod)}
                            className="px-2.5 py-1 bg-[#064E3B] hover:bg-[#022C22] text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Override
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1 text-[#94A3B8] hover:text-rose-600 rounded"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setSelectedProductForDrawer(prod)}
              className="bg-white border border-[#E2E8F0] hover:border-[#10B981] rounded-xl p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0]">
                {prod.imageUrl ? (
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono font-bold text-xs text-emerald-300 bg-[#064E3B]">
                    {prod.department.slice(0, 3).toUpperCase()}
                  </div>
                )}
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[#065F46] rounded">
                  {prod.department}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] text-[#64748B]">
                    {prod.sku}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#064E3B]">
                    ${prod.retailPrice.toFixed(2)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#064E3B] transition-colors line-clamp-1">
                  {prod.name}
                </h3>
                <div className="text-xs text-[#64748B] flex items-center gap-2 mt-1">
                  <span>{prod.aisle}</span>
                  <span>•</span>
                  <span>{prod.packageType}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="font-mono text-[#64748B]">
                  Stock:{" "}
                  <strong className="text-[#0F172A]">
                    {prod.currentStock} {prod.unit}
                  </strong>
                </span>
                <span className="text-[11px] font-bold text-[#059669]">
                  {prod.grossMargin}% Margin
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over drawer */}
      <StockOverrideDrawer
        product={selectedProductForDrawer}
        isOpen={!!selectedProductForDrawer}
        onClose={() => setSelectedProductForDrawer(null)}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      {/* Batch Price Modal */}
      <BatchPriceModal
        isOpen={isBatchPriceOpen}
        onClose={() => setIsBatchPriceOpen(false)}
      />
    </div>
  );
}

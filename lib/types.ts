export type Department = 
  | 'Produce'
  | 'Dairy & Eggs'
  | 'Meat & Seafood'
  | 'Bakery & Artisan'
  | 'Pantry & Dry Goods'
  | 'Beverages'
  | 'Frozen'
  | 'Snacks & Confectionery'
  | 'Deli & Prepared Foods'
  | 'Health & Wellness'
  | 'Household & Cleaning'
  | 'Floral & Seasonal';

export type StockHealthStatus = 'Optimal' | 'Low Buffer' | 'Critical Low' | 'Out of Stock' | 'Expiring';

export type StockReason = 
  | 'Inbound shipment arrival (PO Intake)'
  | 'Cycle count audit adjustment'
  | 'Breakage / Spoilage write-off'
  | 'POS adjustment'
  | 'Backroom floor pull'
  | 'Return to vendor (RTV)';

export interface Product {
  id: string;
  sku: string;
  barcode: string; // EAN-13 or UPC
  name: string;
  brand: string;
  packageType: string; // e.g. "Bulk / Lb", "1 Gallon Jug", "Tray Pack", "Single Cup", "Squeeze Bottle"
  department: Department;
  aisle: string; // e.g. "Aisle 1-A"
  bay: string; // e.g. "Bay 3"
  shelfPlacement: string; // e.g. "Ambient Wet Rack", "Vault 4", "Case 12 • Cold-chain"
  storageTemp?: string; // e.g. "34°F Optimal", "Ambient", "-5°F Deep Freeze"
  
  // Pricing & Margins
  unit: string; // 'lb' | 'units' | 'ctn' | 'pack' | 'jug' | 'bag' | 'bottle'
  retailPrice: number;
  wholesaleCost: number;
  grossMargin: number; // calculated %
  previousRetailPrice?: number;
  discountPercentage?: number;
  
  // Stock telemetry
  currentStock: number;
  reorderPoint: number; // Low buffer threshold
  criticalThreshold: number; // Critical stock threshold
  maxCapacity: number; // Max shelf capacity
  transitStock?: number; // Units in transit via PO
  transitPO?: string;
  transitETA?: string;
  
  // Expiry & Batches
  expiryDate?: string; // YYYY-MM-DD
  daysUntilExpiry?: number;
  batchLot?: string;
  
  // Supplier
  supplierId: string;
  supplierName: string;
  
  // Analytics telemetry
  unitsSoldToday: number;
  unitsSoldWeek: number;
  unitsSoldMonth: number;
  unitsSoldYear: number;
  revenueMonth: number;
  turnoverRate: number; // e.g. 8.4x
  daysIdle: number; // days without sales event
  tiedCapital: number; // stock * cost
  
  // ESL (Electronic Shelf Label)
  eslSyncStatus: 'synced' | 'pending' | 'error';
  eslChannel?: string;
  imageUrl?: string;
  categoryIcon?: string;
}

export interface SaleItem {
  productId: string;
  sku: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  totalPrice: number;
  unitCost: number;
  marginAmount: number;
}

export interface SaleTransaction {
  id: string;
  receiptNumber: string;
  timestamp: string;
  registerId: string; // e.g. "REG-04"
  cashierName: string;
  customerType: 'Regular' | 'Loyalty Member' | 'VIP SuperClub';
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'Credit / Debit Card' | 'Apple Pay / Contactless' | 'Supermarket Gift Card';
  totalMargin: number;
  status: 'Completed' | 'Refunded' | 'Voided';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO #8832"
  supplierId: string;
  supplierName: string;
  status: 'Draft' | 'Submitted' | 'In Transit' | 'Received' | 'Discrepancy';
  orderDate: string;
  expectedDelivery: string;
  receivedDate?: string;
  items: {
    productId: string;
    sku: string;
    name: string;
    orderedQty: number;
    receivedQty?: number;
    unitCost: number;
    totalCost: number;
    unit: string;
  }[];
  totalAmount: number;
  coldChainVerified?: boolean;
  temperatureReading?: string;
  dockNumber?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: Department[];
  leadTimeHours: number;
  reliabilityRating: number; // 1-5 or %
  paymentTerms: string; // e.g. "Net 30"
  activePOsCount: number;
  address: string;
  imageUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  sku: string;
  productName: string;
  actionType: 'Price Override' | 'Stock Intake' | 'Spoilage Write-Off' | 'Cycle Audit' | 'ESL Sync' | 'Markdown Applied';
  previousValue: string;
  newValue: string;
  delta?: number;
  reason: string;
  user: string;
  financialImpact?: number;
}

export interface DeadStockAlert {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  department: Department;
  shelfLocation: string;
  daysIdle: number;
  stock: number;
  unit: string;
  tiedCapital: number;
  recommendedAction: 'Mark down 30% or Bundle' | 'Reallocate to Health Aisle' | 'Flash 50% discount' | 'Move to checkout shelf #2' | 'Return to Vendor (RTV)';
  actionType: 'markdown_30' | 'reallocate' | 'flash_50' | 'move_endcap' | 'rtv';
}

export interface DemandForecastItem {
  id: string;
  title: string;
  tag: string;
  changePercentage: string;
  isPositive: boolean;
  description: string;
  supplierLead: string;
  actionText: string;
  actionType: 'auto_po' | 'planogram' | 'spec_check';
  telemetryNote?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  structuredData?: {
    type: 'products' | 'items' | 'kpis' | 'po_draft' | 'markdown_plan' | 'audit_report' | 'chart';
    title?: string;
    items?: any[];
    metrics?: Record<string, string | number>;
    actions?: { label: string; actionId: string; variant?: 'primary' | 'secondary' | 'danger' }[];
  };
}

export interface ShiftTelemetry {
  facilityId: string;
  facilityName: string;
  shiftNumber: number;
  activeRegisters: string; // "14/14"
  handheldUnitsOnline: string; // "8/8"
  telemetryStatus: 'Sync OK' | 'Syncing' | 'Degraded';
  weather: string;
  peakFootTraffic: string;
  todayGrossSales: number;
  todayTargetSales: number;
  salesGrowthVsYest: number;
  totalTransactions: number;
  avgBasketSize: number;
  totalSKUs: number;
  storeLedgerValue: number;
  inStockFillRate: number;
  stockoutsCount: number;
  lowBufferCount: number;
  shrinkageRiskAmount: number;
  perishablesAtRiskCount: number;
  coldChainTempAvg: string;
}

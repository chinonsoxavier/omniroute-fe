'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  PurchaseOrder,
  SaleTransaction,
  Supplier,
  AuditLog,
  DeadStockAlert,
  DemandForecastItem,
  ShiftTelemetry,
  AIMessage,
  Department
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_SALES_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DEAD_STOCK_ALERTS,
  INITIAL_DEMAND_FORECASTS,
  INITIAL_SHIFT_TELEMETRY
} from './mock-data';

interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  sales: SaleTransaction[];
  auditLogs: AuditLog[];
  deadStockAlerts: DeadStockAlert[];
  demandForecasts: DemandForecastItem[];
  telemetry: ShiftTelemetry;
  activeFacility: string;
  setActiveFacility: (facility: string) => void;
  analyticsPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  setAnalyticsPeriod: (period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom') => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  
  // Actions
  addProduct: (productData: Omit<Product, 'id' | 'grossMargin' | 'unitsSoldToday' | 'unitsSoldWeek' | 'unitsSoldMonth' | 'unitsSoldYear' | 'revenueMonth' | 'turnoverRate' | 'daysIdle' | 'tiedCapital' | 'eslSyncStatus'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  adjustStock: (productId: string, newStock: number, reason: string, notes?: string, pushToESL?: boolean) => void;
  overridePrice: (productId: string, newRetailPrice: number, newWholesaleCost?: number, notes?: string, pushToESL?: boolean) => void;
  batchUpdatePrices: (percentageChange: number, departmentFilter?: string) => void;
  deleteProduct: (id: string) => void;
  
  // Sales
  recordSale: (items: { productId: string; quantity: number; discount?: number }[], paymentMethod: 'Cash' | 'Credit / Debit Card' | 'Apple Pay / Contactless' | 'Supermarket Gift Card', customerType?: 'Regular' | 'Loyalty Member' | 'VIP SuperClub') => SaleTransaction;
  refundSale: (transactionId: string) => void;
  
  // Inbound POs
  createPurchaseOrder: (supplierId: string, items: { productId: string; orderedQty: number; unitCost: number }[], notes?: string) => PurchaseOrder;
  receivePurchaseOrder: (poId: string, dockNumber: string, temperature?: string, notes?: string) => void;
  autoDraftLowStockPOs: () => number;
  
  // Dead Stock & Markdowns
  applyDeadStockAction: (alertId: string, actionType: string) => void;
  
  // AI Manager & Copilot
  aiMessages: AIMessage[];
  isAiTyping: boolean;
  sendAiMessage: (text: string) => void;
  runFloorAudit: () => Promise<string>;
  generateShiftReport: () => string;
  
  // Utilities
  exportInventoryCSV: () => void;
  exportSalesCSV: () => void;
  resetToSampleData: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'omnistock_products_v1',
  SUPPLIERS: 'omnistock_suppliers_v1',
  POS: 'omnistock_pos_v1',
  SALES: 'omnistock_sales_v1',
  AUDIT: 'omnistock_audit_v1',
  DEAD_STOCK: 'omnistock_dead_stock_v1',
  FORECASTS: 'omnistock_forecasts_v1',
  TELEMETRY: 'omnistock_telemetry_v1',
  FACILITY: 'omnistock_facility_v1',
  AI_CHAT: 'omnistock_ai_chat_v1'
};

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Hello Sarah, I am your OmniStock AI Inventory Copilot. I have synchronized with Floor Aisles 1-18, active POS registers, and the backroom cold-chain telemetry. How can I assist you with inventory operations, restocking forecasts, or margin analysis today?',
    timestamp: 'Just now',
    structuredData: {
      type: 'kpis',
      title: 'Current Shift High-Priority Alerts',
      metrics: {
        'Critical Low Items': '4 SKUs',
        'Out of Stock': '1 SKU (Oatly Milk)',
        'Perishables Expiry ≤ 48h': '3 Batches',
        'Tied-up Dead Capital': '$902.50'
      },
      actions: [
        { label: 'Auto-Draft Restock POs', actionId: 'auto_draft_po', variant: 'primary' },
        { label: 'Run 18-Aisle AI Floor Audit', actionId: 'run_floor_audit', variant: 'secondary' },
        { label: 'Review Perishable Markdowns', actionId: 'review_markdowns', variant: 'secondary' }
      ]
    }
  }
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [sales, setSales] = useState<SaleTransaction[]>(INITIAL_SALES_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [deadStockAlerts, setDeadStockAlerts] = useState<DeadStockAlert[]>(INITIAL_DEAD_STOCK_ALERTS);
  const [demandForecasts, setDemandForecasts] = useState<DemandForecastItem[]>(INITIAL_DEMAND_FORECASTS);
  const [telemetry, setTelemetry] = useState<ShiftTelemetry>(INITIAL_SHIFT_TELEMETRY);
  const [activeFacility, setActiveFacility] = useState<string>('#104 Flagship');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedSuppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));

      const savedPOs = localStorage.getItem(STORAGE_KEYS.POS);
      if (savedPOs) setPurchaseOrders(JSON.parse(savedPOs));

      const savedSales = localStorage.getItem(STORAGE_KEYS.SALES);
      if (savedSales) setSales(JSON.parse(savedSales));

      const savedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (savedAudit) setAuditLogs(JSON.parse(savedAudit));

      const savedDeadStock = localStorage.getItem(STORAGE_KEYS.DEAD_STOCK);
      if (savedDeadStock) setDeadStockAlerts(JSON.parse(savedDeadStock));

      const savedFacility = localStorage.getItem(STORAGE_KEYS.FACILITY);
      if (savedFacility) setActiveFacility(savedFacility);

      const savedAi = localStorage.getItem(STORAGE_KEYS.AI_CHAT);
      if (savedAi) setAiMessages(JSON.parse(savedAi));
    } catch (e) {
      console.warn('Storage read error', e);
    }
  }, []);

  // Save changes
  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  };

  const addProduct = (data: Omit<Product, 'id' | 'grossMargin' | 'unitsSoldToday' | 'unitsSoldWeek' | 'unitsSoldMonth' | 'unitsSoldYear' | 'revenueMonth' | 'turnoverRate' | 'daysIdle' | 'tiedCapital' | 'eslSyncStatus'>): Product => {
    const margin = data.retailPrice > 0 
      ? Number((((data.retailPrice - data.wholesaleCost) / data.retailPrice) * 100).toFixed(1))
      : 0;

    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      grossMargin: margin,
      unitsSoldToday: 0,
      unitsSoldWeek: 0,
      unitsSoldMonth: 0,
      unitsSoldYear: 0,
      revenueMonth: 0,
      turnoverRate: 0,
      daysIdle: 0,
      tiedCapital: Number((data.currentStock * data.wholesaleCost).toFixed(2)),
      eslSyncStatus: 'synced',
      eslChannel: `${data.aisle} Node ${Math.floor(Math.random() * 20) + 1}`
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    saveState(STORAGE_KEYS.PRODUCTS, updated);

    // Add audit log
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sku: newProd.sku,
      productName: newProd.name,
      actionType: 'Stock Intake',
      previousValue: '0',
      newValue: `${newProd.currentStock} ${newProd.unit}`,
      delta: newProd.currentStock,
      reason: 'New product catalog entry onboarded',
      user: 'Sarah Jenkins',
      financialImpact: newProd.tiedCapital
    };
    const updatedAudit = [audit, ...auditLogs];
    setAuditLogs(updatedAudit);
    saveState(STORAGE_KEYS.AUDIT, updatedAudit);

    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => {
      if (p.id !== id) return p;
      const retailPrice = updates.retailPrice ?? p.retailPrice;
      const wholesaleCost = updates.wholesaleCost ?? p.wholesaleCost;
      const margin = retailPrice > 0 ? Number((((retailPrice - wholesaleCost) / retailPrice) * 100).toFixed(1)) : 0;
      const currentStock = updates.currentStock ?? p.currentStock;
      const tiedCapital = Number((currentStock * wholesaleCost).toFixed(2));

      return {
        ...p,
        ...updates,
        grossMargin: margin,
        tiedCapital
      };
    });
    setProducts(updated);
    saveState(STORAGE_KEYS.PRODUCTS, updated);
  };

  const adjustStock = (productId: string, newStock: number, reason: string, notes?: string, pushToESL = true) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    const diff = newStock - target.currentStock;
    const updated = products.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        currentStock: newStock,
        tiedCapital: Number((newStock * p.wholesaleCost).toFixed(2)),
        eslSyncStatus: pushToESL ? 'synced' : p.eslSyncStatus
      };
    });
    setProducts(updated);
    saveState(STORAGE_KEYS.PRODUCTS, updated);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sku: target.sku,
      productName: target.name,
      actionType: diff < 0 && reason.includes('Spoilage') ? 'Spoilage Write-Off' : 'Stock Intake',
      previousValue: `${target.currentStock} ${target.unit}`,
      newValue: `${newStock} ${target.unit}`,
      delta: diff,
      reason: notes || reason,
      user: 'Sarah Jenkins (Store Director)',
      financialImpact: Number((diff * target.wholesaleCost).toFixed(2))
    };
    const updatedAudit = [audit, ...auditLogs];
    setAuditLogs(updatedAudit);
    saveState(STORAGE_KEYS.AUDIT, updatedAudit);
  };

  const overridePrice = (productId: string, newRetailPrice: number, newWholesaleCost?: number, notes?: string, pushToESL = true) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    const cost = newWholesaleCost !== undefined ? newWholesaleCost : target.wholesaleCost;
    const newMargin = newRetailPrice > 0 ? Number((((newRetailPrice - cost) / newRetailPrice) * 100).toFixed(1)) : 0;

    const updated = products.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        previousRetailPrice: target.retailPrice,
        retailPrice: newRetailPrice,
        wholesaleCost: cost,
        grossMargin: newMargin,
        eslSyncStatus: pushToESL ? 'synced' : p.eslSyncStatus
      };
    });
    setProducts(updated);
    saveState(STORAGE_KEYS.PRODUCTS, updated);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sku: target.sku,
      productName: target.name,
      actionType: 'Price Override',
      previousValue: `$${target.retailPrice.toFixed(2)}`,
      newValue: `$${newRetailPrice.toFixed(2)} (Margin: ${newMargin}%)`,
      reason: notes || (pushToESL ? 'Price updated & pushed to 2.4GHz Electronic Shelf Label' : 'Price override recorded'),
      user: 'Sarah Jenkins',
      financialImpact: (newRetailPrice - target.retailPrice) * target.currentStock
    };
    const updatedAudit = [audit, ...auditLogs];
    setAuditLogs(updatedAudit);
    saveState(STORAGE_KEYS.AUDIT, updatedAudit);
  };

  const batchUpdatePrices = (percentageChange: number, departmentFilter?: string) => {
    const updated = products.map(p => {
      if (departmentFilter && departmentFilter !== 'All Departments' && p.department !== departmentFilter) {
        return p;
      }
      const newRetailPrice = Number((p.retailPrice * (1 + percentageChange / 100)).toFixed(2));
      const newMargin = Number((((newRetailPrice - p.wholesaleCost) / newRetailPrice) * 100).toFixed(1));
      return {
        ...p,
        previousRetailPrice: p.retailPrice,
        retailPrice: newRetailPrice,
        grossMargin: newMargin,
        eslSyncStatus: 'synced' as const
      };
    });
    setProducts(updated);
    saveState(STORAGE_KEYS.PRODUCTS, updated);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sku: 'BATCH-MULTI',
      productName: departmentFilter && departmentFilter !== 'All Departments' ? `Batch ${departmentFilter}` : 'Storewide Catalog',
      actionType: 'Price Override',
      previousValue: 'Multi',
      newValue: `${percentageChange >= 0 ? '+' : ''}${percentageChange}% Price Adjustment`,
      reason: `Batch price adjustment applied across catalog`,
      user: 'Sarah Jenkins',
      financialImpact: 0
    };
    const updatedAudit = [audit, ...auditLogs];
    setAuditLogs(updatedAudit);
    saveState(STORAGE_KEYS.AUDIT, updatedAudit);
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveState(STORAGE_KEYS.PRODUCTS, updated);

    if (target) {
      const audit: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sku: target.sku,
        productName: target.name,
        actionType: 'Spoilage Write-Off',
        previousValue: `${target.currentStock} ${target.unit}`,
        newValue: '0 (Archived)',
        delta: -target.currentStock,
        reason: 'SKU decommissioned from catalog',
        user: 'Sarah Jenkins'
      };
      setAuditLogs([audit, ...auditLogs]);
    }
  };

  const recordSale = (
    itemsList: { productId: string; quantity: number; discount?: number }[],
    paymentMethod: 'Cash' | 'Credit / Debit Card' | 'Apple Pay / Contactless' | 'Supermarket Gift Card',
    customerType: 'Regular' | 'Loyalty Member' | 'VIP SuperClub' = 'Regular'
  ): SaleTransaction => {
    let subtotal = 0;
    let totalMargin = 0;
    const saleItems = itemsList.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const unitPrice = prod?.retailPrice || 0;
      const unitCost = prod?.wholesaleCost || 0;
      const discount = item.discount || 0;
      const effectivePrice = unitPrice * (1 - discount / 100);
      const totalPrice = Number((effectivePrice * item.quantity).toFixed(2));
      const margin = Number(((effectivePrice - unitCost) * item.quantity).toFixed(2));

      subtotal += totalPrice;
      totalMargin += margin;

      return {
        productId: item.productId,
        sku: prod?.sku || 'UNKNOWN',
        name: prod?.name || 'Item',
        unit: prod?.unit || 'units',
        quantity: item.quantity,
        unitPrice,
        discount,
        totalPrice,
        unitCost,
        marginAmount: margin
      };
    });

    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const newTx: SaleTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      registerId: `REG-0${Math.floor(Math.random() * 8) + 1}`,
      cashierName: 'Sarah Jenkins',
      customerType,
      items: saleItems,
      subtotal,
      tax,
      total,
      paymentMethod,
      totalMargin: Number(totalMargin.toFixed(2)),
      status: 'Completed'
    };

    // Deduct stock from products and update sales counts
    const updatedProducts = products.map(prod => {
      const sold = itemsList.find(i => i.productId === prod.id);
      if (!sold) return prod;
      const newStock = Math.max(0, Number((prod.currentStock - sold.quantity).toFixed(2)));
      return {
        ...prod,
        currentStock: newStock,
        unitsSoldToday: prod.unitsSoldToday + sold.quantity,
        unitsSoldWeek: prod.unitsSoldWeek + sold.quantity,
        unitsSoldMonth: prod.unitsSoldMonth + sold.quantity,
        unitsSoldYear: prod.unitsSoldYear + sold.quantity,
        revenueMonth: Number((prod.revenueMonth + sold.quantity * prod.retailPrice).toFixed(2)),
        tiedCapital: Number((newStock * prod.wholesaleCost).toFixed(2))
      };
    });

    setProducts(updatedProducts);
    saveState(STORAGE_KEYS.PRODUCTS, updatedProducts);

    const updatedSales = [newTx, ...sales];
    setSales(updatedSales);
    saveState(STORAGE_KEYS.SALES, updatedSales);

    // Update shift telemetry
    const newGross = Number((telemetry.todayGrossSales + total).toFixed(2));
    const newTxCount = telemetry.totalTransactions + 1;
    const updatedTelemetry = {
      ...telemetry,
      todayGrossSales: newGross,
      totalTransactions: newTxCount,
      avgBasketSize: Number((newGross / newTxCount).toFixed(2))
    };
    setTelemetry(updatedTelemetry);
    saveState(STORAGE_KEYS.TELEMETRY, updatedTelemetry);

    return newTx;
  };

  const refundSale = (transactionId: string) => {
    const tx = sales.find(t => t.id === transactionId);
    if (!tx || tx.status === 'Refunded') return;

    // Restore stock
    const updatedProducts = products.map(prod => {
      const item = tx.items.find(i => i.productId === prod.id);
      if (!item) return prod;
      return {
        ...prod,
        currentStock: Number((prod.currentStock + item.quantity).toFixed(2)),
        unitsSoldToday: Math.max(0, prod.unitsSoldToday - item.quantity),
        tiedCapital: Number(((prod.currentStock + item.quantity) * prod.wholesaleCost).toFixed(2))
      };
    });
    setProducts(updatedProducts);
    saveState(STORAGE_KEYS.PRODUCTS, updatedProducts);

    const updatedSales = sales.map(t => t.id === transactionId ? { ...t, status: 'Refunded' as const } : t);
    setSales(updatedSales);
    saveState(STORAGE_KEYS.SALES, updatedSales);

    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sku: 'REFUND',
      productName: `Receipt #${tx.receiptNumber}`,
      actionType: 'Stock Intake',
      previousValue: 'Sold',
      newValue: 'Refunded & Restocked',
      reason: `Customer return processed at ${tx.registerId}`,
      user: 'Sarah Jenkins',
      financialImpact: -tx.total
    };
    setAuditLogs([audit, ...auditLogs]);
  };

  const createPurchaseOrder = (
    supplierId: string,
    items: { productId: string; orderedQty: number; unitCost: number }[],
    notes?: string
  ): PurchaseOrder => {
    const supp = suppliers.find(s => s.id === supplierId);
    let totalAmount = 0;
    const poItems = items.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const totalCost = Number((item.orderedQty * item.unitCost).toFixed(2));
      totalAmount += totalCost;
      return {
        productId: item.productId,
        sku: prod?.sku || 'UNKNOWN',
        name: prod?.name || 'Item',
        orderedQty: item.orderedQty,
        unitCost: item.unitCost,
        totalCost,
        unit: prod?.unit || 'units'
      };
    });

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO #${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId,
      supplierName: supp?.name || 'Supplier',
      status: 'Submitted',
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      items: poItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      dockNumber: 'Bay 2 (General Receiving)',
      notes: notes || 'Standard replenishment PO generated'
    };

    const updated = [newPO, ...purchaseOrders];
    setPurchaseOrders(updated);
    saveState(STORAGE_KEYS.POS, updated);

    return newPO;
  };

  const receivePurchaseOrder = (poId: string, dockNumber: string, temperature?: string, notes?: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po || po.status === 'Received') return;

    // Add stock to products
    const updatedProducts = products.map(prod => {
      const poItem = po.items.find(i => i.productId === prod.id);
      if (!poItem) return prod;
      const newStock = prod.currentStock + poItem.orderedQty;
      return {
        ...prod,
        currentStock: newStock,
        transitStock: 0,
        transitPO: undefined,
        transitETA: undefined,
        tiedCapital: Number((newStock * prod.wholesaleCost).toFixed(2)),
        eslSyncStatus: 'synced' as const
      };
    });
    setProducts(updatedProducts);
    saveState(STORAGE_KEYS.PRODUCTS, updatedProducts);

    const updatedPOs = purchaseOrders.map(p => {
      if (p.id !== poId) return p;
      return {
        ...p,
        status: 'Received' as const,
        receivedDate: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        dockNumber: dockNumber || p.dockNumber,
        coldChainVerified: true,
        temperatureReading: temperature || '36.4°F Checked In Spec',
        verifiedBy: 'Sarah Jenkins (Store Director)',
        notes: notes || p.notes
      };
    });
    setPurchaseOrders(updatedPOs);
    saveState(STORAGE_KEYS.POS, updatedPOs);

    // Add audit log
    const audit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sku: `${po.poNumber}`,
      productName: `${po.supplierName} Inbound Delivery`,
      actionType: 'Stock Intake',
      previousValue: 'In Transit',
      newValue: `Received ${po.items.length} SKUs`,
      reason: `${po.poNumber} verified at ${dockNumber}. Cold-chain logged: ${temperature || 'In-spec'}`,
      user: 'Sarah Jenkins',
      financialImpact: po.totalAmount
    };
    const updatedAudit = [audit, ...auditLogs];
    setAuditLogs(updatedAudit);
    saveState(STORAGE_KEYS.AUDIT, updatedAudit);
  };

  const autoDraftLowStockPOs = (): number => {
    const lowProducts = products.filter(p => p.currentStock <= p.reorderPoint);
    if (lowProducts.length === 0) return 0;

    // Group by supplier
    const grouped: Record<string, typeof lowProducts> = {};
    lowProducts.forEach(p => {
      if (!grouped[p.supplierId]) grouped[p.supplierId] = [];
      grouped[p.supplierId].push(p);
    });

    let count = 0;
    const newPOs: PurchaseOrder[] = [];
    Object.entries(grouped).forEach(([suppId, prods]) => {
      const supp = suppliers.find(s => s.id === suppId);
      let totalAmount = 0;
      const items = prods.map(p => {
        const orderQty = Math.max(p.maxCapacity - p.currentStock, 20);
        const totalCost = Number((orderQty * p.wholesaleCost).toFixed(2));
        totalAmount += totalCost;
        return {
          productId: p.id,
          sku: p.sku,
          name: p.name,
          orderedQty: orderQty,
          unitCost: p.wholesaleCost,
          totalCost,
          unit: p.unit
        };
      });

      const po: PurchaseOrder = {
        id: `po-${Date.now()}-${count}`,
        poNumber: `PO #${Math.floor(2000 + Math.random() * 7000)}`,
        supplierId: suppId,
        supplierName: supp?.name || 'Supplier',
        status: 'Draft',
        orderDate: new Date().toISOString().slice(0, 10),
        expectedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        items,
        totalAmount: Number(totalAmount.toFixed(2)),
        notes: 'AI Copilot auto-draft based on safety threshold triggers'
      };
      newPOs.push(po);
      count++;
    });

    const updated = [...newPOs, ...purchaseOrders];
    setPurchaseOrders(updated);
    saveState(STORAGE_KEYS.POS, updated);

    return count;
  };

  const applyDeadStockAction = (alertId: string, actionType: string) => {
    const alert = deadStockAlerts.find(a => a.id === alertId);
    if (!alert) return;

    if (actionType === 'markdown_30' || actionType === 'flash_50') {
      const discount = actionType === 'markdown_30' ? 0.30 : 0.50;
      const prod = products.find(p => p.id === alert.productId);
      if (prod) {
        const newPrice = Number((prod.retailPrice * (1 - discount)).toFixed(2));
        overridePrice(prod.id, newPrice, prod.wholesaleCost, `Dead Stock AI Clearance: ${discount * 100}% Discount Applied`, true);
      }
    }

    const updatedAlerts = deadStockAlerts.filter(a => a.id !== alertId);
    setDeadStockAlerts(updatedAlerts);
    saveState(STORAGE_KEYS.DEAD_STOCK, updatedAlerts);
  };

  const sendAiMessage = (text: string) => {
    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...aiMessages, userMsg];
    setAiMessages(newMessages);
    setIsAiTyping(true);

    setTimeout(() => {
      const q = text.toLowerCase();
      let replyText = '';
      let structuredData: AIMessage['structuredData'] = undefined;

      if (q.includes('restock') || q.includes('reorder') || q.includes('po') || q.includes('low stock')) {
        const lowStock = products.filter(p => p.currentStock <= p.reorderPoint);
        replyText = `I analyzed our 14,820 SKU catalog. We currently have **${lowStock.length} items** below their critical safety thresholds. Here is the recommended replenishment plan to prevent weekend stockouts:`;
        structuredData = {
          type: 'products',
          title: 'Immediate Reorder Candidates',
          items: lowStock.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            currentStock: `${p.currentStock} ${p.unit}`,
            reorderPoint: `${p.reorderPoint} ${p.unit}`,
            recommendedOrder: `${Math.max(p.maxCapacity - p.currentStock, 20)} ${p.unit}`,
            supplier: p.supplierName,
            status: p.currentStock === 0 ? 'Out of Stock' : 'Low Buffer'
          })),
          actions: [
            { label: 'Auto-Generate All Purchase Orders', actionId: 'auto_draft_po', variant: 'primary' }
          ]
        };
      } else if (q.includes('expir') || q.includes('perish') || q.includes('spoil')) {
        const expiring = products.filter(p => p.daysUntilExpiry !== undefined && p.daysUntilExpiry <= 5);
        replyText = `Identified **${expiring.length} perishable batches** nearing expiration within the next 1-5 days. Applying dynamic markdowns now will recover an estimated **$340.00+ in revenue** before write-off thresholds:`;
        structuredData = {
          type: 'markdown_plan',
          title: 'Expiring Perishables Markdown Plan',
          items: expiring.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            stock: `${p.currentStock} ${p.unit}`,
            daysLeft: `${p.daysUntilExpiry} days left`,
            currentPrice: `$${p.retailPrice.toFixed(2)}`,
            recommendedPrice: `$${(p.retailPrice * 0.75).toFixed(2)} (-25%)`,
            projectedRecovery: `$${(p.currentStock * p.retailPrice * 0.75).toFixed(2)}`
          })),
          actions: [
            { label: 'Apply 25% Flash Markdown to ESL Tags', actionId: 'apply_perishable_markdown', variant: 'primary' }
          ]
        };
      } else if (q.includes('dead stock') || q.includes('least sold') || q.includes('slow')) {
        replyText = `Found **${deadStockAlerts.length} dead stock items** with high shelf dwell times (>15 days without scan events) tying up **$902.50 in working capital**:`;
        structuredData = {
          type: 'items',
          title: 'Dead Stock & Tied Capital Diagnostics',
          items: deadStockAlerts.map(d => ({
            name: d.productName,
            location: d.shelfLocation,
            idle: `${d.daysIdle} days idle`,
            tiedCapital: `$${d.tiedCapital.toFixed(2)}`,
            action: d.recommendedAction
          })),
          actions: [
            { label: 'Execute Recommended Promotions', actionId: 'resolve_dead_stock', variant: 'primary' }
          ]
        };
      } else if (q.includes('top sold') || q.includes('most sold') || q.includes('best seller') || q.includes('velocity')) {
        const sorted = [...products].sort((a, b) => b.unitsSoldMonth - a.unitsSoldMonth).slice(0, 5);
        replyText = `Here are the **Top 5 Revenue & Velocity Drivers** across all departments for the current period:`;
        structuredData = {
          type: 'products',
          title: 'Top Sales Velocity Drivers',
          items: sorted.map((p, idx) => ({
            rank: `#${idx + 1}`,
            name: p.name,
            sku: p.sku,
            unitsSold: `${p.unitsSoldMonth.toLocaleString()} units`,
            revenue: `$${p.revenueMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            margin: `${p.grossMargin}%`,
            turnover: `${p.turnoverRate}x`
          }))
        };
      } else if (q.includes('margin') || q.includes('profit') || q.includes('pricing')) {
        replyText = `Store-wide average gross margin is currently **38.2%** (+1.6 pts vs previous period). Top contributing margin departments: **Beverages (50.5%)**, **Produce (43.0%)**, and **Bakery (43.7%)**. COGS is running efficiently at $175,834 with low shrinkage (1.1%).`;
        structuredData = {
          type: 'kpis',
          title: 'Margin & Profitability Breakdown',
          metrics: {
            'Gross Profit': '$108,686',
            'Gross Margin Rate': '38.2%',
            'Highest Margin Category': 'Imported Beverages (50.5%)',
            'Lowest Margin Category': 'Commercial Dairy (29.0%)'
          }
        };
      } else {
        replyText = `Understood. I have queried the active supermarket database for "${text}". Store operations are running smoothly with **96.4% in-stock fill rate**, **$48,924.50 today's sales**, and **14/14 active registers** synced. Would you like a detailed departmental breakdown, restock audit, or automated markdown plan?`;
      }

      const aiReply: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData
      };

      const finalMessages = [...newMessages, aiReply];
      setAiMessages(finalMessages);
      saveState(STORAGE_KEYS.AI_CHAT, finalMessages);
      setIsAiTyping(false);
    }, 900);
  };

  const runFloorAudit = async (): Promise<string> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const auditText = `AI Floor Audit completed across 18 Aisles: 14,820 SKUs scanned via 2.4GHz Electronic Shelf Gateway. Found 1 critical stockout (Aisle 2-D Oatly Milk), 3 items nearing shelf-life (Aisle 1-A / Bakery), and 1 misplaced barcode in Aisle 8-A. ESL tags refreshed.`;
        resolve(auditText);
      }, 1500);
    });
  };

  const generateShiftReport = (): string => {
    return `=== OMNISTOCK EXECUTIVE SHIFT REPORT ===
Facility: ${activeFacility} | Shift 1
Date: ${new Date().toLocaleDateString()}
Gross Sales: $${telemetry.todayGrossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })} (Target: $${telemetry.todayTargetSales.toLocaleString()})
Active Registers: ${telemetry.activeRegisters} (100% Uptime)
Transactions: ${telemetry.totalTransactions} | Avg Basket: $${telemetry.avgBasketSize.toFixed(2)}
In-Stock Rate: ${telemetry.inStockFillRate}% | Low Buffer Alerts: ${telemetry.lowBufferCount}
Cold-Chain Telemetry: ${telemetry.coldChainTempAvg} (All Coolers in spec)
Generated by: Sarah Jenkins, Store Director`;
  };

  const exportInventoryCSV = () => {
    const headers = ['SKU', 'Barcode', 'Product Name', 'Brand', 'Department', 'Aisle/Placement', 'Unit', 'Retail Price ($)', 'Wholesale Cost ($)', 'Gross Margin (%)', 'Current Stock', 'Reorder Point', 'Status', 'Supplier'];
    const rows = products.map(p => {
      const status = p.currentStock === 0 ? 'Out of Stock' : p.currentStock <= p.reorderPoint ? 'Low Buffer' : 'Optimal';
      return [
        `"${p.sku}"`,
        `"${p.barcode}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.brand}"`,
        `"${p.department}"`,
        `"${p.aisle} - ${p.bay}"`,
        `"${p.unit}"`,
        p.retailPrice.toFixed(2),
        p.wholesaleCost.toFixed(2),
        p.grossMargin.toFixed(1),
        p.currentStock,
        p.reorderPoint,
        `"${status}"`,
        `"${p.supplierName}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omnistock_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesCSV = () => {
    const headers = ['Receipt #', 'Timestamp', 'Register', 'Cashier', 'Customer Type', 'Items Count', 'Subtotal ($)', 'Tax ($)', 'Total ($)', 'Payment Method', 'Gross Margin ($)', 'Status'];
    const rows = sales.map(s => [
      `"${s.receiptNumber}"`,
      `"${s.timestamp}"`,
      `"${s.registerId}"`,
      `"${s.cashierName}"`,
      `"${s.customerType}"`,
      s.items.length,
      s.subtotal.toFixed(2),
      s.tax.toFixed(2),
      s.total.toFixed(2),
      `"${s.paymentMethod}"`,
      s.totalMargin.toFixed(2),
      `"${s.status}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omnistock_sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setSales(INITIAL_SALES_TRANSACTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDeadStockAlerts(INITIAL_DEAD_STOCK_ALERTS);
    setDemandForecasts(INITIAL_DEMAND_FORECASTS);
    setTelemetry(INITIAL_SHIFT_TELEMETRY);
    setAiMessages(INITIAL_AI_MESSAGES);
    localStorage.clear();
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        suppliers,
        purchaseOrders,
        sales,
        auditLogs,
        deadStockAlerts,
        demandForecasts,
        telemetry,
        activeFacility,
        setActiveFacility,
        analyticsPeriod,
        setAnalyticsPeriod,
        selectedDepartment,
        setSelectedDepartment,
        addProduct,
        updateProduct,
        adjustStock,
        overridePrice,
        batchUpdatePrices,
        deleteProduct,
        recordSale,
        refundSale,
        createPurchaseOrder,
        receivePurchaseOrder,
        autoDraftLowStockPOs,
        applyDeadStockAction,
        aiMessages,
        isAiTyping,
        sendAiMessage,
        runFloorAudit,
        generateShiftReport,
        exportInventoryCSV,
        exportSalesCSV,
        resetToSampleData
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}

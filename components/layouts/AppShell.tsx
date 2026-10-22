'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { InventoryProvider } from '@/lib/inventory-context';
import RecordSaleModal from '../modals/RecordSaleModal';
import IntakeStockModal from '../modals/IntakeStockModal';
import QuickSearchCommandModal from '../modals/QuickSearchCommandModal';
import StockOverrideDrawer from '../modals/StockOverrideDrawer';
import AddProductModal from '../modals/AddProductModal';
import BatchPriceModal from '../modals/BatchPriceModal';
import { RouteLoader } from '../ui/route-loader';
import { Product } from '@/lib/types';

export default function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: { name: string; email: string; role: string } | null;
}) {
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [isIntakeStockOpen, setIsIntakeStockOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [selectedProductForDrawer, setSelectedProductForDrawer] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isBatchPriceOpen, setIsBatchPriceOpen] = useState(false);

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex antialiased">
        {/* Persistent Left Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Top Sticky Operations Header */}
          <Header
            user={user}
            onOpenRecordSale={() => setIsRecordSaleOpen(true)}
            onOpenIntakeStock={() => setIsIntakeStockOpen(true)}
            onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
          />

          {/* Page Viewport */}
          <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            {children}
          </main>
        </div>

        {/* Global Modals & Drawers */}
        <RecordSaleModal
          isOpen={isRecordSaleOpen}
          onClose={() => setIsRecordSaleOpen(false)}
        />

        <IntakeStockModal
          isOpen={isIntakeStockOpen}
          onClose={() => setIsIntakeStockOpen(false)}
        />

        <QuickSearchCommandModal
          isOpen={isQuickSearchOpen}
          onClose={() => setIsQuickSearchOpen(false)}
          onSelectProduct={prod => {
            setSelectedProductForDrawer(prod);
          }}
        />

        <StockOverrideDrawer
          product={selectedProductForDrawer}
          isOpen={!!selectedProductForDrawer}
          onClose={() => setSelectedProductForDrawer(null)}
        />

        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
        />

        <BatchPriceModal
          isOpen={isBatchPriceOpen}
          onClose={() => setIsBatchPriceOpen(false)}
        />

        {/* Route transition loader */}
        <RouteLoader />
      </div>
    </InventoryProvider>
  );
}

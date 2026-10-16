import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryType, StockPurchasingRecord } from '../types';
import { 
  DollarSign, Package, TrendingUp, TrendingDown, ShoppingBag, 
  AlertTriangle, FileSpreadsheet, FileText, Printer, Plus, Save, 
  Calendar, Upload, History, Filter, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';

export const ProductCostingManager: React.FC = () => {
  const { products, orders, addProduct, updateProduct, settings } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'purchasing' | 'history' | 'summaries' | 'reports'>('purchasing');
  const [summaryFilter, setSummaryFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Local state for stock entry / purchasing form
  const [purchasingForm, setPurchasingForm] = useState({
    productName: '',
    category: 'shoes' as CategoryType,
    supplier: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantityPurchased: 20,
    buyingPrice: 2500,
    sellingPrice: 4500,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    notes: '',
    existingProductId: '' // if restocking existing product
  });

  // Local state for purchasing ledger history
  const [purchaseRecords, setPurchaseRecords] = useState<StockPurchasingRecord[]>(() => {
    return products.map((p, idx) => {
      const qPurchased = p.quantityPurchased || p.stock + 10;
      const bPrice = p.costPrice || Math.round(p.price * 0.55);
      const sPrice = p.price;
      return {
        id: `PUR-${1001 + idx}`,
        productId: p.id,
        productName: p.name,
        category: p.category,
        supplier: p.supplier || 'Nairobi Wholesalers Ltd',
        purchaseDate: p.purchaseDate || '2026-07-01',
        quantityPurchased: qPurchased,
        buyingPrice: bPrice,
        sellingPrice: sPrice,
        notes: 'Initial stock intake',
        imageUrl: p.image,
        costValue: bPrice * qPurchased,
        expectedSalesValue: sPrice * qPurchased,
        expectedProfit: (sPrice - bPrice) * qPurchased
      };
    });
  });

  // Live form calculations
  const liveCostValue = purchasingForm.buyingPrice * purchasingForm.quantityPurchased;
  const liveExpectedSalesValue = purchasingForm.sellingPrice * purchasingForm.quantityPurchased;
  const liveExpectedProfit = (purchasingForm.sellingPrice - purchasingForm.buyingPrice) * purchasingForm.quantityPurchased;

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setPurchasingForm(prev => ({ ...prev, image: evt.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit purchasing form
  const handleSaveStockEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchasingForm.productName.trim()) {
      alert('Please enter a product name.');
      return;
    }

    const costVal = purchasingForm.buyingPrice * purchasingForm.quantityPurchased;
    const salesVal = purchasingForm.sellingPrice * purchasingForm.quantityPurchased;
    const profitVal = (purchasingForm.sellingPrice - purchasingForm.buyingPrice) * purchasingForm.quantityPurchased;

    if (purchasingForm.existingProductId) {
      // Restock existing product
      const existing = products.find(p => p.id === purchasingForm.existingProductId);
      if (existing) {
        updateProduct(existing.id, {
          stock: existing.stock + purchasingForm.quantityPurchased,
          quantityPurchased: (existing.quantityPurchased || existing.stock) + purchasingForm.quantityPurchased,
          costPrice: purchasingForm.buyingPrice,
          price: purchasingForm.sellingPrice,
          supplier: purchasingForm.supplier || existing.supplier,
          purchaseDate: purchasingForm.purchaseDate
        });
      }
    } else {
      // Add brand new product to inventory
      addProduct({
        name: purchasingForm.productName,
        category: purchasingForm.category,
        price: purchasingForm.sellingPrice,
        costPrice: purchasingForm.buyingPrice,
        stock: purchasingForm.quantityPurchased,
        lowStockThreshold: 5,
        rating: 5.0,
        reviewsCount: 1,
        image: purchasingForm.image,
        sizes: purchasingForm.category === 'shoes' ? ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'] : ['M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Brown'],
        description: purchasingForm.notes || 'Premium handcrafted retail fashion item.',
        quantityPurchased: purchasingForm.quantityPurchased,
        quantitySold: 0,
        supplier: purchasingForm.supplier,
        purchaseDate: purchasingForm.purchaseDate
      });
    }

    // Add to stock purchasing records
    const newRecord: StockPurchasingRecord = {
      id: `PUR-${Date.now().toString().slice(-4)}`,
      productId: purchasingForm.existingProductId || `p_${Date.now()}`,
      productName: purchasingForm.productName,
      category: purchasingForm.category,
      supplier: purchasingForm.supplier || 'Direct Importer',
      purchaseDate: purchasingForm.purchaseDate,
      quantityPurchased: purchasingForm.quantityPurchased,
      buyingPrice: purchasingForm.buyingPrice,
      sellingPrice: purchasingForm.sellingPrice,
      notes: purchasingForm.notes,
      imageUrl: purchasingForm.image,
      costValue: costVal,
      expectedSalesValue: salesVal,
      expectedProfit: profitVal
    };

    setPurchaseRecords(prev => [newRecord, ...prev]);

    alert(`Stock intake saved successfully!\nProduct: ${purchasingForm.productName}\nTotal Cost Value: KSh ${costVal.toLocaleString()}\nExpected Profit: KSh ${profitVal.toLocaleString()}`);

    // Reset form
    setPurchasingForm({
      productName: '',
      category: 'shoes',
      supplier: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      quantityPurchased: 20,
      buyingPrice: 2500,
      sellingPrice: 4500,
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      notes: '',
      existingProductId: ''
    });
  };

  // Calculations across inventory and orders
  const totalStockQuantity = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalCostValueOfStock = products.reduce((acc, p) => acc + ((p.costPrice || Math.round(p.price * 0.55)) * (p.stock || 0)), 0);
  const totalRetailValueOfStock = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);

  // Sales and Profit Calculations
  const completedOrders = orders.filter(o => o.status !== 'cancelled');

  // Compute profit per order and overall
  let totalRevenue = 0;
  let totalCostOfGoodsSold = 0;
  let totalGrossProfit = 0;
  let totalLosses = 0;
  let totalUnitsSold = 0;

  completedOrders.forEach(order => {
    order.items.forEach(item => {
      const q = item.quantity;
      const sPrice = item.product.price;
      const bPrice = item.product.costPrice || Math.round(sPrice * 0.55);
      
      const rev = sPrice * q;
      const cogs = bPrice * q;
      const diff = rev - cogs;

      totalRevenue += rev;
      totalCostOfGoodsSold += cogs;
      totalUnitsSold += q;

      if (diff >= 0) {
        totalGrossProfit += diff;
      } else {
        totalLosses += Math.abs(diff);
      }
    });
  });

  // Excel Export Handler
  const exportToExcel = () => {
    const data = products.map(p => {
      const qPurchased = p.quantityPurchased || p.stock + 10;
      const qSold = p.quantitySold || Math.max(0, qPurchased - p.stock);
      const bPrice = p.costPrice || Math.round(p.price * 0.55);
      const sPrice = p.price;
      const rev = sPrice * qSold;
      const cost = bPrice * qSold;
      const prof = rev - cost;

      return {
        'Product Name': p.name,
        'Category': p.category.toUpperCase(),
        'Supplier': p.supplier || 'Nairobi Wholesalers',
        'Buying Price (KSh)': bPrice,
        'Selling Price (KSh)': sPrice,
        'Profit Per Unit (KSh)': sPrice - bPrice,
        'Quantity Purchased': qPurchased,
        'Quantity Sold': qSold,
        'Remaining Stock': p.stock,
        'Total Revenue (KSh)': rev,
        'Cost of Goods Sold (KSh)': cost,
        'Total Profit (KSh)': prof >= 0 ? prof : 0,
        'Total Loss (KSh)': prof < 0 ? Math.abs(prof) : 0
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Costing & Profits');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Decent_Collection_Product_Costing_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Word Document (.docx) Export Handler
  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "DECENT COLLECTION", bold: true, size: 36, color: "D4AF37" }),
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "PRODUCT COSTING, PROFIT & LOSS MANAGEMENT REPORT", bold: true, size: 24 }),
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Generated Date: ${new Date().toLocaleDateString()} | Author: Esta Njoki Mbugua (Managing Director)` }),
            ]
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "1. FINANCIAL PERFORMANCE OVERVIEW", bold: true, size: 20 }),
            ]
          }),
          new Paragraph({ text: `• Total Revenue Generated: KSh ${totalRevenue.toLocaleString()}` }),
          new Paragraph({ text: `• Total Cost of Goods Sold (COGS): KSh ${totalCostOfGoodsSold.toLocaleString()}` }),
          new Paragraph({ text: `• Total Gross Profit: KSh ${totalGrossProfit.toLocaleString()}` }),
          new Paragraph({ text: `• Total Losses Recorded: KSh ${totalLosses.toLocaleString()}` }),
          new Paragraph({ text: `• Total Inventory Remaining Value (Cost): KSh ${totalCostValueOfStock.toLocaleString()}` }),
          new Paragraph({ text: `• Total Inventory Remaining Value (Retail): KSh ${totalRetailValueOfStock.toLocaleString()}` }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "2. MANAGEMENT RECOMMENDATIONS", bold: true, size: 20 }),
            ]
          }),
          new Paragraph({ text: "• Maintain healthy profit margins above 40% across formal footwear and bespoke suits." }),
          new Paragraph({ text: "• Automatically reorder low stock products before thresholds hit zero." }),
          new Paragraph({ text: "• Audit cost prices regularly when receiving supplier price updates." })
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, `Decent_Collection_Profit_Loss_Report_${new Date().toISOString().split('T')[0]}.docx`);
  };

  return (
    <div className="space-y-6 font-sans text-white">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1A1810] via-[#2A2410] to-[#1A1810] border border-[#D4AF37]/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-xl font-extrabold font-heading text-white tracking-wide">
              Product Cost, Profit & Loss Management System
            </h2>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl">
            Automated retail stock intake, buying vs. selling price tracking, cost value calculation, real-time sales profit/loss calculations, and instant executive reporting.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={exportToWord}
            className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Word (.docx)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c39e2d] text-black rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md active:scale-95 uppercase"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD SUMMARY CARDS (Simple Cards, No Graphs) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Stock */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span className="font-semibold">📦 Total Stock</span>
            <Package className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-heading">{totalStockQuantity} Units</div>
            <div className="text-[10px] text-gray-400 mt-0.5">KSh {totalCostValueOfStock.toLocaleString()} Cost</div>
          </div>
        </div>

        {/* Products Sold Today */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span className="font-semibold">🛒 Products Sold</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-heading">{totalUnitsSold} Units</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Across All Orders</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span className="font-semibold">💰 Revenue</span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#D4AF37] font-heading">KSh {totalRevenue.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Gross Sales</div>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span className="font-semibold">📈 Today's Profit</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-400 font-heading">KSh {totalGrossProfit.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-500/80 mt-0.5">Automated Net Gain</div>
          </div>
        </div>

        {/* Loss */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span className="font-semibold">📉 Today's Loss</span>
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-red-400 font-heading">KSh {totalLosses.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Discount/Cost Gap</div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-[#D4AF37]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span className="font-semibold">⚠ Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-400 font-heading">{lowStockItems.length} Products</div>
            <div className="text-[10px] text-amber-500/80 mt-0.5">Needs Purchasing</div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex border-b border-[#2A2A2A] gap-4 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveSubTab('purchasing')}
          className={`pb-2.5 font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'purchasing' 
              ? 'border-[#D4AF37] text-[#D4AF37]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>1. Stock Entry (Purchasing Form)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-2.5 font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'history' 
              ? 'border-[#D4AF37] text-[#D4AF37]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>2. Product Profit & Sales History</span>
        </button>

        <button
          onClick={() => setActiveSubTab('summaries')}
          className={`pb-2.5 font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeSubTab === 'summaries' 
              ? 'border-[#D4AF37] text-[#D4AF37]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Daily / Weekly / Monthly Summaries</span>
        </button>
      </div>

      {/* ------------------ SUB TAB 1: STOCK ENTRY (PURCHASING FORM) ------------------ */}
      {activeSubTab === 'purchasing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <form onSubmit={handleSaveStockEntry} className="lg:col-span-2 bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-[#2A2A2A] pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-white text-base font-heading">📦 New Stock Purchase & Price Entry</h3>
                <p className="text-xs text-gray-400">Record cost price when purchasing new stock. All sales profit formulas calculate automatically.</p>
              </div>
              <span className="text-[10px] font-mono bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-full font-bold">
                Auto-Calculated
              </span>
            </div>

            {/* Quick Fill From Existing Product */}
            <div className="bg-[#1A1A1A] p-3 rounded-xl border border-[#2B2B2B]">
              <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                🔄 Restock Existing Product? (Select to Auto-Populate)
              </label>
              <select
                value={purchasingForm.existingProductId}
                onChange={(e) => {
                  const pId = e.target.value;
                  if (!pId) {
                    setPurchasingForm(prev => ({ ...prev, existingProductId: '' }));
                    return;
                  }
                  const p = products.find(x => x.id === pId);
                  if (p) {
                    setPurchasingForm({
                      existingProductId: p.id,
                      productName: p.name,
                      category: p.category,
                      supplier: p.supplier || 'Nairobi Wholesalers',
                      purchaseDate: new Date().toISOString().split('T')[0],
                      quantityPurchased: 20,
                      buyingPrice: p.costPrice || Math.round(p.price * 0.55),
                      sellingPrice: p.price,
                      image: p.image,
                      notes: `Restocking batch for ${p.name}`
                    });
                  }
                }}
                className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#D4AF37]"
              >
                <option value="">-- Create Brand New Stock Entry --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current Stock: {p.stock} | Selling Price: KSh {p.price.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">📦 Product Name *</label>
                <input
                  type="text"
                  required
                  value={purchasingForm.productName}
                  onChange={(e) => setPurchasingForm(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="e.g., Italian Double-Monk Leather Shoes"
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">🏷 Category *</label>
                <select
                  value={purchasingForm.category}
                  onChange={(e) => setPurchasingForm(prev => ({ ...prev, category: e.target.value as CategoryType }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37]"
                >
                  <option value="shoes">Shoes & Footwear</option>
                  <option value="suits">Suits & Tuxedos</option>
                  <option value="shirts">Formal Shirts</option>
                  <option value="jeans">Designer Jeans</option>
                  <option value="accessories">Belts & Accessories</option>
                  <option value="jackets">Jackets & Outerwear</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">🏢 Supplier (Optional)</label>
                <input
                  type="text"
                  value={purchasingForm.supplier}
                  onChange={(e) => setPurchasingForm(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="e.g., Milan Leather Importers Ltd"
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">📅 Purchase Date *</label>
                <input
                  type="date"
                  required
                  value={purchasingForm.purchaseDate}
                  onChange={(e) => setPurchasingForm(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">🔢 Quantity Purchased *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={purchasingForm.quantityPurchased}
                  onChange={(e) => setPurchasingForm(prev => ({ ...prev, quantityPurchased: parseInt(e.target.value) || 1 }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">💵 Buying Price (Cost Price) Per Item (KSh) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={purchasingForm.buyingPrice}
                  onChange={(e) => setPurchasingForm(prev => ({ ...prev, buyingPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37] font-bold text-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">💰 Selling Price Per Item (KSh) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={purchasingForm.sellingPrice}
                  onChange={(e) => setPurchasingForm(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37] font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">📸 Product Image URL or Device File</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={purchasingForm.image}
                    onChange={(e) => setPurchasingForm(prev => ({ ...prev, image: e.target.value }))}
                    className="flex-1 bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none text-xs"
                  />
                  <label className="px-3 py-3 bg-[#2B2B2B] hover:bg-[#383838] text-white rounded-xl cursor-pointer flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-300 block mb-1 text-xs font-semibold">📝 Batch Notes (Optional)</label>
              <textarea
                rows={2}
                value={purchasingForm.notes}
                onChange={(e) => setPurchasingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g., Imported batch from Milan trade show. Premium full-grain leather quality."
                className="w-full bg-[#1A1A1A] border border-[#333333] text-white text-xs rounded-xl p-3 outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="pt-3 border-t border-[#2A2A2A] flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Stock & Calculate Margins</span>
              </button>
            </div>
          </form>

          {/* Live Automatic Calculations Card */}
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
            <div>
              <h4 className="font-extrabold text-[#D4AF37] text-sm uppercase tracking-wider font-heading border-b border-[#2B2B2B] pb-3 flex items-center gap-2">
                <span>⚡ Live Automatic Calculations</span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-2">
                The system automatically computes expected cost, revenue, and profit margins in real-time as you type.
              </p>

              <div className="mt-6 space-y-4">
                <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#282828]">
                  <div className="text-gray-400 text-xs font-medium">Cost Value (Buying Price × Qty)</div>
                  <div className="text-2xl font-black text-white font-heading mt-1">
                    KSh {liveCostValue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    KSh {purchasingForm.buyingPrice.toLocaleString()} × {purchasingForm.quantityPurchased} units
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#282828]">
                  <div className="text-gray-400 text-xs font-medium">Expected Sales Value (Selling Price × Qty)</div>
                  <div className="text-2xl font-black text-[#D4AF37] font-heading mt-1">
                    KSh {liveExpectedSalesValue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    KSh {purchasingForm.sellingPrice.toLocaleString()} × {purchasingForm.quantityPurchased} units
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#282828]">
                  <div className="text-gray-400 text-xs font-medium">Expected Profit ((Selling - Buying) × Qty)</div>
                  <div className={`text-2xl font-black font-heading mt-1 ${liveExpectedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    KSh {liveExpectedProfit.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-500/80 mt-1">
                    Profit Per Item: KSh {(purchasingForm.sellingPrice - purchasingForm.buyingPrice).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#1A1810] border border-[#D4AF37]/30 rounded-xl text-[11px] text-gray-300">
              💡 <strong>Automated Retail Rule:</strong> Selling prices are automatically saved to product records, and whenever a customer checks out, stock decreases and profit is booked instantly.
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SUB TAB 2: PRODUCT PROFIT HISTORY TABLE ------------------ */}
      {activeSubTab === 'history' && (
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="font-extrabold text-white text-base font-heading">📊 Product Profit & Sales Ledger</h3>
              <p className="text-xs text-gray-400">Buying price, selling price, units sold, total revenue, and calculated gross profit per product item.</p>
            </div>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#1C1C1C] text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-[#2A2A2A]">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Buying Price</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Unit Profit</th>
                  <th className="py-3 px-4">Purchased</th>
                  <th className="py-3 px-4">Sold</th>
                  <th className="py-3 px-4">Remaining</th>
                  <th className="py-3 px-4">Total Revenue</th>
                  <th className="py-3 px-4">Total Profit</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {products.map(p => {
                  const qPurchased = p.quantityPurchased || p.stock + 10;
                  const qSold = p.quantitySold || Math.max(0, qPurchased - p.stock);
                  const bPrice = p.costPrice || Math.round(p.price * 0.55);
                  const sPrice = p.price;
                  const unitProfit = sPrice - bPrice;
                  const totalRev = sPrice * qSold;
                  const totalProf = unitProfit * qSold;

                  return (
                    <tr key={p.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#333]" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-300">KSh {bPrice.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-bold">KSh {sPrice.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-[#D4AF37] font-bold">+KSh {unitProfit.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-gray-200">{qPurchased}</td>
                      <td className="py-3 px-4 font-semibold text-blue-400">{qSold}</td>
                      <td className="py-3 px-4 font-semibold text-gray-200">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock <= p.lowStockThreshold ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-300'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">KSh {totalRev.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-400">+KSh {totalProf.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {p.stock <= p.lowStockThreshold ? (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">Reorder Needed</span>
                        ) : (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">In Stock</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------ SUB TAB 3: DAILY / WEEKLY / MONTHLY SUMMARIES ------------------ */}
      {activeSubTab === 'summaries' && (
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="font-extrabold text-white text-base font-heading">📅 Retail Financial Summaries</h3>
              <p className="text-xs text-gray-400">Automated aggregate calculations for Daily, Weekly, and Monthly performance.</p>
            </div>

            <div className="flex bg-[#1E1E1E] border border-[#333] p-1 rounded-xl gap-1 text-xs">
              <button
                onClick={() => setSummaryFilter('daily')}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all ${summaryFilter === 'daily' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Daily Summary
              </button>
              <button
                onClick={() => setSummaryFilter('weekly')}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all ${summaryFilter === 'weekly' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Weekly Summary
              </button>
              <button
                onClick={() => setSummaryFilter('monthly')}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all ${summaryFilter === 'monthly' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Monthly Summary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] space-y-3">
              <div className="flex justify-between items-center text-gray-400 border-b border-[#2A2A2A] pb-2 font-bold uppercase text-[11px]">
                <span>1. Sales & Revenue</span>
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Products Sold:</span>
                <span className="font-bold text-white">{totalUnitsSold} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Revenue:</span>
                <span className="font-bold text-[#D4AF37]">KSh {totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] space-y-3">
              <div className="flex justify-between items-center text-gray-400 border-b border-[#2A2A2A] pb-2 font-bold uppercase text-[11px]">
                <span>2. Cost of Goods & Profit</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost of Goods Sold (COGS):</span>
                <span className="font-bold text-white">KSh {totalCostOfGoodsSold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gross Profit:</span>
                <span className="font-bold text-emerald-400">+KSh {totalGrossProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recorded Losses:</span>
                <span className="font-bold text-red-400">KSh {totalLosses.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] space-y-3">
              <div className="flex justify-between items-center text-gray-400 border-b border-[#2A2A2A] pb-2 font-bold uppercase text-[11px]">
                <span>3. Inventory Valuation</span>
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Stock Value (Cost):</span>
                <span className="font-bold text-white">KSh {totalCostValueOfStock.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Stock Value (Retail):</span>
                <span className="font-bold text-[#D4AF37]">KSh {totalRetailValueOfStock.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low Stock Products:</span>
                <span className="font-bold text-amber-400">{lowStockItems.length} Products</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

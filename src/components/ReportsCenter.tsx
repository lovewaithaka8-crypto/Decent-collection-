import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  FileText, Table as TableIcon, Download, Printer, Share2, Eye, Calendar, 
  CheckCircle, DollarSign, Package, TrendingUp, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { ReportDateRange } from '../types';
import { 
  filterDataByDateRange, 
  generateExcelSalesReport, 
  generateWordBusinessReport 
} from '../services/reportGenerator';
import { BrandedPrintModal, DocumentType } from './BrandedPrintModal';

export const ReportsCenter: React.FC = () => {
  const { orders, products, settings } = useStore();

  const [dateRange, setDateRange] = useState<ReportDateRange>('this_month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [activeDocType, setActiveDocType] = useState<DocumentType>('sales_report');
  const [previewType, setPreviewType] = useState<'excel' | 'word'>('excel');

  const filteredData = filterDataByDateRange(
    orders, 
    products, 
    dateRange, 
    customStartDate, 
    customEndDate
  );

  const currency = settings.currency || 'KSh';

  // Calculate profit totals
  const dailyData = filterDataByDateRange(orders, products, 'today');
  const weeklyData = filterDataByDateRange(orders, products, 'this_week');
  const monthlyData = filterDataByDateRange(orders, products, 'this_month');
  const annualData = filterDataByDateRange(orders, products, 'this_month'); // or all time

  const handleExportExcel = () => {
    generateExcelSalesReport(
      settings, 
      filteredData, 
      `Sales & Financial Audit Report (${filteredData.dateLabel})`
    );
  };

  const handleExportWord = async () => {
    await generateWordBusinessReport(
      settings, 
      filteredData, 
      `Executive Performance & Business Summary (${filteredData.dateLabel})`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${settings.shopName} - Business Financial Report`,
        text: `Financial Audit Summary for ${settings.shopName} (${filteredData.dateLabel}): Sales: ${currency} ${filteredData.totalSales.toLocaleString()}, Profit: ${currency} ${filteredData.totalProfit.toLocaleString()}`
      }).catch(() => {});
    } else {
      alert(`Report Summary Copied to Clipboard!\n\nSales: ${currency} ${filteredData.totalSales.toLocaleString()}\nProfit: ${currency} ${filteredData.totalProfit.toLocaleString()}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
            <span>Professional Report & Document Generator</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Generate print-ready Microsoft Excel (.xlsx) spreadsheets & Microsoft Word (.docx) executive audit documents for bank applications, accounting, and store records.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-[#111111] p-2 rounded-xl border border-[#2B2B2B]">
          <Calendar className="w-4 h-4 text-[#D4AF37] ml-1" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as ReportDateRange)}
            className="bg-[#1A1A1A] text-white text-xs rounded p-2 outline-none font-semibold border border-[#333333] focus:border-[#D4AF37]"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Date Range</option>
          </select>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-[#1A1A1A] text-white p-1.5 rounded border border-[#333333]"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-[#1A1A1A] text-white p-1.5 rounded border border-[#333333]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Real-time Calculated Profit Metrics (No charts!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
            <span>Today's Profit</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-heading">
            {currency} {dailyData.totalProfit.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500">Sales: {currency} {dailyData.totalSales.toLocaleString()}</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
            <span>This Week's Profit</span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-xl font-bold text-[#D4AF37] font-heading">
            {currency} {weeklyData.totalProfit.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500">Sales: {currency} {weeklyData.totalSales.toLocaleString()}</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
            <span>This Month's Profit</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400 font-heading">
            {currency} {monthlyData.totalProfit.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500">Sales: {currency} {monthlyData.totalSales.toLocaleString()}</div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2B2B2B] p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
            <span>Total Catalog Profit Potential</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 font-heading">
            {currency} {products.reduce((acc, p) => acc + ((p.discountPrice || p.price) - p.costPrice) * p.stock, 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500">Total Stock Value: {currency} {products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Main Document Generation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Microsoft Excel Spreadsheet Generator */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] hover:border-[#D4AF37]/50 p-6 rounded-xl space-y-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl border border-emerald-500/30">
              📊
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">1. Microsoft Excel Spreadsheet (.xlsx)</h3>
              <p className="text-xs text-gray-400">Numerical data, cost/selling price, itemized profit calculation, and auto-totals.</p>
            </div>
          </div>

          <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-5">
            <li>Product Buying Price vs Selling Price</li>
            <li>Profit Per Item & Total Profit Calculation</li>
            <li>Orders, Receipts & M-Pesa Code Verification</li>
            <li>Formatted for accounting, taxes & bank submission</li>
          </ul>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => { setPreviewType('excel'); setShowPreviewModal(true); }}
              className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-gray-200 font-bold text-xs rounded-lg flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <span>Preview Spreadsheet</span>
            </button>
          </div>
        </div>

        {/* Card 2: Microsoft Word Executive Report Generator */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] hover:border-[#D4AF37]/50 p-6 rounded-xl space-y-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-xl border border-blue-500/30">
              📄
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-heading">2. Microsoft Word Executive Report (.docx)</h3>
              <p className="text-xs text-gray-400">Written summaries, findings, inventory status, and manager recommendation notes.</p>
            </div>
          </div>

          <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-5">
            <li>Executive Summary & Written Findings</li>
            <li>Key Business Metrics & Inventory Audit</li>
            <li>Management Strategic Recommendations</li>
            <li>Print-ready signature & sign-off block</li>
          </ul>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleExportWord}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Word (.docx)</span>
            </button>
            <button
              onClick={() => { setPreviewType('word'); setShowPreviewModal(true); }}
              className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-gray-200 font-bold text-xs rounded-lg flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <span>Preview Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Profitability & Cost Breakdown Table (Clean Document View) */}
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-base font-heading flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-[#D4AF37]" />
              <span>Live Itemized Profit & Margin Calculation</span>
            </h3>
            <p className="text-xs text-gray-400">
              Buying Price − Selling Price = Profit Per Item × Quantity Sold = Total Profit
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Print Document</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#2B2B2B]">
            <thead className="bg-[#111111] text-gray-300 uppercase tracking-wider border-b border-[#2B2B2B]">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Buying Price</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">Profit / Item</th>
                <th className="p-3">Units Sold</th>
                <th className="p-3">Stock Left</th>
                <th className="p-3 text-right">Total Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {products.map((p) => {
                const buying = p.costPrice || (p.price * 0.55);
                const selling = p.discountPrice || p.price;
                const profitPerItem = selling - buying;

                let unitsSold = 0;
                filteredData.filteredOrders.forEach(o => {
                  o.items.forEach(i => {
                    if (i.product.id === p.id) unitsSold += i.quantity;
                  });
                });

                const totalItemProfit = profitPerItem * unitsSold;

                return (
                  <tr key={p.id} className="hover:bg-[#222222]">
                    <td className="p-3 font-bold text-white">{p.name}</td>
                    <td className="p-3 uppercase text-[10px] text-[#D4AF37] font-semibold">{p.category}</td>
                    <td className="p-3 text-gray-300 font-mono">{currency} {buying.toLocaleString()}</td>
                    <td className="p-3 text-white font-mono">{currency} {selling.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-400 font-mono">
                      +{currency} {profitPerItem.toLocaleString()}
                    </td>
                    <td className="p-3 text-white font-mono font-bold">{unitsSold}</td>
                    <td className="p-3 text-gray-400 font-mono">{p.stock}</td>
                    <td className="p-3 text-right font-bold text-emerald-400 font-mono font-heading">
                      {currency} {totalItemProfit.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#111111] font-bold text-white border-t border-[#333333]">
              <tr>
                <td colSpan={2} className="p-3">TOTALS ({filteredData.dateLabel})</td>
                <td className="p-3 font-mono text-gray-400">{currency} {filteredData.totalCost.toLocaleString()}</td>
                <td className="p-3 font-mono text-[#D4AF37]">{currency} {filteredData.totalSales.toLocaleString()}</td>
                <td colSpan={3} className="p-3 text-right">NET OPERATING PROFIT:</td>
                <td className="p-3 text-right text-emerald-400 font-mono text-sm font-heading">
                  {currency} {filteredData.totalProfit.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Document Preview & Branded Print Modal */}
      {showPreviewModal && (
        <BrandedPrintModal
          documentType={activeDocType}
          documentTitle={`Official ${previewType === 'excel' ? 'Spreadsheet' : 'Executive Audit'} Report (${filteredData.dateLabel})`}
          documentNumber={`DOC-${Date.now().toString().slice(-6)}`}
          summaryData={[
            { label: 'Gross Revenue', value: `${currency} ${filteredData.totalSales.toLocaleString()}`, isBold: true },
            { label: 'Total Cost (COGS)', value: `${currency} ${filteredData.totalCost.toLocaleString()}` },
            { label: 'Net Profit', value: `${currency} ${filteredData.totalProfit.toLocaleString()}`, isAccent: true },
            { label: 'Orders Processed', value: filteredData.filteredOrders.length.toString() }
          ]}
          items={filteredData.filteredOrders.flatMap(o => 
            o.items.map(item => ({
              name: `${item.product.name} (${o.id})`,
              quantity: item.quantity,
              unitPrice: item.product.discountPrice || item.product.price,
              total: (item.product.discountPrice || item.product.price) * item.quantity
            }))
          ).slice(0, 15)}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};



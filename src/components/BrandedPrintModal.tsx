import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Printer, Download, FileText, FileSpreadsheet, Mail, Eye, X, 
  CheckCircle, ShieldCheck, Building2, MapPin, Phone, Globe, Calendar, User
} from 'lucide-react';
import { 
  generateExcelSalesReport, 
  generateWordBusinessReport,
  generateExcelVipReport,
  generateWordVipReport
} from '../services/reportGenerator';

export type DocumentType = 
  | 'invoice' 
  | 'receipt' 
  | 'quotation' 
  | 'sales_report' 
  | 'inventory_report' 
  | 'profit_report' 
  | 'customer_report' 
  | 'payment_report' 
  | 'purchase_record';

interface BrandedPrintModalProps {
  documentType: DocumentType;
  documentTitle: string;
  documentNumber?: string;
  customerData?: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items?: Array<{
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  summaryData?: Array<{
    label: string;
    value: string;
    isBold?: boolean;
    isAccent?: boolean;
  }>;
  customRows?: Array<Record<string, any>>;
  onClose: () => void;
}

export const BrandedPrintModal: React.FC<BrandedPrintModalProps> = ({
  documentType,
  documentTitle,
  documentNumber = `DC-${Math.floor(100000 + Math.random() * 900000)}`,
  customerData,
  items = [],
  summaryData = [],
  customRows = [],
  onClose
}) => {
  const { settings, orders, products, customers, branches } = useStore();
  const printRef = useRef<HTMLDivElement>(null);

  const currency = settings.currency || 'KSh';
  const currentDate = new Date().toLocaleDateString('en-KE', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  const currentTime = new Date().toLocaleTimeString('en-KE', { 
    hour: '2-digit', minute: '2-digit' 
  });

  const activeBranch = branches.find(b => b.id === settings.activeBranchId)?.name || 'Nairobi Flagship Store';

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (documentType === 'customer_report') {
      const vips = customers.filter(c => c.isVip);
      generateExcelVipReport(settings, vips);
    } else {
      const filtered = {
        orders,
        products,
        filteredOrders: orders,
        filteredProducts: products,
        totalSales: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        totalCost: orders.reduce((sum, o) => sum + (o.totalAmount * 0.6), 0),
        totalProfit: orders.reduce((sum, o) => sum + (o.totalAmount * 0.4), 0),
        itemsSold: orders.reduce((sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0), 0),
        dateLabel: 'Official Company Print Audit'
      };
      generateExcelSalesReport(settings, filtered, documentTitle);
    }
  };

  const handleExportWord = async () => {
    if (documentType === 'customer_report') {
      const vips = customers.filter(c => c.isVip);
      await generateWordVipReport(settings, vips);
    } else {
      const filtered = {
        orders,
        products,
        filteredOrders: orders,
        filteredProducts: products,
        totalSales: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        totalCost: orders.reduce((sum, o) => sum + (o.totalAmount * 0.6), 0),
        totalProfit: orders.reduce((sum, o) => sum + (o.totalAmount * 0.4), 0),
        itemsSold: orders.reduce((sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0), 0),
        dateLabel: 'Executive Audit Document'
      };
      await generateWordBusinessReport(settings, filtered, documentTitle);
    }
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-fadeIn">
      <div className="bg-[#121212] border border-[#2B2B2B] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* PREVIEW TOOLBAR & CONTROL BUTTONS */}
        <div className="no-print bg-[#1A1A1A] px-6 py-4 border-b border-[#2B2B2B] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-200 flex items-center justify-center text-black font-black shadow-md">
              <Eye className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-heading uppercase tracking-wide">
                  Print Preview & Document Export
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Official Company Format
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Ready for high-resolution A4 printing, PDF saving, and executive record keeping.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-200 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 hover:scale-102 transition-all"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>𖤓 Print Document</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-3 py-2.5 bg-[#222222] hover:bg-[#2C2C2C] text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
              title="Download Microsoft Excel Spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Excel (.xlsx)</span>
            </button>

            <button
              onClick={handleExportWord}
              className="px-3 py-2.5 bg-[#222222] hover:bg-[#2C2C2C] text-blue-400 font-bold text-xs rounded-xl border border-blue-500/30 flex items-center gap-1.5 transition-colors"
              title="Download Microsoft Word Document"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Word (.docx)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#2A2A2A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY (Standard Clean White A4 Background) */}
        <div className="p-6 md:p-10 bg-gray-900 overflow-x-auto">
          <div 
            ref={printRef}
            id="printable-document"
            className="printable-document bg-white text-gray-900 rounded-2xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto space-y-8 font-sans border border-gray-200 text-sm leading-relaxed"
            style={{ minHeight: '1000px', color: '#111827', backgroundColor: '#FFFFFF' }}
          >
            {/* BRANDED HEADER */}
            <div className="border-b-2 border-gray-900 pb-6 flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="space-y-2">
                {/* Logo & Business Name */}
                <div className="flex items-center gap-3">
                  {settings.logo ? (
                    <img 
                      src={settings.logo} 
                      alt={settings.shopName} 
                      className="w-12 h-12 object-contain rounded-lg border border-gray-200" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-black text-[#D4AF37] font-black rounded-xl flex items-center justify-center text-lg shadow-md border border-[#D4AF37]">
                      DC
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase font-heading">
                      {settings.shopName || 'DECENT COLLECTION'}
                    </h1>
                    <p className="text-xs font-semibold text-gray-600 tracking-wider">
                      {settings.tagline || 'Gentlemen\'s Luxury Footwear & Bespoke Wear'}
                    </p>
                  </div>
                </div>

                {/* Company Contact Details */}
                <div className="text-xs text-gray-600 space-y-0.5 pt-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" /> {settings.address || 'Kimathi Street, Nairobi CBD'}
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-gray-500" /> Tel: {settings.phone || '+254 700 000 000'} | Email: {settings.email || 'info@decentcollection.co.ke'}
                  </p>
                  <p className="flex items-center gap-1.5 font-medium text-gray-500">
                    <Globe className="w-3.5 h-3.5 text-gray-500" /> Web: www.decentcollection.co.ke | M-Pesa Till: {settings.mpesaTill || '789012'}
                  </p>
                </div>
              </div>

              {/* Document Meta Box */}
              <div className="text-right space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-200 min-w-[220px]">
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block">
                  OFFICIAL BUSINESS RECORD
                </span>
                <h2 className="text-lg font-black text-gray-900 font-heading uppercase">
                  {documentTitle}
                </h2>
                <div className="text-xs text-gray-600 font-mono space-y-0.5 pt-1">
                  <p><strong className="text-gray-900">Doc No:</strong> {documentNumber}</p>
                  <p><strong className="text-gray-900">Date:</strong> {currentDate}</p>
                  <p><strong className="text-gray-900">Time:</strong> {currentTime}</p>
                  <p><strong className="text-gray-900">Branch:</strong> {activeBranch}</p>
                  <p><strong className="text-gray-900">Prepared By:</strong> {settings.adminName || 'Super Administrator'}</p>
                </div>
              </div>
            </div>

            {/* CUSTOMER / RECIPIENT INFORMATION (If Applicable) */}
            {customerData && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Billed / Issued To:
                  </span>
                  <p className="font-extrabold text-gray-900 text-sm">{customerData.name}</p>
                  <p className="text-gray-600 font-medium">{customerData.phone}</p>
                  {customerData.email && <p className="text-gray-600">{customerData.email}</p>}
                  {customerData.address && <p className="text-gray-600">{customerData.address}</p>}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Payment & Security Verification:
                  </span>
                  <p className="font-bold text-emerald-700 flex items-center justify-end gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Audit Transaction</span>
                  </p>
                  <p className="text-gray-500 text-[11px] mt-1">
                    System Authenticated • Decent ERP v2.5
                  </p>
                </div>
              </div>
            )}

            {/* SUMMARY STATS GRID (For Reports) */}
            {summaryData.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {summaryData.map((stat, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl border text-center ${
                      stat.isAccent 
                        ? 'bg-amber-50 border-amber-300 text-amber-900' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      {stat.label}
                    </span>
                    <p className={`text-base font-black font-mono mt-1 ${stat.isAccent ? 'text-amber-800' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ITEMIZED TABLE (For Receipts, Invoices, Quotations, Stock) */}
            {items.length > 0 && (
              <div>
                <table className="w-full text-left border-collapse border border-gray-200 text-xs">
                  <thead>
                    <tr className="bg-gray-900 text-white uppercase text-[10px] font-bold tracking-wider">
                      <th className="py-2.5 px-3 border border-gray-900">#</th>
                      <th className="py-2.5 px-3 border border-gray-900">Item Description</th>
                      <th className="py-2.5 px-3 border border-gray-900 text-center">Qty</th>
                      <th className="py-2.5 px-3 border border-gray-900 text-right">Unit Price ({currency})</th>
                      <th className="py-2.5 px-3 border border-gray-900 text-right">Total ({currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-3 font-mono font-bold text-gray-500 border border-gray-200">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-gray-900 border border-gray-200">
                          {item.name}
                          {item.sku && <span className="text-[10px] text-gray-500 font-mono block">SKU: {item.sku}</span>}
                        </td>
                        <td className="py-2 px-3 text-center font-extrabold text-gray-800 border border-gray-200">{item.quantity}</td>
                        <td className="py-2 px-3 text-right font-mono text-gray-700 border border-gray-200">{item.unitPrice.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-mono font-extrabold text-gray-900 border border-gray-200">{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Subtotals & Grand Totals Box */}
                <div className="mt-4 flex justify-end">
                  <div className="w-64 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>Subtotal:</span>
                      <span className="font-mono">{currency} {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 font-medium">
                      <span>VAT / Tax (0% Exempt):</span>
                      <span className="font-mono">{currency} 0</span>
                    </div>
                    <div className="pt-2 border-t-2 border-gray-900 flex justify-between text-gray-900 font-black text-sm">
                      <span>GRAND TOTAL:</span>
                      <span className="font-mono text-amber-700">{currency} {subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AUTHORIZATION SIGNATURE & STAMP BLOCK */}
            <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs">
              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Issued By:</p>
                <div className="h-12 border-b border-gray-400 mt-2 flex items-end pb-1 font-serif italic text-gray-800">
                  {settings.adminName || 'Esther Njoki Mbugua'}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Authorized Administrator Stamp & Sign</p>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Client / Recipient Acknowledgement:</p>
                <div className="h-12 border-b border-gray-400 mt-2"></div>
                <p className="text-[10px] text-gray-500 mt-1">Received in good order and condition</p>
              </div>
            </div>

            {/* BRANDED FOOTER */}
            <div className="pt-6 border-t-2 border-gray-900 text-center space-y-2 text-xs text-gray-600">
              <p className="font-black text-gray-900 font-heading tracking-wide uppercase">
                Thank you for choosing Decent Collection.
              </p>
              <p className="text-[10px] text-gray-500">
                Official Business Document generated on {currentDate} at {currentTime} • Page 1 of 1
              </p>
              <p className="text-[10px] text-gray-400 italic">
                © 2026 Decent Collection. All Rights Reserved. • Nairobi CBD, Kenya
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { validateKenyanPhone } from '../services/mpesaService';
import { MpesaTransaction, MpesaStkPushStatus, Order } from '../types';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { 
  Smartphone, RefreshCw, CheckCircle2, AlertCircle, XCircle, Clock, 
  Receipt, ShieldCheck, DollarSign, Send, Search, Filter, Lock, ArrowRight,
  Layers, ChevronRight, FileText, Download, Building
} from 'lucide-react';

export const MpesaTerminal: React.FC = () => {
  const { 
    orders, mpesaTransactions, triggerStkPush, updateMpesaTransactionStatus, 
    settings, updateOrderStatus, activeStkPush 
  } = useStore();

  // Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [amount, setAmount] = useState<number>(4500);
  const [itemsSummary, setItemsSummary] = useState<string>('Italian Leather Footwear');

  // Filter & Search State for Ledger
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<MpesaTransaction | null>(null);

  // Phone Validation Feedback
  const phoneVal = validateKenyanPhone(customerPhone);

  // Auto fill form when an order is selected
  const handleOrderSelect = (ordId: string) => {
    setSelectedOrderId(ordId);
    if (!ordId) return;

    const matched = orders.find(o => o.id === ordId);
    if (matched) {
      setCustomerName(matched.customerName);
      setCustomerPhone(matched.customerPhone);
      setAmount(matched.totalAmount);
      setItemsSummary(matched.items.map(i => `${i.product.name} (x${i.quantity})`).join(', '));
    }
  };

  // Submit STK Push Request
  const handleRequestPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerPhone) {
      alert('Please enter a customer phone number.');
      return;
    }

    if (!phoneVal.valid) {
      alert(phoneVal.error || 'Invalid Kenyan phone number.');
      return;
    }

    if (amount <= 0) {
      alert('Amount must be greater than zero.');
      return;
    }

    const orderRef = selectedOrderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    triggerStkPush({
      orderId: orderRef,
      customerName: customerName || 'Valued Customer',
      customerPhone: phoneVal.formatted,
      amount,
      itemsSummary
    });
  };

  // Resend Request
  const handleResendRequest = (tx: MpesaTransaction) => {
    triggerStkPush({
      orderId: tx.orderId,
      customerName: tx.customerName,
      customerPhone: tx.customerPhone,
      amount: tx.amount,
      itemsSummary: tx.itemsSummary
    });
  };

  // Cancel Active STK Push / Order
  const handleCancelActiveOrder = () => {
    if (activeStkPush) {
      updateMpesaTransactionStatus(activeStkPush.id, 'cancelled', undefined, 'Cancelled by Manager');
      if (activeStkPush.orderId) {
        updateOrderStatus(activeStkPush.orderId, 'cancelled');
      }
    }
  };

  // Status Pipeline Steps
  const getStepStatusIndex = (st: MpesaStkPushStatus) => {
    switch (st) {
      case 'waiting': return 0;
      case 'sent': return 1;
      case 'entering_pin': return 2;
      case 'processing': return 3;
      case 'paid': return 4;
      case 'cancelled': return -1;
      case 'failed': return -2;
      default: return 0;
    }
  };

  const activeIndex = activeStkPush ? getStepStatusIndex(activeStkPush.status) : -3;

  // Filtered Ledger Transactions
  const filteredTx = mpesaTransactions.filter((tx) => {
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (ledgerSearch) {
      const q = ledgerSearch.toLowerCase();
      return (
        tx.customerName.toLowerCase().includes(q) ||
        tx.customerPhone.includes(q) ||
        tx.orderId.toLowerCase().includes(q) ||
        (tx.mpesaReceiptNumber && tx.mpesaReceiptNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-gray-200">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#181818] via-[#1F1C12] to-[#181818] border border-[#D4AF37]/40 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#25D366] text-black font-black flex items-center justify-center text-sm shadow-md">
              M
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Safaricom M-Pesa STK Push Terminal
            </h2>
          </div>
          <p className="text-xs text-gray-300">
            Send official Lipa na M-Pesa Online payment requests directly to any customer's mobile phone.
          </p>
        </div>

        {/* Business Settlement Badge */}
        <div className="bg-[#111111] border border-[#2B2B2B] rounded-xl p-3 flex items-center gap-3 shrink-0 text-xs">
          <Building className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <div className="font-bold text-white">Settlement Account</div>
            <div className="text-[11px] text-[#25D366] font-mono font-semibold">
              Till #{settings.mpesaTill} • Paybill #{settings.mpesaPaybill}
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Payment Request Terminal (5 cols) */}
        <div className="lg:col-span-5 bg-[#161616] border border-[#2B2B2B] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-[#262626] pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base font-heading flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#25D366]" />
              <span>Initiate STK Push Request</span>
            </h3>
            <span className="text-[10px] bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 px-2 py-0.5 rounded-full font-mono font-bold">
              Daraja Live API
            </span>
          </div>

          <form onSubmit={handleRequestPayment} className="space-y-3.5 text-xs">
            {/* Select Existing Pending Order */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Select Order (Optional)</label>
              <select
                value={selectedOrderId}
                onChange={(e) => handleOrderSelect(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] text-white rounded-xl p-2.5 outline-none font-medium text-xs"
              >
                <option value="">-- Create Quick Request or Choose Order --</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.customerName} ({settings.currency} {o.totalAmount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. David Kimani"
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] text-white rounded-xl p-2.5 outline-none text-xs"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Customer M-Pesa Phone Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0712 345 678 or 254712345678"
                  className={`w-full bg-[#111111] border text-white rounded-xl pl-9 pr-3 py-2.5 outline-none text-xs font-mono font-bold ${
                    customerPhone
                      ? phoneVal.valid ? 'border-[#25D366]' : 'border-red-500'
                      : 'border-[#333333] focus:border-[#D4AF37]'
                  }`}
                />
                <Smartphone className="w-4 h-4 text-[#25D366] absolute left-3 top-3" />
              </div>

              {/* Validation helper text */}
              {customerPhone && (
                <div className="mt-1 text-[10px]">
                  {phoneVal.valid ? (
                    <span className="text-[#25D366] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Formatted: {phoneVal.formatted} ({phoneVal.rawDisplay})
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {phoneVal.error}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Total Amount & Items */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Amount (KSh) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] text-white font-mono font-extrabold rounded-xl p-2.5 outline-none text-sm text-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Account Reference</label>
                <input
                  type="text"
                  readOnly
                  value={selectedOrderId || 'DC-STORE'}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-gray-400 font-mono text-xs rounded-xl p-2.5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Purchased Items Description</label>
              <input
                type="text"
                value={itemsSummary}
                onChange={(e) => setItemsSummary(e.target.value)}
                placeholder="e.g. Italian Leather Shoes + Slim Fit Blazer"
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] text-white rounded-xl p-2.5 outline-none text-xs"
              />
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>📱 Request M-Pesa Payment</span>
              </button>

              {activeStkPush && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleResendRequest(activeStkPush)}
                    className="py-2 bg-[#222222] hover:bg-[#333333] text-gray-200 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 border border-[#333333]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" /> Resend
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTxForReceipt(activeStkPush)}
                    className="py-2 bg-[#222222] hover:bg-[#333333] text-gray-200 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 border border-[#333333]"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#25D366]" /> Receipt
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelActiveOrder}
                    className="py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 border border-red-500/30"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Live Payment Progress Tracker & Active Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Status Progress Pipeline */}
          <div className="bg-[#161616] border border-[#2B2B2B] rounded-2xl p-5 space-y-5 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#262626] pb-3">
              <h3 className="font-extrabold text-white text-base font-heading flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <span>Live Payment Progress Monitor</span>
              </h3>
              {activeStkPush && (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono uppercase tracking-wider ${
                  activeStkPush.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  activeStkPush.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  activeStkPush.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                }`}>
                  ● {activeStkPush.status.replace('_', ' ')}
                </span>
              )}
            </div>

            {/* Pipeline Visual Steps */}
            <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
              {[
                { label: '1. Waiting', icon: '⏳', desc: 'Ready' },
                { label: '2. Sent', icon: '📲', desc: 'STK Push' },
                { label: '3. PIN Entry', icon: '🔐', desc: 'On Phone' },
                { label: '4. Processing', icon: '🔄', desc: 'Daraja' },
                { label: '5. Paid', icon: '✅', desc: 'Confirmed' },
              ].map((step, idx) => {
                const isPassed = activeIndex >= idx;
                const isCurrent = activeIndex === idx;

                return (
                  <div
                    key={step.label}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                      isPassed
                        ? 'bg-[#25D366]/10 border-[#25D366]/60 text-white font-bold'
                        : isCurrent
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold animate-pulse'
                        : 'bg-[#111111] border-[#262626] text-gray-500'
                    }`}
                  >
                    <span className="text-base">{step.icon}</span>
                    <span className="font-semibold block truncate max-w-full">{step.label}</span>
                    <span className="text-[9px] text-gray-400 block">{step.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Active Transaction Banner Feedback */}
            {activeStkPush ? (
              <div className="bg-[#111111] border border-[#2B2B2B] rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Current Session:</span>
                  <strong className="text-white font-mono">{activeStkPush.checkoutRequestId}</strong>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-[#222222]">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Customer</span>
                    <strong className="text-white">{activeStkPush.customerName}</strong>
                    <div className="text-[10px] text-[#25D366] font-mono">{activeStkPush.customerPhone}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Amount</span>
                    <strong className="text-[#D4AF37] font-mono font-bold">
                      {settings.currency} {activeStkPush.amount.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">M-Pesa Receipt</span>
                    <strong className="text-emerald-400 font-mono">
                      {activeStkPush.mpesaReceiptNumber || 'Awaiting Callback...'}
                    </strong>
                  </div>
                </div>

                {activeStkPush.status === 'paid' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5 text-xs text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Payment Successful! Order Marked Paid & Stock Updated.
                    </span>
                    <button
                      onClick={() => setSelectedTxForReceipt(activeStkPush)}
                      className="px-2.5 py-1 bg-[#25D366] text-black font-extrabold rounded text-[10px] uppercase"
                    >
                      View Receipt
                    </button>
                  </div>
                )}

                {activeStkPush.status === 'cancelled' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-xs text-red-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-4 h-4" /> Payment Cancelled by customer on phone prompt.
                    </span>
                    <button
                      onClick={() => handleResendRequest(activeStkPush)}
                      className="px-2.5 py-1 bg-red-500 text-white font-extrabold rounded text-[10px] uppercase"
                    >
                      Resend Push
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-[#111111] border border-[#222222] rounded-xl text-gray-500 text-xs">
                No active STK Push session. Fill out the request form on the left and click "Request M-Pesa Payment".
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------ M-PESA AUDIT LEDGER TABLE ------------------ */}
      <div className="bg-[#161616] border border-[#2B2B2B] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#262626] pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base font-heading flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#25D366]" />
              <span>M-Pesa Transaction Audit Ledger</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Complete history of Safaricom Daraja STK Push callbacks and settled transactions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="🔍 Search Code, Phone, Name..."
                className="w-full bg-[#111111] border border-[#333333] text-xs text-white rounded-xl pl-8 pr-3 py-1.5 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111111] border border-[#333333] text-xs text-white rounded-xl px-3 py-1.5 outline-none font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="paid">✅ Paid</option>
              <option value="sent">📲 Sent</option>
              <option value="cancelled">⚠ Cancelled</option>
              <option value="failed">❌ Failed</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] text-gray-400 uppercase tracking-wider border-b border-[#2B2B2B]">
              <tr>
                <th className="p-3">M-Pesa Code</th>
                <th className="p-3">Order Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredTx.length > 0 ? (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#222222]">
                    <td className="p-3 font-mono font-bold text-[#25D366]">
                      {tx.mpesaReceiptNumber || 'PENDING'}
                    </td>
                    <td className="p-3 font-mono text-white font-semibold">{tx.orderId}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{tx.customerName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{tx.customerPhone}</div>
                    </td>
                    <td className="p-3 font-bold text-[#D4AF37] font-heading">
                      {settings.currency} {tx.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-400 text-[11px] font-mono">{tx.timestamp}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tx.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                        tx.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {tx.status === 'paid' && (
                        <button
                          onClick={() => setSelectedTxForReceipt(tx)}
                          className="px-2.5 py-1 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/40 rounded font-bold text-[10px] uppercase"
                        >
                          Receipt
                        </button>
                      )}
                      {tx.status !== 'paid' && (
                        <button
                          onClick={() => handleResendRequest(tx)}
                          className="px-2.5 py-1 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/40 rounded font-bold text-[10px] uppercase"
                        >
                          Resend STK
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No transactions match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedTxForReceipt && (
        <DigitalReceiptModal
          transaction={selectedTxForReceipt}
          onClose={() => setSelectedTxForReceipt(null)}
        />
      )}
    </div>
  );
};

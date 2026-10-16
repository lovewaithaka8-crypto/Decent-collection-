import React from 'react';
import { useStore } from '../context/StoreContext';
import { MpesaTransaction, Order } from '../types';
import { X, Printer, CheckCircle2, ShieldCheck, Download, Smartphone } from 'lucide-react';

interface DigitalReceiptModalProps {
  transaction?: MpesaTransaction | null;
  order?: Order | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({ transaction, order, onClose }) => {
  const { settings, products } = useStore();

  if (!transaction && !order) return null;

  const mpesaCode = transaction?.mpesaReceiptNumber || order?.mpesaCode || 'QFH8812J1X';
  const customerName = transaction?.customerName || order?.customerName || 'Customer';
  const customerPhone = transaction?.customerPhone || order?.customerPhone || '';
  const totalAmount = transaction?.amount || order?.totalAmount || 0;
  const orderId = transaction?.orderId || order?.id || 'ORD-000';
  const dateStr = transaction?.timestamp || order?.date || new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#141414] border border-[#2B2B2B] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Receipt Header */}
        <div className="bg-[#1A1A1A] p-4 border-b border-[#2B2B2B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#111111] border border-[#D4AF37] flex items-center justify-center font-black text-[#D4AF37] text-xs">
              DC
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm font-heading">E-RECEIPT & PROOF OF PAYMENT</h3>
              <span className="text-[10px] text-[#25D366] font-mono flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Safaricom M-Pesa Verified
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#222222]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Card Body */}
        <div id="printable-receipt" className="p-6 space-y-5 text-gray-200 text-xs bg-[#121212]">
          {/* Business Header */}
          <div className="text-center space-y-1 border-b border-[#262626] pb-4">
            <h2 className="text-xl font-extrabold text-white font-heading uppercase tracking-wider">
              DECENT COLLECTION
            </h2>
            <p className="text-[11px] text-gray-400">Gentlemen's Luxury Footwear & Bespoke Wear</p>
            <p className="text-[10px] text-gray-500">{settings.address} • Tel: {settings.phone}</p>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#181818] p-3.5 rounded-xl border border-[#262626]">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">M-Pesa Ref Code</span>
              <strong className="text-base text-[#25D366] font-mono font-black">{mpesaCode}</strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Order Reference</span>
              <strong className="text-sm text-white font-mono font-bold">{orderId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Customer</span>
              <span className="text-white font-semibold">{customerName}</span>
              <span className="text-[10px] text-gray-400 block font-mono">{customerPhone}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Date & Time</span>
              <span className="text-gray-300 font-mono text-[11px]">{dateStr}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-400 text-[11px] border-b border-[#222222] pb-1 font-bold uppercase tracking-wider">
              <span>Payment Channel</span>
              <span>Account Till / Paybill</span>
            </div>
            <div className="flex justify-between text-white font-semibold text-xs">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-[#25D366]" /> Lipa na M-Pesa STK Push
              </span>
              <span className="font-mono text-[#D4AF37]">Till {settings.mpesaTill}</span>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-[#1C1A14] border border-[#D4AF37]/40 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">TOTAL AMOUNT PAID</span>
            <div className="text-3xl font-black text-[#D4AF37] font-heading">
              {settings.currency} {totalAmount.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
              ● SETTLED IN BUSINESS TILL #{settings.mpesaTill}
            </span>
          </div>

          {/* Security Guarantee Note */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 pt-2 border-t border-[#222222]">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Official Daraja API Callback Confirmed • Decent Collection CBD</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#1A1A1A] border-t border-[#2B2B2B] flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#262626] hover:bg-[#333333] text-gray-200 font-semibold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

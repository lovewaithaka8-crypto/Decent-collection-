import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, Package, Phone, CheckCircle, Clock, Truck, ShieldCheck } from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({ isOpen, onClose }) => {
  const { orders, settings } = useStore();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const matchedOrders = orders.filter(
    o => o.id.toLowerCase().includes(query.toLowerCase()) || 
         o.customerPhone.includes(query) ||
         o.customerName.toLowerCase().includes(query.toLowerCase()) ||
         (o.mpesaCode && o.mpesaCode.toLowerCase().includes(query.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">🛒 New Order</span>;
      case 'packing':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">📦 Packing</span>;
      case 'completed':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">✅ Completed</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">❌ Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181818] border border-[#2B2B2B] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#1F1F1F] border-b border-[#2B2B2B] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-bold text-white text-base font-heading">
              Track Order & Purchase History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Search Bar */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Search by Phone Number, Order ID or M-Pesa Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearched(true);
                  }}
                  placeholder="e.g. 0712 345 678, ORD-8921, or QFH8921J1"
                  className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
              <button
                onClick={() => setSearched(true)}
                className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#c39e2d] transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* List of Orders */}
          <div className="space-y-3">
            {(searched || query ? matchedOrders : orders).map((ord) => (
              <div
                key={ord.id}
                className="bg-[#1F1F1F] border border-[#2B2B2B] rounded-xl p-4 text-xs space-y-3"
              >
                <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-2">
                  <div>
                    <span className="font-bold text-white text-sm font-heading">{ord.id}</span>
                    <span className="text-[10px] text-gray-500 block">{ord.date}</span>
                  </div>
                  <div>{getStatusBadge(ord.status)}</div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((it, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded bg-black"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium text-xs line-clamp-1">
                          {it.product.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Size: {it.selectedSize} • Qty: {it.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-200">
                        {settings.currency} {((it.product.discountPrice || it.product.price) * it.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="pt-2 border-t border-[#2A2A2A] flex justify-between items-center text-gray-400 text-[11px]">
                  <div>
                    Customer: <strong className="text-white">{ord.customerName}</strong> ({ord.customerPhone})
                  </div>
                  <div className="text-right">
                    Total: <strong className="text-[#D4AF37] text-xs font-bold font-heading">{settings.currency} {ord.totalAmount.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}

            {(searched || query) && matchedOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-xs">
                No orders found matching "{query}". Double check your phone number or Order ID.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

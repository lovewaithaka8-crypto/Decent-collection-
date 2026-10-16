import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, CheckCircle, Truck, Package, XCircle, AlertCircle, 
  Send, Mail, MessageSquare, PhoneCall, Receipt, MapPin, Clock
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface Props {
  order: Order | null;
  onClose: () => void;
}

export const AdminOrderModal: React.FC<Props> = ({ order, onClose }) => {
  const { updateOrderStatusWithNotification, addOrderMessage, settings } = useStore();

  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [notifyChannel, setNotifyChannel] = useState<'email' | 'whatsapp' | 'both' | 'none'>('both');
  const [customMsg, setCustomMsg] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showNotifyPrompt, setShowNotifyPrompt] = useState(false);
  const [adminChatInput, setAdminChatInput] = useState('');

  if (!order) return null;

  const handleStatusChangeClick = (status: OrderStatus) => {
    setTargetStatus(status);
    setShowNotifyPrompt(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (!targetStatus) return;

    updateOrderStatusWithNotification(
      order.id,
      targetStatus,
      notifyChannel,
      customMsg.trim() || undefined,
      cancelReason.trim() || undefined
    );

    setShowNotifyPrompt(false);
    setTargetStatus(null);
    setCustomMsg('');
    setCancelReason('');
  };

  const handleSendAdminChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim()) return;

    addOrderMessage(
      order.id,
      'admin',
      settings.adminName || 'Esther Njoki Mbugua (Super Admin)',
      adminChatInput.trim()
    );

    setAdminChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative text-white max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#27272A] flex items-center justify-between bg-[#09090B]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-1 rounded-lg">
              {order.id}
            </span>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">{order.customerName}</h3>
              <p className="text-[10px] text-gray-400">{order.date} • {order.customerPhone}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Status Bar & Action Controls */}
          <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Status</span>
              <span className="text-xs font-extrabold text-[#D4AF37] uppercase bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                {order.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#27272A]">
              <button
                onClick={() => handleStatusChangeClick('packing')}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
              >
                Accept Order & Start Packing
              </button>

              <button
                onClick={() => handleStatusChangeClick('delivery')}
                className="px-3 py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-xs font-bold transition-all"
              >
                Dispatch Out for Delivery
              </button>

              <button
                onClick={() => handleStatusChangeClick('completed')}
                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all"
              >
                Mark as Completed
              </button>

              <button
                onClick={() => handleStatusChangeClick('cancelled')}
                className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs font-bold transition-all"
              >
                Cancel / Decline Order
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Product Items</h4>
            <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3 space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
                  <div className="flex items-center gap-2.5">
                    <img src={it.product.image} alt={it.product.name} className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                    <div>
                      <p className="font-bold text-white">{it.product.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {it.quantity} • Size: {it.selectedSize} • Color: {it.selectedColor}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#D4AF37]">KSh {(it.product.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 font-bold text-xs border-t border-[#27272A]">
                <span>Total Amount</span>
                <span className="text-[#D4AF37] text-sm">KSh {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] space-y-1">
              <span className="text-[10px] text-gray-500 block">Customer Email</span>
              <span className="font-bold text-white">{order.email}</span>
            </div>
            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] space-y-1">
              <span className="text-[10px] text-gray-500 block">Shipping Destination</span>
              <span className="font-bold text-white">{order.shippingAddress || 'Nairobi Branch Collection'}</span>
            </div>
          </div>

          {/* Admin Order Thread / Chat */}
          <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              Direct Customer Thread
            </h4>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3 min-h-[120px] max-h-[200px] overflow-y-auto space-y-2">
              {(!order.messages || order.messages.length === 0) ? (
                <p className="text-center py-6 text-xs text-gray-500 italic">No messages on this order thread.</p>
              ) : (
                order.messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                      m.sender === 'admin' ? 'bg-[#D4AF37] text-black font-semibold' : 'bg-[#27272A] text-white'
                    }`}>
                      <p className="text-[9px] opacity-75 font-bold">{m.senderName} • {m.timestamp}</p>
                      <p className="mt-0.5">{m.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendAdminChat} className="flex gap-2">
              <input
                type="text"
                value={adminChatInput}
                onChange={(e) => setAdminChatInput(e.target.value)}
                placeholder="Reply to customer..."
                className="flex-1 bg-[#18181B] border border-[#27272A] focus:border-[#D4AF37] text-white text-xs rounded-xl px-3 py-2 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Status Update Notification Sub-Prompt Modal */}
        {showNotifyPrompt && (
          <div className="absolute inset-0 bg-black/90 z-20 p-6 flex items-center justify-center animate-fade-in">
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 w-full max-w-md space-y-4">
              <h3 className="text-base font-bold text-white font-heading">
                Notify Customer of Status Update ({targetStatus?.toUpperCase()})?
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Notification Channel</label>
                  <select
                    value={notifyChannel}
                    onChange={(e) => setNotifyChannel(e.target.value as any)}
                    className="w-full bg-[#09090B] border border-[#27272A] text-white rounded-xl p-2.5 outline-none"
                  >
                    <option value="both">Both Email & WhatsApp</option>
                    <option value="email">Email Only</option>
                    <option value="whatsapp">WhatsApp Only</option>
                    <option value="none">Do Not Send Notification</option>
                  </select>
                </div>

                {targetStatus === 'cancelled' && (
                  <div>
                    <label className="block text-gray-400 mb-1 font-semibold">Cancellation / Decline Reason</label>
                    <input
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="e.g. Out of stock in requested size"
                      className="w-full bg-[#09090B] border border-[#27272A] text-white rounded-xl p-2.5 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Custom Admin Note (Optional)</label>
                  <textarea
                    rows={3}
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Add a personal note from Super Admin Esther..."
                    className="w-full bg-[#09090B] border border-[#27272A] text-white rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowNotifyPrompt(false)}
                  className="px-4 py-2 bg-[#27272A] text-white font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusUpdate}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-xl"
                >
                  Confirm & Send Update
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

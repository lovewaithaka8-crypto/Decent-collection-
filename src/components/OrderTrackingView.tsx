import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  PackageCheck, Search, Clock, CheckCircle2, Truck, AlertCircle, 
  Send, MessageSquare, PhoneCall, ShieldCheck, MapPin, Receipt, ArrowLeft,
  Download, UserCheck, Calendar, RefreshCw, XCircle, FileText
} from 'lucide-react';
import { OrderStatus } from '../types';
import { DigitalReceiptModal } from './DigitalReceiptModal';

interface Props {
  onBack?: () => void;
}

export const OrderTrackingView: React.FC<Props> = ({ onBack }) => {
  const { orders, addOrderMessage, currentCustomer, updateOrderStatusWithNotification } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders.length > 0 ? orders[0].id : null);
  const [newMessageText, setNewMessageText] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReasonText, setCancelReasonText] = useState('');

  // Search filter
  const matchedOrders = orders.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.mpesaCode && o.mpesaCode.toLowerCase().includes(q))
    );
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || matchedOrders[0] || null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newMessageText.trim()) return;

    const senderName = currentCustomer ? currentCustomer.name : selectedOrder.customerName;
    addOrderMessage(selectedOrder.id, 'customer', senderName, newMessageText.trim());
    setNewMessageText('');
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;
    updateOrderStatusWithNotification(
      selectedOrder.id,
      'cancelled',
      'both',
      'Customer requested order cancellation from tracking panel.',
      cancelReasonText.trim() || 'Customer requested order cancellation'
    );
    setShowCancelPrompt(false);
    setCancelReasonText('');
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 1;
      case 'packing': return 2;
      case 'delivery': return 3;
      case 'completed': return 4;
      case 'cancelled': return -1;
      case 'declined': return -1;
      default: return 1;
    }
  };

  const canCancel = selectedOrder && (selectedOrder.status === 'new' || selectedOrder.status === 'packing');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-0.5 rounded-full mb-1">
              <PackageCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Real-time Order Tracker & Fulfillment Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-white">Track My Order</h1>
            <p className="text-xs text-gray-400">Search by Order Number (e.g. ORD-8812) or M-Pesa Phone Number</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order # or Phone..."
            className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Orders List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">Recent Orders ({matchedOrders.length})</h3>
          
          {matchedOrders.length === 0 ? (
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center text-xs text-gray-400 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500/60 mx-auto" />
              <p>No orders matched your search query.</p>
              <button onClick={() => setSearchQuery('')} className="text-[#D4AF37] font-semibold hover:underline">
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {matchedOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#221E12] border-[#D4AF37] shadow-lg'
                        : 'bg-[#18181B] border-[#27272A] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-xs text-white font-mono">{ord.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ord.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        ord.status === 'delivery' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                        ord.status === 'packing' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                        ord.status === 'cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                        'bg-gray-500/15 text-gray-300 border border-gray-500/30'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{ord.items.length} item(s)</span>
                      <span className="font-bold text-[#D4AF37]">KSh {ord.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-between">
                      <span>{ord.date}</span>
                      <span>{ord.customerName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Order Progress & Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <div className="space-y-6">
              
              {/* Status Stepper Card */}
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#27272A] pb-4 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">Order Tracking Reference</span>
                    <h2 className="text-xl font-extrabold text-[#D4AF37] font-mono">{selectedOrder.id}</h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowReceiptModal(true)}
                      className="px-3 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      Download Receipt
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => setShowCancelPrompt(true)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Dates & Assigned Courier info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#09090B] p-3.5 rounded-xl border border-[#27272A] text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Placed On</span>
                    <span className="font-bold text-white">{selectedOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Estimated Delivery</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Within 24 Hours
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Assigned Rider / Agent</span>
                    <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Kevin M. (Nairobi Express)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {selectedOrder.status === 'cancelled' || selectedOrder.status === 'declined' ? (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      Order Cancelled / Declined
                    </div>
                    <p className="text-gray-300">
                      Reason: {selectedOrder.cancelReason || 'Administrative order adjustment.'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Fulfillment Status Progress</h4>
                    
                    <div className="grid grid-cols-4 gap-2 relative">
                      {/* Stepper item 1 */}
                      <div className="text-center space-y-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                          getStatusStepIndex(selectedOrder.status) >= 1
                            ? 'bg-[#D4AF37] text-black shadow-md'
                            : 'bg-[#27272A] text-gray-500'
                        }`}>
                          1
                        </div>
                        <span className="block text-[10px] font-semibold text-gray-300">Order Placed</span>
                      </div>

                      {/* Stepper item 2 */}
                      <div className="text-center space-y-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                          getStatusStepIndex(selectedOrder.status) >= 2
                            ? 'bg-[#D4AF37] text-black shadow-md'
                            : 'bg-[#27272A] text-gray-500'
                        }`}>
                          2
                        </div>
                        <span className="block text-[10px] font-semibold text-gray-300">Packing & Prep</span>
                      </div>

                      {/* Stepper item 3 */}
                      <div className="text-center space-y-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                          getStatusStepIndex(selectedOrder.status) >= 3
                            ? 'bg-[#D4AF37] text-black shadow-md'
                            : 'bg-[#27272A] text-gray-500'
                        }`}>
                          3
                        </div>
                        <span className="block text-[10px] font-semibold text-gray-300">Out for Delivery</span>
                      </div>

                      {/* Stepper item 4 */}
                      <div className="text-center space-y-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                          getStatusStepIndex(selectedOrder.status) >= 4
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-[#27272A] text-gray-500'
                        }`}>
                          4
                        </div>
                        <span className="block text-[10px] font-semibold text-emerald-400">Completed</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary Table */}
                <div className="border-t border-[#27272A] pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Ordered Product Items</h4>
                  <div className="space-y-2 bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
                        <div className="flex items-center gap-2.5">
                          <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                          <div>
                            <p className="font-semibold text-white">{item.product.name}</p>
                            <p className="text-[10px] text-gray-400">Qty: {item.quantity} • Size: {item.selectedSize} • Color: {item.selectedColor}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#D4AF37]">KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Delivery Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] space-y-1">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Receipt className="w-3 h-3 text-[#D4AF37]" />
                        Payment Information
                      </span>
                      <p className="font-bold text-white capitalize">{selectedOrder.paymentMethod} Payment</p>
                      {selectedOrder.mpesaCode && (
                        <p className="text-[10px] text-emerald-400 font-mono">Verification Code: {selectedOrder.mpesaCode}</p>
                      )}
                    </div>

                    <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] space-y-1">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        Delivery Destination
                      </span>
                      <p className="font-semibold text-white">{selectedOrder.shippingAddress || 'Store Collection (Nairobi Central Branch)'}</p>
                      <p className="text-[10px] text-gray-400">Phone: {selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Messages / Direct Communication Box */}
              <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-sm font-bold text-white font-heading">Order Conversation Thread</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    Super Admin Esther Active
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-4 min-h-[160px] max-h-[260px] overflow-y-auto space-y-3">
                  {(!selectedOrder.messages || selectedOrder.messages.length === 0) ? (
                    <div className="text-center py-8 text-xs text-gray-500">
                      No messages on this order yet. Have a question about sizing or delivery timing? Type below!
                    </div>
                  ) : (
                    selectedOrder.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                          msg.sender === 'customer'
                            ? 'bg-[#D4AF37] text-black font-medium'
                            : 'bg-[#27272A] text-white border border-white/10'
                        }`}>
                          <div className="text-[9px] opacity-75 font-bold mb-1 flex items-center justify-between gap-3">
                            <span>{msg.senderName}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type a message to Esther Njoki Mbugua (Super Admin)..."
                    className="flex-1 bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-[#27272A]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Direct encrypted store thread
                  </span>
                  <a
                    href={`https://wa.me/254729445172?text=Hello%20Esther,%20I%20need%20an%20update%20on%20my%20order%20${selectedOrder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Chat on WhatsApp (+254 729 445 172)
                  </a>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-12 text-center text-gray-400 text-sm">
              Select an order from the list on the left to view status progress and messages.
            </div>
          )}
        </div>

      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelPrompt && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Cancel Order {selectedOrder.id}?
            </h3>
            <p className="text-xs text-gray-400">
              Are you sure you want to cancel this order? An automated notification will be dispatched to Super Admin Esther.
            </p>

            <div>
              <label className="block text-xs text-gray-300 font-semibold mb-1">Reason for Cancellation (Optional)</label>
              <textarea
                rows={2}
                value={cancelReasonText}
                onChange={(e) => setCancelReasonText(e.target.value)}
                placeholder="e.g. Changed my mind / need a different size"
                className="w-full bg-[#09090B] border border-[#27272A] text-white text-xs rounded-xl p-2.5 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelPrompt(false)}
                className="px-4 py-2 bg-[#27272A] text-white font-bold text-xs rounded-xl"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {showReceiptModal && selectedOrder && (
        <DigitalReceiptModal
          order={selectedOrder}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

    </div>
  );
};


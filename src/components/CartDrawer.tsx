import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { validateKenyanPhone } from '../services/mpesaService';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle, Smartphone, MapPin, User, Phone, CreditCard, Send, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, createOrder, settings, triggerStkPush } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Nairobi CBD / Pickup at Shop');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | 'cash'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const phoneVal = validateKenyanPhone(customerPhone);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter your Name and M-Pesa Phone Number.');
      return;
    }

    if (paymentMethod === 'mpesa' && !phoneVal.valid) {
      alert(phoneVal.error || 'Invalid Safaricom/Kenyan phone number.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const formattedPhone = phoneVal.valid ? phoneVal.formatted : customerPhone;
      const created = createOrder({
        customerName,
        customerPhone: formattedPhone,
        email: email || `${formattedPhone.replace(/[^0-9]/g, '')}@decent.co.ke`,
        address: address || 'Store Pickup',
        items: cart,
        totalAmount: subtotal,
        status: 'new',
        paymentMethod,
        branchId: settings.activeBranchId
      });

      if (paymentMethod === 'mpesa') {
        const summary = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
        triggerStkPush({
          orderId: created.id,
          customerName,
          customerPhone: formattedPhone,
          amount: subtotal,
          itemsSummary: summary
        });
      }

      setLastOrder(created);
      setIsProcessing(false);
      setStep('success');
    }, 1000);
  };

  const handleCloseAll = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-[#161616] border-l border-[#2B2B2B] h-full flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-[#1A1A1A] border-b border-[#2A2A2A] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-bold text-white text-base font-heading">
              {step === 'cart' && 'Your Shopping Cart'}
              {step === 'checkout' && 'Checkout & Payment'}
              {step === 'success' && 'Order Placed Successfully!'}
            </h2>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 max-w-xs mb-6">
                    Explore our luxury shoes, suits, shirts, and jeans to add items.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-[#c39e2d] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, idx) => {
                    const price = item.product.discountPrice || item.product.price;
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedSize}-${idx}`}
                        className="bg-[#1F1F1F] border border-[#2B2B2B] rounded-xl p-3 flex gap-3 items-center"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-lg bg-black"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-[11px] text-gray-400 mt-0.5 flex gap-2">
                            <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                            <span>Color: <strong className="text-white">{item.selectedColor}</strong></span>
                          </div>
                          <div className="text-xs font-bold text-[#D4AF37] mt-1 font-heading">
                            {settings.currency} {(price * item.quantity).toLocaleString()}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-gray-500 hover:text-red-400 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center border border-[#333333] rounded-lg bg-[#141414]">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                              className="px-2 py-0.5 text-gray-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white min-w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                              className="px-2 py-0.5 text-gray-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCheckout} className="space-y-4 text-xs">
              <div className="bg-[#1F1F1F] p-3 rounded-xl border border-[#2B2B2B] mb-3">
                <div className="text-gray-400 mb-1 flex justify-between">
                  <span>Order Total:</span>
                  <strong className="text-[#D4AF37] text-sm font-heading">
                    {settings.currency} {subtotal.toLocaleString()}
                  </strong>
                </div>
                <div className="text-[11px] text-gray-500">
                  {cart.length} item(s) selected
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David Kimani"
                    className="w-full bg-[#1A1A1A] border border-[#333333] focus:border-[#D4AF37] text-white rounded-lg pl-9 pr-3 py-2 outline-none"
                  />
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* M-Pesa Phone */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  M-Pesa Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0712 345 678"
                    className={`w-full bg-[#1A1A1A] border text-white rounded-lg pl-9 pr-3 py-2 outline-none font-mono ${
                      customerPhone
                        ? phoneVal.valid ? 'border-[#25D366]' : 'border-red-500'
                        : 'border-[#333333] focus:border-[#D4AF37]'
                    }`}
                  />
                  <Smartphone className="w-4 h-4 text-[#25D366] absolute left-3 top-2.5" />
                </div>
                {customerPhone ? (
                  <span className={`text-[10px] mt-1 block font-semibold ${phoneVal.valid ? 'text-[#25D366]' : 'text-red-400'}`}>
                    {phoneVal.valid ? `✓ Valid Safaricom Number (${phoneVal.rawDisplay})` : `⚠ ${phoneVal.error}`}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    You will receive an M-Pesa STK PIN prompt on this phone.
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@gmail.com"
                  className="w-full bg-[#1A1A1A] border border-[#333333] focus:border-[#D4AF37] text-white rounded-lg px-3 py-2 outline-none"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Delivery / Pickup Location *</label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Kilimani Ring Road, or Pickup at Nairobi CBD Hilton Shop"
                    className="w-full bg-[#1A1A1A] border border-[#333333] focus:border-[#D4AF37] text-white rounded-lg pl-9 pr-3 py-2 outline-none text-xs"
                  />
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'mpesa'
                        ? 'border-[#25D366] bg-[#25D366]/10 text-white font-bold'
                        : 'border-[#333333] bg-[#1A1A1A] text-gray-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#25D366]" />
                    <span>M-Pesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'bank'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-bold'
                        : 'border-[#333333] bg-[#1A1A1A] text-gray-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                    <span>Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'cash'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-bold'
                        : 'border-[#333333] bg-[#1A1A1A] text-gray-400'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Cash on Pickup</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold rounded-lg text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      Processing M-Pesa STK Push...
                    </span>
                  ) : (
                    <span>Confirm & Pay {settings.currency} {subtotal.toLocaleString()}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && lastOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-heading">Payment Received!</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Thank you for shopping at Decent Collection.
                </p>
              </div>

              <div className="bg-[#1F1F1F] border border-[#2B2B2B] rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#2A2A2A] pb-2">
                  <span className="text-gray-400">Order Reference:</span>
                  <strong className="text-[#D4AF37] font-mono font-bold text-sm">{lastOrder.id}</strong>
                </div>
                {lastOrder.mpesaCode && (
                  <div className="flex justify-between border-b border-[#2A2A2A] pb-2">
                    <span className="text-gray-400">M-Pesa Receipt:</span>
                    <strong className="text-[#25D366] font-mono">{lastOrder.mpesaCode}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                    {lastOrder.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Address:</span>
                  <span className="text-white text-right max-w-[180px] truncate">{lastOrder.address}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400">
                Our manager will contact you shortly on <strong className="text-white">{lastOrder.customerPhone}</strong> to confirm dispatch.
              </p>

              <button
                onClick={handleCloseAll}
                className="w-full py-3 bg-[#D4AF37] text-black font-extrabold text-xs rounded-lg uppercase tracking-wider hover:bg-[#c39e2d] transition-colors"
              >
                Done & Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Controls */}
        {step === 'cart' && cart.length > 0 && (
          <div className="p-4 bg-[#1A1A1A] border-t border-[#2A2A2A] space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Subtotal:</span>
              <strong className="text-[#D4AF37] text-lg font-bold font-heading">
                {settings.currency} {subtotal.toLocaleString()}
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={clearCart}
                className="py-2.5 px-3 bg-[#222222] hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs font-semibold rounded-lg transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={() => setStep('checkout')}
                className="py-2.5 px-3 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-lg uppercase tracking-wider transition-colors shadow-lg"
              >
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

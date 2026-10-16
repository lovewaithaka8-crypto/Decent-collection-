import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { generateMpesaReceiptCode } from '../services/mpesaService';
import { Smartphone, CheckCircle2, AlertCircle, X, ShieldCheck, Lock, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';

export const MpesaPhoneSimulator: React.FC = () => {
  const { activeStkPush, updateMpesaTransactionStatus, clearActiveStkPush, settings, showPhoneSimulator, setShowPhoneSimulator } = useStore();
  
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when new transaction arrives
    if (activeStkPush) {
      setPin('');
      setIsSubmitting(false);
      setSmsNotification(null);
    }
  }, [activeStkPush?.id]);

  if (!showPhoneSimulator || !activeStkPush) return null;

  const handleEnterPin = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleQuickPin = () => {
    setPin('1234');
  };

  const handleCancelPayment = () => {
    updateMpesaTransactionStatus(activeStkPush.id, 'cancelled', undefined, 'Customer cancelled transaction on phone prompt.');
    setTimeout(() => {
      // Keep open briefly so user sees status, then close or allow retry
    }, 1500);
  };

  const handleSubmitPin = () => {
    if (pin.length !== 4) {
      alert('Please enter a 4-digit M-Pesa PIN (e.g. 1234)');
      return;
    }

    setIsSubmitting(true);
    updateMpesaTransactionStatus(activeStkPush.id, 'entering_pin');

    // Simulate Daraja API Processing Delay (1.5s)
    setTimeout(() => {
      updateMpesaTransactionStatus(activeStkPush.id, 'processing');

      setTimeout(() => {
        const receiptCode = generateMpesaReceiptCode();
        updateMpesaTransactionStatus(activeStkPush.id, 'paid', receiptCode);
        setIsSubmitting(false);

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

        // Official Safaricom SMS Text format
        setSmsNotification(
          `${receiptCode} Confirmed. KSh ${activeStkPush.amount.toLocaleString()} sent to ${settings.shopName} (Till ${settings.mpesaTill}) for Account ${activeStkPush.orderId} on ${dateStr} at ${timeStr}. New M-Pesa balance is KSh 24,180. Transaction cost KSh 0.00.`
        );
      }, 1200);
    }, 1200);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end justify-end pointer-events-auto">
      {/* Phone Screen Container */}
      <div className="w-[310px] bg-[#0A0A0A] border-4 border-[#2D2D2D] rounded-[36px] shadow-2xl p-3 text-white overflow-hidden relative font-sans animate-in fade-in slide-in-from-bottom-6">
        
        {/* Phone Speaker Notch */}
        <div className="w-24 h-4 bg-[#1C1C1C] rounded-b-xl mx-auto mb-2 flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#111111] border border-gray-700" />
          <div className="w-8 h-1 bg-gray-800 rounded-full" />
        </div>

        {/* Header Bar */}
        <div className="flex justify-between items-center px-2 mb-2 text-[10px] text-gray-400 font-mono">
          <span className="flex items-center gap-1 font-bold text-[#25D366]">
            Safaricom 4G
          </span>
          <button
            onClick={() => setShowPhoneSimulator(false)}
            className="text-gray-400 hover:text-white p-1"
            title="Minimize phone simulator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SMS Notification Banner (Top Pop) */}
        {smsNotification && (
          <div className="bg-[#1C251D] border border-[#25D366]/50 rounded-2xl p-3 mb-3 text-xs space-y-1.5 shadow-xl animate-bounce">
            <div className="flex items-center justify-between text-[#25D366] font-bold text-[11px]">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> M-PESA
              </span>
              <span>Just now</span>
            </div>
            <p className="text-[11px] text-emerald-100 font-mono leading-relaxed">
              {smsNotification}
            </p>
            <button
              onClick={clearActiveStkPush}
              className="w-full py-1.5 bg-[#25D366] text-black font-extrabold text-[10px] rounded-lg uppercase tracking-wider mt-1"
            >
              Close Simulator
            </button>
          </div>
        )}

        {/* Main STK Push Dialog Window */}
        {activeStkPush.status !== 'paid' && activeStkPush.status !== 'cancelled' && (
          <div className="bg-[#181818] border border-[#333333] rounded-2xl p-3.5 space-y-3 shadow-2xl">
            {/* Title Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#25D366] text-black flex items-center justify-center font-black text-[10px]">
                  M
                </div>
                <span className="font-extrabold text-white text-xs font-heading">Lipa na M-Pesa</span>
              </div>
              <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.5 rounded font-mono font-bold">
                Till {settings.mpesaTill}
              </span>
            </div>

            {/* Prompt Description */}
            <div className="text-[11px] text-gray-200 space-y-1">
              <div className="font-semibold text-white">Payment Request</div>
              <div className="text-gray-400">
                Business: <strong className="text-white">{settings.shopName}</strong>
              </div>
              <div className="text-gray-400">
                Amount: <strong className="text-[#D4AF37] font-bold font-mono">{settings.currency} {activeStkPush.amount.toLocaleString()}</strong>
              </div>
              <div className="text-gray-400">
                Ref: <strong className="text-white font-mono">{activeStkPush.orderId}</strong>
              </div>
            </div>

            {/* PIN Input Display */}
            <div className="bg-[#111111] border border-[#333333] rounded-xl p-2.5 text-center">
              <label className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wider font-semibold">
                Enter your M-Pesa PIN
              </label>
              <div className="flex justify-center gap-2 text-xl font-mono font-bold tracking-widest text-[#25D366] h-7 items-center">
                {pin.length > 0 ? (
                  pin.split('').map((_, i) => <span key={i}>*</span>)
                ) : (
                  <span className="text-xs text-gray-600 font-sans italic">4 digits...</span>
                )}
              </div>
            </div>

            {/* Status Feedback */}
            {isSubmitting && (
              <div className="flex items-center justify-center gap-2 text-xs text-[#D4AF37] font-semibold py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Authorizing with Safaricom...</span>
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === 'C') setPin('');
                    else if (k === '⌫') handleBackspace();
                    else handleEnterPin(k);
                  }}
                  className="py-2 bg-[#222222] hover:bg-[#333333] text-white font-bold rounded-lg text-xs active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Quick Demo Fill & Action Buttons */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={handleQuickPin}
                className="w-full py-1 text-[10px] text-gray-400 hover:text-[#D4AF37] underline"
              >
                [ Demo Quick-Fill PIN 1234 ]
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCancelPayment}
                  className="py-2 bg-[#2A2A2A] hover:bg-red-500/20 text-gray-300 hover:text-red-400 font-bold text-xs rounded-xl uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || pin.length !== 4}
                  onClick={handleSubmitPin}
                  className="py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg disabled:opacity-50"
                >
                  Send PIN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled State */}
        {activeStkPush.status === 'cancelled' && (
          <div className="bg-[#241A1A] border border-red-500/40 rounded-2xl p-4 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <h4 className="font-extrabold text-white text-xs uppercase">⚠ Payment Cancelled</h4>
            <p className="text-[10px] text-gray-400">
              The user cancelled the prompt on their phone.
            </p>
            <button
              onClick={clearActiveStkPush}
              className="px-4 py-1.5 bg-[#222222] text-gray-200 font-bold text-[10px] rounded-lg uppercase"
            >
              Close
            </button>
          </div>
        )}

        {/* Home Indicator Bar */}
        <div className="w-20 h-1 bg-gray-700 rounded-full mx-auto mt-3" />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Mail, CheckCircle, ShieldCheck, Crown, ArrowRight, User, Phone, AlertCircle } from 'lucide-react';

export const VIPClubSection: React.FC = () => {
  const { subscribeVIPClub } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ name: string; vipCode: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setErrorMsg('Please accept the VIP membership terms to join.');
      return;
    }

    const res = subscribeVIPClub(name.trim(), email.trim(), phone.trim());

    if (!res.success) {
      if (res.isAlreadySubscribed) {
        setErrorMsg('This email is already a VIP Member.');
      } else {
        setErrorMsg(res.message);
      }
      return;
    }

    setSuccessInfo({ name: name.trim(), vipCode: res.vipCode || 'VIP-000001' });
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#141414] via-[#1A1810] to-[#141414] border-y border-[#2E2818] relative overflow-hidden">
      {/* Decorative Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="bg-[#1C1A14]/90 border border-[#4A3E1B] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          
          {/* Header Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              Decent Collection VIP Club
            </span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-wide mb-3">
              ⭐ Join the Decent Collection VIP Club
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Subscribe to receive exclusive discounts, new arrival previews, flash sales, holiday offers, and VIP promotions directly in your inbox and WhatsApp.
            </p>
          </div>

          {successInfo ? (
            <div className="bg-gradient-to-r from-[#211E10] via-[#2A2412] to-[#211E10] border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto shadow-xl">
              <div className="w-14 h-14 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  🎉 Welcome to the VIP Club, {successInfo.name}!
                </h3>
                <p className="text-xs text-[#D4AF37] font-semibold mt-1">
                  Your VIP Code: <span className="bg-black/50 px-2 py-1 rounded border border-[#D4AF37]/40 tracking-wider font-mono text-sm">{successInfo.vipCode}</span>
                </p>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed border-t border-[#3A321A] pt-4">
                An automatic welcome email from Super Administrator <strong>Esther Njoki Mbugua</strong> has been sent to your email address. Enjoy early access and member-only privileges!
              </p>
              <button
                onClick={() => setSuccessInfo(null)}
                className="mt-2 px-5 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#c39e2d] transition-all"
              >
                Register Another VIP Member
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Esther Njoki"
                      className="w-full bg-[#121212] border border-[#332C19] focus:border-[#D4AF37] text-white rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors"
                    />
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. esther@gmail.com"
                      className="w-full bg-[#121212] border border-[#332C19] focus:border-[#D4AF37] text-white rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors"
                    />
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Phone Number (for WhatsApp VIP Updates)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 712 345 678"
                    className="w-full bg-[#121212] border border-[#332C19] focus:border-[#D4AF37] text-white rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-colors"
                  />
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="vip-agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded bg-[#121212] border-[#332C19] text-[#D4AF37] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="vip-agreed" className="text-[11px] text-gray-300 cursor-pointer leading-tight">
                  I agree to receive promotional emails, new arrival announcements, and WhatsApp VIP updates from <strong>Decent Collection</strong>. Unsubscribe anytime.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black font-extrabold text-sm rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 tracking-wide uppercase font-heading"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>✨ Join VIP Club</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Verified Business Gmail
                </span>
                <span>•</span>
                <span>No Spam Guarantee</span>
                <span>•</span>
                <span>Instant Welcome Gift</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
};

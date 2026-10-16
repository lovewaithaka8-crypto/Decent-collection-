import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setViewMode } = useStore();

  const [email, setEmail] = useState('manager@decentcollection.co.ke');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(password);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#111111] relative overflow-hidden">
      {/* Background Subtle Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Customer Store */}
      <button
        onClick={() => setViewMode('customer')}
        className="absolute top-6 left-6 text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Storefront
      </button>

      <div className="w-full max-w-md bg-[#161616] border border-[#2B2B2B] rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F1F1F] to-[#2B2B2B] border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-xl gold-border-glow">
            <span className="text-[#D4AF37] font-black text-2xl font-heading">DC</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide font-heading">
            DECENT COLLECTION
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            Store Manager Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              👤 Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@decentcollection.co.ke"
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              🔒 Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-[#D4AF37] bg-[#111111] border-[#333333]"
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to manager email.')}
              className="text-[#D4AF37] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-98"
          >
            [ Login to Dashboard ]
          </button>
        </form>

        {/* Demo Fast Access Button */}
        <div className="mt-6 pt-6 border-t border-[#262626] text-center">
          <p className="text-[11px] text-gray-500 mb-3">Quick Manager Access (Pre-authorized):</p>
          <button
            type="button"
            onClick={() => loginAdmin('admin123')}
            className="w-full py-2.5 px-4 bg-[#222222] hover:bg-[#2A2A2A] border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            <span>Login as Store Manager (Mother)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

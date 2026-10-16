import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Home, ShoppingBag, Crown, PackageCheck, User, PhoneCall, 
  Sparkles, Tag, Shield, LogOut, ChevronRight, MessageSquare, CheckCircle, Mail,
  Search, Heart, Bell, Settings, HelpCircle, Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'otp') => void;
  onOpenTrackOrder: () => void;
}

export const NavigationDrawer: React.FC<Props> = ({ isOpen, onClose, onOpenAuth, onOpenTrackOrder }) => {
  const { 
    currentCustomer, logoutCustomer, setActiveCategory, setViewMode, 
    viewMode, isLoggedIn, searchQuery, setSearchQuery, cart
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  if (!isOpen) return null;

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setViewMode('customer');
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setViewMode('customer');
    onClose();
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-[85%] max-w-sm bg-[#121212] border-r border-[#27272A] text-white flex flex-col h-full z-10 shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#27272A] flex items-center justify-between bg-gradient-to-r from-[#1C1A14] to-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA820A] text-black font-extrabold flex items-center justify-center font-heading text-base shadow-lg border border-[#FFE885]/30">
              DC
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base font-heading tracking-wide text-white">DECENT COLLECTION</h2>
              <p className="text-[10px] text-[#D4AF37] font-semibold tracking-wider uppercase">Luxury Men's Wear Nairobi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar inside Drawer */}
        <div className="p-3.5 bg-[#161618] border-b border-[#27272A]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search suits, shoes, shirts..."
              className="w-full bg-[#0B0B0C] text-xs text-white placeholder-gray-500 rounded-xl pl-9 pr-8 py-2.5 border border-[#27272A] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            {localSearch && (
              <button 
                type="button" 
                onClick={() => { setLocalSearch(''); setSearchQuery(''); }}
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* User Account Quick Card */}
        <div className="p-4 bg-[#18181B] border-b border-[#27272A]">
          {currentCustomer ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-sm shadow-inner">
                    {currentCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {currentCustomer.name}
                      {currentCustomer.isVip && (
                        <span className="text-[9px] bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black px-2 py-0.5 rounded-full font-extrabold uppercase shadow-sm">VIP</span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      {currentCustomer.emailVerified ? (
                        <span className="text-emerald-400 flex items-center gap-0.5 font-medium"><CheckCircle className="w-3 h-3" /> Email Verified</span>
                      ) : (
                        <span className="text-amber-400 font-semibold flex items-center gap-0.5"><Mail className="w-3 h-3" /> Pending OTP</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logoutCustomer}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {!currentCustomer.emailVerified && (
                <button
                  onClick={() => { onClose(); onOpenAuth('otp'); }}
                  className="w-full py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Verify Email (Enter OTP Code)
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onClose(); onOpenAuth('login'); }}
                className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] active:scale-[0.98] text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => { onClose(); onOpenAuth('register'); }}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all border border-white/10"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          
          {/* Main Navigation */}
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2 px-2">Main Menu</p>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('all')}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-white/5 active:bg-white/10 text-xs font-semibold text-gray-200 transition-colors min-h-[44px]"
              >
                <span className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#D4AF37]" />
                  Home & Catalog
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>

              <button
                onClick={() => handleCategorySelect('all')}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-white/5 active:bg-white/10 text-xs font-semibold text-gray-200 transition-colors min-h-[44px]"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                  <span>Shop Collections</span>
                </span>
                {totalCartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#D4AF37] text-black font-extrabold">
                    {totalCartCount} in cart
                  </span>
                )}
              </button>

              <button
                onClick={() => { onClose(); onOpenTrackOrder(); }}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-white/5 active:bg-white/10 text-xs font-semibold text-gray-200 transition-colors min-h-[44px]"
              >
                <span className="flex items-center gap-3">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  Track Order / Delivery
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>

              <a
                href="#vip-section"
                onClick={onClose}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-gradient-to-r from-[#2B2412] to-[#121212] border border-[#4A3E1B] text-xs font-bold text-[#D4AF37] transition-colors min-h-[44px]"
              >
                <span className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                  VIP Club Rewards
                </span>
                <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2 px-2">Shop Categories</p>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('suits')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-xs text-gray-300 min-h-[40px]"
              >
                <span className="flex items-center gap-2">👔 Executive Suits & Blazers</span>
              </button>
              <button
                onClick={() => handleCategorySelect('shoes')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-xs text-gray-300 min-h-[40px]"
              >
                <span className="flex items-center gap-2">👞 Italian Leather Shoes</span>
              </button>
              <button
                onClick={() => handleCategorySelect('shirts')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-xs text-gray-300 min-h-[40px]"
              >
                <span className="flex items-center gap-2">👕 Shirts, Polos & Trousers</span>
              </button>
              <button
                onClick={() => handleCategorySelect('accessories')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-xs text-gray-300 min-h-[40px]"
              >
                <span className="flex items-center gap-2">⌚ Belts, Ties & Accessories</span>
              </button>
              <button
                onClick={() => handleCategorySelect('offers')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold min-h-[40px]"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  Special Offers & Clearance
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>

          {/* Direct WhatsApp Customer Care */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-4 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                Customer Care & Orders
              </p>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">Online</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Have questions about suit sizing, M-Pesa payments, or custom fittings?
            </p>
            <a
              href="https://wa.me/254729445172?text=Hello%20Decent%20Collection,%20I%20have%20an%20inquiry%20regarding%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us (+254 729 445 172)
            </a>
          </div>

          {/* Social Links */}
          <div className="space-y-2 pt-2 border-t border-[#27272A]">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-2">Follow Us</p>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="py-2 bg-white/5 hover:bg-blue-600/20 rounded-xl text-xs font-bold text-gray-300 hover:text-blue-400 transition-colors">FB</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="py-2 bg-white/5 hover:bg-pink-600/20 rounded-xl text-xs font-bold text-gray-300 hover:text-pink-400 transition-colors">IG</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="py-2 bg-white/5 hover:bg-cyan-600/20 rounded-xl text-xs font-bold text-gray-300 hover:text-cyan-400 transition-colors">TK</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="py-2 bg-white/5 hover:bg-sky-600/20 rounded-xl text-xs font-bold text-gray-300 hover:text-sky-400 transition-colors">X</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="py-2 bg-white/5 hover:bg-red-600/20 rounded-xl text-xs font-bold text-gray-300 hover:text-red-400 transition-colors">YT</a>
            </div>
          </div>

          {/* Admin Switch */}
          <div className="pt-2 border-t border-[#27272A]">
            {isLoggedIn ? (
              <button
                onClick={() => { setViewMode('admin_dashboard'); onClose(); }}
                className="w-full py-2.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#D4AF37]/25 transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Return to Admin Dashboard
              </button>
            ) : (
              <button
                onClick={() => { setViewMode('admin_login'); onClose(); }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                Administrator Portal
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#09090B] border-t border-[#27272A] flex items-center justify-between text-[10px] text-gray-500 px-4">
          <span>Decent Collection © 2026</span>
          <span className="font-mono text-[#D4AF37]">v1.0 • PWA Ready</span>
        </div>

      </div>
    </div>
  );
};

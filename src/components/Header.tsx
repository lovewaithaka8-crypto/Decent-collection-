import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, Heart, Search, User, ShieldCheck, 
  Menu, X, ChevronDown, Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenCustomerAccount: () => void;
  onOpenDrawer?: () => void;
  onOpenTrackOrder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenCart, 
  onOpenWishlist, 
  onOpenCustomerAccount,
  onOpenDrawer,
  onOpenTrackOrder
}) => {
  const { 
    cart, wishlistIds, settings, setViewMode, 
    searchQuery, setSearchQuery, activeCategory, setActiveCategory,
    isLoggedIn, currentCustomer 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'clothing' | 'shoes' | null>(null);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const clothingSubcategories = [
    { label: 'Suits & Tuxedos', icon: '👔' },
    { label: 'Formal Shirts', icon: '👕' },
    { label: 'T-Shirts & Polos', icon: '👚' },
    { label: 'Designer Jeans', icon: '👖' },
    { label: 'Trousers & Chinos', icon: '👖' },
    { label: 'Jackets & Blazers', icon: '🧥' },
    { label: 'Hoodies & Sweaters', icon: '🧥' },
  ];

  const shoesSubcategories = [
    { label: 'Sneakers & Sport', icon: '👟' },
    { label: 'Italian Formal Shoes', icon: '👞' },
    { label: 'Luxury Loafers', icon: '👞' },
    { label: 'Leather Boots', icon: '🥾' },
    { label: 'Casual Sandals', icon: '🩴' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'all') {
      setActiveCategory('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'all_shop') {
      setActiveCategory('all');
      const el = document.getElementById('catalog-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'about') {
      const el = document.getElementById('about-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'contact') {
      const el = document.getElementById('contact-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveCategory(id);
      const el = document.getElementById('catalog-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-[#222222] font-sans">
      {/* Top Announcement Bar */}
      {settings.announcementText && (
        <div className="bg-gradient-to-r from-[#1A1A1A] via-[#241E10] to-[#1A1A1A] text-xs py-1.5 px-4 border-b border-[#282828] text-gray-200">
          <div className="container mx-auto flex justify-between items-center text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{settings.announcementText}</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="text-[#D4AF37]">Till: <strong>{settings.mpesaTill}</strong></span>
              <span className="text-gray-400">Tel: {settings.phone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Row */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Logo + Name */}
        <div 
          onClick={() => { setActiveCategory('all'); setSearchQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={settings.shopName}
              referrerPolicy="no-referrer" 
              className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37]" 
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#2B2B2B] border border-[#D4AF37] flex items-center justify-center shadow-lg group-hover:border-white transition-colors">
              <span className="text-[#D4AF37] font-black text-xl font-heading tracking-tighter">DC</span>
            </div>
          )}
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-wider font-heading text-white flex items-center gap-1.5">
              {settings.shopName.toUpperCase()}
            </h1>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-medium">
              {settings.tagline}
            </p>
          </div>
        </div>

        {/* Center Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 relative">
          <button
            onClick={() => handleNavClick('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
              activeCategory === 'all' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-300 hover:text-white hover:bg-[#222222]'
            }`}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('all_shop')}
            className="px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-[#222222]"
          >
            <span>🛍</span>
            <span>Shop</span>
          </button>

          {/* Clothing Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('clothing')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleNavClick('clothing')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 ${
                activeCategory === 'clothing' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-300 hover:text-white hover:bg-[#222222]'
              }`}
            >
              <span>👔</span>
              <span>Clothing</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {activeDropdown === 'clothing' && (
              <div className="absolute top-full left-0 w-56 bg-[#161616] border border-[#2B2B2B] rounded-xl shadow-2xl p-2 space-y-1 z-50">
                {clothingSubcategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavClick('clothing')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-[#252525] flex items-center justify-between"
                  >
                    <span>{sub.label}</span>
                    <span className="text-sm">{sub.icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shoes Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('shoes')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => handleNavClick('shoes')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1 ${
                activeCategory === 'shoes' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-300 hover:text-white hover:bg-[#222222]'
              }`}
            >
              <span>👞</span>
              <span>Shoes</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {activeDropdown === 'shoes' && (
              <div className="absolute top-full left-0 w-56 bg-[#161616] border border-[#2B2B2B] rounded-xl shadow-2xl p-2 space-y-1 z-50">
                {shoesSubcategories.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavClick('shoes')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-[#252525] flex items-center justify-between"
                  >
                    <span>{sub.label}</span>
                    <span className="text-sm">{sub.icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('new')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
              activeCategory === 'new' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-300 hover:text-white hover:bg-[#222222]'
            }`}
          >
            <span>⭐</span>
            <span>New Arrivals</span>
          </button>

          <button
            onClick={() => handleNavClick('offers')}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
              activeCategory === 'offers' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-300 hover:text-white hover:bg-[#222222]'
            }`}
          >
            <span>🔥</span>
            <span>Offers</span>
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className="px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-[#222222]"
          >
            <span>ℹ</span>
            <span>About</span>
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-[#222222]"
          >
            <span>📞</span>
            <span>Contact</span>
          </button>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Toggle */}
          <div className="relative">
            {showSearchBar ? (
              <div className="flex items-center bg-[#1A1A1A] border border-[#D4AF37] rounded-full px-3 py-1 text-xs">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shoes, suits..."
                  className="bg-transparent text-white placeholder-gray-500 outline-none w-32 sm:w-48 text-xs"
                />
                <button onClick={() => setShowSearchBar(false)} className="text-gray-400 hover:text-white p-0.5 ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchBar(true)}
                className="p-2 text-gray-300 hover:text-[#D4AF37] hover:bg-[#1A1A1A] rounded-lg transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-gray-300 hover:text-red-400 hover:bg-[#1A1A1A] rounded-lg transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:px-3 sm:py-2 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-bold rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-[#D4AF37]/10"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-extrabold uppercase">Cart</span>
            {cartItemsCount > 0 && (
              <span className="bg-black text-[#D4AF37] font-extrabold text-xs px-1.5 py-0.2 rounded-full min-w-5 text-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Customer Login & Register */}
          <button
            onClick={onOpenCustomerAccount}
            className="p-2 text-gray-300 hover:text-[#D4AF37] hover:bg-[#1A1A1A] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Customer Account & Security"
          >
            <User className="w-5 h-5 text-[#D4AF37]" />
            <span className="hidden xl:inline">
              {currentCustomer ? (
                <span className="flex items-center gap-1 font-bold text-white">
                  {currentCustomer.name.split(' ')[0]}
                  {currentCustomer.isVip && (
                    <span className="text-[9px] bg-[#D4AF37] text-black px-1.5 rounded font-extrabold">VIP</span>
                  )}
                </span>
              ) : (
                'Login / Register'
              )}
            </span>
          </button>

          {/* Track Order Button */}
          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="hidden lg:flex p-2 text-gray-300 hover:text-[#D4AF37] hover:bg-[#1A1A1A] rounded-lg transition-colors items-center gap-1 text-xs font-medium"
              title="Track Order Status"
            >
              <span>📦</span>
              <span className="hidden xl:inline">Track Order</span>
            </button>
          )}

          {/* Manager Login (Top-Right Corner - Always Visible & Discreet) */}
          <button
            onClick={() => setViewMode(isLoggedIn ? 'admin_dashboard' : 'admin_login')}
            className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/60 text-[#D4AF37] font-bold text-xs flex items-center gap-1 transition-all shadow-sm shrink-0"
            title="Manager Login Portal"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">{isLoggedIn ? 'Dashboard' : '🔐 Manager Login'}</span>
          </button>

          {/* Mobile Menu / Drawer Button */}
          <button
            onClick={() => onOpenDrawer ? onOpenDrawer() : setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Premium Side Navigation Drawer (☰ Hamburger Menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex font-sans">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
          />

          {/* Sliding Side Panel from Left */}
          <div className="relative w-80 max-w-[85vw] bg-[#0D0D0D] border-r border-[#2A2A2A] text-white h-full shadow-2xl flex flex-col z-50 overflow-y-auto p-5 animate-slide-in-left">
            
            {/* Header with Logo & Brand Name */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-3">
                {settings.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt={settings.shopName}
                    referrerPolicy="no-referrer" 
                    className="w-11 h-11 rounded-lg object-cover border border-[#D4AF37] shadow-md" 
                  />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#2B2B2B] border border-[#D4AF37] flex items-center justify-center shadow-lg">
                    <span className="text-[#D4AF37] font-black text-xl font-heading tracking-tighter">DC</span>
                  </div>
                )}
                <div>
                  <h2 className="text-base font-extrabold tracking-wider font-heading text-white">
                    {settings.shopName.toUpperCase()}
                  </h2>
                  <p className="text-[10px] tracking-wider text-[#D4AF37] italic font-medium">
                    Premium Men's Fashion & Footwear
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#222222] border border-[#333] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar in Drawer */}
            <div className="relative my-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suits, shoes, shirts..."
                className="w-full bg-[#141414] border border-[#2B2B2B] text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-[#D4AF37] transition-colors"
              />
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3" />
            </div>

            {/* Menu Nav Links with Equal Spacing & High Tactile Feel */}
            <div className="flex-1 space-y-1.5 py-1">
              <button 
                onClick={() => handleNavClick('all')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🏠</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Home</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 -rotate-90" />
              </button>

              <button 
                onClick={() => handleNavClick('all_shop')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🛍</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Shop All Products</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 -rotate-90" />
              </button>

              <button 
                onClick={() => handleNavClick('clothing')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">👔</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Clothing & Suits</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 -rotate-90" />
              </button>

              <button 
                onClick={() => handleNavClick('shoes')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">👞</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Footwear & Shoes</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 -rotate-90" />
              </button>

              <button 
                onClick={() => handleNavClick('new')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🆕</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">New Arrivals</span>
                </div>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">HOT</span>
              </button>

              <button 
                onClick={() => handleNavClick('offers')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🔥</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Offers & Discounts</span>
                </div>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">SALE</span>
              </button>

              <button 
                onClick={() => { onOpenWishlist(); setMobileMenuOpen(false); }} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">❤️</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Wishlist</span>
                </div>
                {wishlistIds.length > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {wishlistIds.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { onOpenCart(); setMobileMenuOpen(false); }} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🛒</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Shopping Cart</span>
                </div>
                {cartItemsCount > 0 && (
                  <span className="bg-[#D4AF37] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { onOpenCustomerAccount(); setMobileMenuOpen(false); }} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">👤</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">My Account</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 -rotate-90" />
              </button>

              <button 
                onClick={() => { onOpenCustomerAccount(); setMobileMenuOpen(false); }} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📝</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Register Account</span>
                </div>
              </button>

              <button 
                onClick={() => handleNavClick('contact')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📞</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">Contact Us</span>
                </div>
              </button>

              <button 
                onClick={() => handleNavClick('about')} 
                className="w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-[#141414] hover:bg-[#1F1F1F] text-gray-200 border border-[#222222] hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">ℹ</span>
                  <span className="group-hover:text-[#D4AF37] font-medium">About Us</span>
                </div>
              </button>
            </div>

            {/* Manager Access Section (Placed at the VERY bottom with thin gold divider) */}
            <div className="mt-4 pt-4 border-t border-[#D4AF37]/30">
              <button
                onClick={() => {
                  setViewMode(isLoggedIn ? 'admin_dashboard' : 'admin_login');
                  setMobileMenuOpen(false);
                }}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#1A1810] via-[#2A2410] to-[#1A1810] border border-[#D4AF37]/70 text-[#D4AF37] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg active:scale-98"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoggedIn ? '🔐 Manager Dashboard' : '🔐 Manager Login'}</span>
              </button>
              <p className="text-[10px] text-center text-gray-500 mt-2">
                Authorized Personnel Only • Decent Collection System
              </p>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};



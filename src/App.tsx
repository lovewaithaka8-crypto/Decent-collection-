import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CustomerStore } from './components/CustomerStore';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { MpesaPhoneSimulator } from './components/MpesaPhoneSimulator';
import { SplashScreen } from './components/SplashScreen';
import { Product } from './types';

function MainApp() {
  const { viewMode, settings, setViewMode } = useStore();

  const [showSplash, setShowSplash] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'otp'>('login');
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register' | 'otp' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  if (settings.isMaintenanceMode && viewMode === 'customer' && !showSplash) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-[#1A1A1A] border border-[#D4AF37] rounded-2xl flex items-center justify-center text-[#D4AF37] font-black text-2xl font-heading shadow-2xl">
          DC
        </div>

        <div className="space-y-2 max-w-lg">
          <h1 className="text-3xl font-black font-heading tracking-wider uppercase text-[#D4AF37]">
            {settings.shopName}
          </h1>
          <p className="text-sm font-semibold uppercase text-gray-400 tracking-widest">
            {settings.tagline}
          </p>
          <div className="pt-4 text-xs text-gray-300 leading-relaxed bg-[#141414] border border-[#2B2B2B] p-5 rounded-2xl">
            {settings.maintenanceMessage || 'Decent Collection is currently undergoing scheduled inventory updates and maintenance. We will be back online shortly!'}
          </div>
        </div>

        <button
          onClick={() => setViewMode('admin_login')}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs uppercase rounded-xl tracking-wider transition-colors"
        >
          Manager / Admin Portal Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-['Inter',sans-serif]">
      {/* Opening Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {viewMode === 'customer' && (
        <>
          <Header
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsOrdersOpen(true)}
            onOpenOrders={() => setIsOrdersOpen(true)}
            onOpenCustomerAccount={() => handleOpenAuth('login')}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          />

          <main className="flex-1 pb-12">
            {isTrackOrderOpen ? (
              <OrderTrackingView onBack={() => setIsTrackOrderOpen(false)} />
            ) : (
              <CustomerStore onQuickView={(p) => setQuickViewProduct(p)} />
            )}
          </main>

          <Footer />

          {/* Navigation Drawer */}
          <NavigationDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onOpenAuth={(mode) => { setIsDrawerOpen(false); handleOpenAuth(mode || 'login'); }}
            onOpenTrackOrder={() => { setIsDrawerOpen(false); setIsTrackOrderOpen(true); }}
          />

          {/* Customer Auth & OTP Verification Modal */}
          <CustomerAuthModal
            isOpen={isAuthModalOpen}
            initialMode={authModalMode}
            onClose={() => setIsAuthModalOpen(false)}
          />

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />

          {/* Product Detail Modal */}
          <ProductDetailModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onOpenCart={() => setIsCartOpen(true)}
          />

          {/* Legacy Customer Account Modal (for past orders) */}
          <CustomerAccountModal
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
          />
        </>
      )}

      {viewMode === 'admin_login' && <AdminLogin />}

      {viewMode === 'admin_dashboard' && <AdminDashboard />}

      {/* Global M-Pesa STK Push Phone Simulator Overlay */}
      <MpesaPhoneSimulator />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

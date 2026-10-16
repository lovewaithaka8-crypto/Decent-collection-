import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { settings } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation ticker
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 70); // 100 / 2 * 70ms = 3500ms (3.5 seconds)

    // Auto dismiss timer
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleExitComplete = () => {
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#080808] flex flex-col justify-between items-center py-12 px-6 text-white font-sans overflow-hidden select-none"
        >
          {/* Ambient Background Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Top Subtle Brand Eyebrow */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 bg-[#141414] border border-[#D4AF37]/30 px-4 py-1.5 rounded-full text-[11px] text-[#D4AF37] font-semibold uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Official Luxury E-Commerce Portal</span>
          </motion.div>

          {/* Center Brand Identity & Logo */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-6 my-auto">
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
              className="relative"
            >
              {/* Outer Pulsing Gold Ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#D4AF37] via-[#FFF3C4] to-[#B38F24] opacity-30 blur-md animate-pulse" />

              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.shopName}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-2xl relative z-10"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#222222] border-2 border-[#D4AF37] flex items-center justify-center shadow-2xl relative z-10">
                  <span className="text-[#D4AF37] font-black text-4xl sm:text-5xl font-heading tracking-tighter">
                    DC
                  </span>
                </div>
              )}
            </motion.div>

            {/* Business Name */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="space-y-2"
            >
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-heading uppercase text-white">
                {settings.shopName.toUpperCase()}
              </h1>
              <p className="text-xs sm:text-sm text-[#D4AF37] tracking-[0.25em] font-medium uppercase">
                {settings.tagline || "Premium Men's Fashion & Footwear"}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xs text-gray-400 max-w-xs leading-relaxed font-light"
            >
              Italian Leather Footwear • Executive Suits • Egyptian Cotton Shirts
            </motion.p>
          </div>

          {/* Bottom Progress Bar & Skip */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="w-full max-w-xs space-y-3 relative z-10 text-center"
          >
            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-[#222222] rounded-full overflow-hidden border border-[#333333]/50">
              <div
                className="h-full bg-gradient-to-r from-[#B38F24] via-[#D4AF37] to-[#FFF3C4] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-500">
              <span>Entering Storefront...</span>
              <button
                onClick={handleSkip}
                className="text-[#D4AF37] hover:text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Skip</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

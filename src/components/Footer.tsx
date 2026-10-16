import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, MapPin, Phone, Mail, Clock, ArrowUp, ExternalLink, FileText, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveCategory, setViewMode, isLoggedIn } = useStore();
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'returns' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222222] text-gray-400 text-sm mt-16 font-sans">
      {/* Policy Modal Overlay */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#2B2B2B] rounded-2xl max-w-lg w-full p-6 text-gray-300 relative space-y-4">
            <button 
              onClick={() => setActivePolicy(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {activePolicy === 'privacy' && (
              <>
                <h3 className="text-lg font-bold text-white font-heading">🔒 Privacy Policy</h3>
                <p className="text-xs leading-relaxed">
                  Decent Collection is committed to preserving the privacy and data security of our distinguished customers in Kenya. We process customer names, phone numbers, and delivery addresses solely for completing order fulfillment and Safaricom M-Pesa transaction processing.
                </p>
                <p className="text-xs text-gray-400">
                  Your data is encrypted and never sold or shared with third parties.
                </p>
              </>
            )}

            {activePolicy === 'terms' && (
              <>
                <h3 className="text-lg font-bold text-white font-heading">📜 Terms & Conditions</h3>
                <p className="text-xs leading-relaxed">
                  All transactions made on Decent Collection are settled in Kenyan Shillings (KSh) via official M-Pesa Till 892100 or bank transfer. Orders are dispatched immediately upon payment confirmation.
                </p>
                <p className="text-xs text-gray-400">
                  Deliveries within Nairobi CBD are fulfilled same-day within 2 hours. Countrywide parcel shipping is conducted via Wells Fargo or EasyCoach.
                </p>
              </>
            )}

            {activePolicy === 'returns' && (
              <>
                <h3 className="text-lg font-bold text-white font-heading">🔄 Returns & Exchange Policy</h3>
                <p className="text-xs leading-relaxed">
                  We accept size exchanges and returns on unworn items with original tags and shoe box intact within 7 days of purchase.
                </p>
                <p className="text-xs text-gray-400">
                  Visit our Kimathi Street Nairobi CBD store or call our support team at {settings.phone} to arrange return courier pickup.
                </p>
              </>
            )}

            <button
              onClick={() => setActivePolicy(null)}
              className="w-full py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-lg uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Upper Footer / Contact Section */}
      <div id="contact-section" className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.shopName} className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37]" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#D4AF37] flex items-center justify-center">
                <span className="text-[#D4AF37] font-black text-xl font-heading">DC</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-white font-heading uppercase">{settings.shopName}</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{settings.tagline}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Kenya's premier destination for luxury men's footwear, Italian leather shoes, executive slim-fit suits, Egyptian cotton shirts, and designer menswear.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Decent%20Collection,%20I%20would%20like%20to%20inquire%20about%20your%20products.`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1eb855] text-black font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
            >
              📱 WhatsApp
            </a>
            <a
              href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-opacity"
            >
              📸 Instagram
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#222222] pb-2 font-heading">
            Quick Navigation
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { setActiveCategory('all'); scrollToTop(); }} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                🏠 Home
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveCategory('shoes'); scrollToTop(); }} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                👞 Shoes & Footwear
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveCategory('clothing'); scrollToTop(); }} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                👔 Suits & Clothing
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveCategory('new'); scrollToTop(); }} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                ⭐ New Arrivals
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveCategory('offers'); scrollToTop(); }} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-amber-400 font-semibold">
                🔥 Special Offers & Sales
              </button>
            </li>
          </ul>
        </div>

        {/* Shop Location & Contact */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#222222] pb-2 font-heading">
            Contact & Store Location
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span>{settings.address}</span>
                {settings.googleMapsUrl && (
                  <a 
                    href={settings.googleMapsUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 mt-0.5 font-semibold"
                  >
                    View Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{settings.email}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{settings.openingHours || "Mon - Sat: 8:00 AM - 8:00 PM"}</span>
            </li>
          </ul>
        </div>

        {/* Legal Policies & Manager Portal */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#222222] pb-2 font-heading">
            Store Policies & Portal
          </h3>
          <ul className="space-y-2 text-xs mb-4">
            <li>
              <button onClick={() => setActivePolicy('privacy')} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActivePolicy('terms')} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Terms & Conditions
              </button>
            </li>
            <li>
              <button onClick={() => setActivePolicy('returns')} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Returns & Exchange
              </button>
            </li>
          </ul>

          <button
            onClick={() => {
              setViewMode(isLoggedIn ? 'admin_dashboard' : 'admin_login');
              scrollToTop();
            }}
            className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#252525] border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Store Manager Portal</span>
          </button>
        </div>
      </div>

      {/* Bottom Copyright Row */}
      <div className="bg-[#050505] border-t border-[#1A1A1A] py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© 2026 DECENT COLLECTION. All rights reserved. Premium Men's Wear & Footwear.</p>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">📸 Instagram</a>
            <button onClick={scrollToTop} className="p-1.5 bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-black rounded transition-colors" title="Scroll to Top">
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};


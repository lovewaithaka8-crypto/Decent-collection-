import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Building, Upload, Trash2, RefreshCw, Check, X, Clock, MapPin, Share2, 
  Sliders, Sun, Moon, Type, Image as ImageIcon, Play, Pause, Palette, 
  Layers, Plus, ChevronUp, ChevronDown, Eye, EyeOff, Sparkles, Undo2, 
  FileCheck, Shield, Wand2, Phone, Tag, Store, Globe
} from 'lucide-react';
import { DaySchedule, SocialAccounts, CategoryItemConfig } from '../types';

const TIME_OPTIONS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '10:00 PM'
];

const SHOP_LOCATION_PRESETS = [
  { name: 'Nairobi CBD - Moi Avenue Branch (Flagship Store)', address: 'Decent Collection Tower, Ground Floor, Moi Avenue, Nairobi CBD' },
  { name: 'Westlands Branch - Sarit Centre', address: 'Shop G12, Ground Floor, Sarit Centre Mall, Westlands, Nairobi' },
  { name: 'Kilimani Branch - Yaya Centre', address: '2nd Floor Suite 204, Yaya Centre, Argwings Kodhek Rd, Kilimani' },
  { name: 'Karen Branch - The Hub Karen', address: 'Ground Level, Lower Mall entrance, The Hub Karen, Dagoretti Rd' }
];

export const SettingsManager: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'background' | 'slideshow' | 'hours' | 'socials' | 'location' | 'categories'>('profile');

  // Backup of initial settings for Undo functionality
  const [initialStateSnapshot] = useState(JSON.parse(JSON.stringify(settings)));

  // File Input Hidden Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const multiSlideInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  // Local Editable States
  const [shopName, setShopName] = useState(settings.shopName || 'Decent Collection');
  const [tagline, setTagline] = useState(settings.tagline || "Nairobi's Premium Executive Men's Fashion & Footwear");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [heroBanner, setHeroBanner] = useState(settings.heroBanners?.[0] || '');
  const [publicBgUrl, setPublicBgUrl] = useState(settings.publicBgValue || '');
  const [faviconUrl, setFaviconUrl] = useState(settings.aboutUsTitle || '');
  const [address, setAddress] = useState(settings.address || 'Moi Avenue, Nairobi CBD');

  // Business Schedule State
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    settings.businessSchedule && settings.businessSchedule.length > 0
      ? settings.businessSchedule
      : [
          { day: 'Monday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
          { day: 'Tuesday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
          { day: 'Wednesday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
          { day: 'Thursday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
          { day: 'Friday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
          { day: 'Saturday', openTime: '09:00 AM', closeTime: '05:00 PM', isClosed: false },
          { day: 'Sunday', openTime: '10:00 AM', closeTime: '04:00 PM', isClosed: true }
        ]
  );

  // Social Media State
  const [socials, setSocials] = useState<SocialAccounts>(
    settings.socialAccounts || {
      whatsapp: '+254712345678',
      facebook: 'decentcollectionke',
      instagram: 'decentcollection.co.ke',
      tiktok: '@decentcollection',
      youtube: 'DecentCollectionOfficial',
      twitter: '@decent_ke',
      linkedin: 'decent-collection-kenya',
      pinterest: 'decentcollection',
      telegram: 'decentcollectionke'
    }
  );

  // Category State
  const [categories, setCategories] = useState<CategoryItemConfig[]>(
    settings.customCategories || [
      { id: 'suits', name: 'Executive Italian Suits', icon: '👔', hidden: false },
      { id: 'shoes', name: 'Leather Footwear & Loafers', icon: '👞', hidden: false },
      { id: 'shirts', name: 'Egyptian Cotton Shirts', icon: '👕', hidden: false },
      { id: 'accessories', name: 'Watches, Belts & Ties', icon: '⌚', hidden: false },
      { id: 'women', name: 'Women\'s Collection', icon: '👗', hidden: false },
      { id: 'kids', name: 'Kids & Boys Wear', icon: '👦', hidden: false }
    ]
  );
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🛍️');

  // Helper File Upload Handler (Reads file directly from device & updates state)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper Multi File Upload for Slideshow
  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files) as File[];
      const promises = fileList.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve(evt.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then((urls) => {
        const currentSlides = settings.slideshows || [];
        const newItems = urls.map((url, idx) => ({
          id: `slide_${Date.now()}_${idx}`,
          title: 'New Custom Slide',
          subtitle: 'Uploaded directly from device',
          imageUrl: url,
          buttonText: 'Shop Collection'
        }));
        updateSettings({ slideshows: [...currentSlides, ...newItems] });
        alert(`Successfully uploaded ${urls.length} slideshow image(s) from device!`);
      });
    }
  };

  // Save All Handler
  const handleGlobalSave = () => {
    updateSettings({
      shopName,
      tagline,
      logoUrl,
      address,
      businessSchedule: schedule,
      socialAccounts: socials,
      customCategories: categories,
      heroBanners: heroBanner ? [heroBanner] : settings.heroBanners,
      publicBgValue: publicBgUrl || settings.publicBgValue
    });
    alert('✅ All Settings Saved! Your updates are now live across the store.');
  };

  // Undo Changes Handler
  const handleUndoChanges = () => {
    setShopName(initialStateSnapshot.shopName || '');
    setTagline(initialStateSnapshot.tagline || '');
    setLogoUrl(initialStateSnapshot.logoUrl || '');
    setAddress(initialStateSnapshot.address || '');
    if (initialStateSnapshot.businessSchedule) setSchedule(initialStateSnapshot.businessSchedule);
    if (initialStateSnapshot.socialAccounts) setSocials(initialStateSnapshot.socialAccounts);
    if (initialStateSnapshot.customCategories) setCategories(initialStateSnapshot.customCategories);
    updateSettings(initialStateSnapshot);
    alert('↩ Changes undone. Restored previous values.');
  };

  // Restore Defaults
  const handleRestoreDefaults = () => {
    if (confirm('Are you sure you want to restore default store settings?')) {
      updateSettings({
        shopName: 'Decent Collection',
        tagline: "Nairobi's Premium Executive Men's Fashion & Footwear",
        themeMode: 'dark',
        headingFont: 'Poppins',
        bodyFont: 'Inter',
        buttonStyle: 'rounded',
        cardStyle: 'glass',
        enableAnimations: true,
        enableRoundedCorners: true,
        slideshowDuration: 5,
        slideshowAutoPlay: true
      });
      alert('🔄 Default store settings restored successfully!');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Settings Title Header */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#222222] to-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#262626] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-xl">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  ADMINISTRATOR: ESTA NJOKI MBUGUA
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> No-Code Portal
                </span>
              </div>
              <h2 className="text-2xl font-black text-white font-heading mt-1 tracking-tight">
                Store Settings & Business Control
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Upload files directly from your computer or phone, select opening hours, customize themes, and manage categories effortlessly.
              </p>
            </div>
          </div>

          {/* Action Save Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndoChanges}
              className="px-3.5 py-2.5 bg-[#262626] hover:bg-[#333333] text-gray-300 font-bold text-xs rounded-xl border border-[#3A3A3A] flex items-center gap-1.5 transition-colors"
              title="Undo recent edits"
            >
              <Undo2 className="w-4 h-4 text-amber-400" />
              <span>Undo</span>
            </button>
            <button
              onClick={handleRestoreDefaults}
              className="px-3.5 py-2.5 bg-[#262626] hover:bg-[#333333] text-gray-300 font-bold text-xs rounded-xl border border-[#3A3A3A] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span>Defaults</span>
            </button>
            <button
              onClick={handleGlobalSave}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#2B2B2B] overflow-x-auto scrollbar-none">
          {[
            { id: 'profile', label: '1. Business Profile & Logos', icon: Building },
            { id: 'appearance', label: '2. Website Appearance & Theme', icon: Palette },
            { id: 'background', label: '3. Background Manager', icon: ImageIcon },
            { id: 'slideshow', label: '4. Slideshow Manager', icon: Play },
            { id: 'hours', label: '5. Business Hours', icon: Clock },
            { id: 'socials', label: '6. Social Media Accounts', icon: Share2 },
            { id: 'location', label: '7. Shop Location & Map', icon: MapPin },
            { id: 'categories', label: '8. Shop Categories', icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-lg font-extrabold'
                    : 'bg-[#141414] text-gray-400 hover:text-white hover:bg-[#222222] border border-[#262626]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------ SECTION 1: BUSINESS PROFILE & LOGO FILE UPLOAD ------------------ */}
      {activeSection === 'profile' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Building className="w-5 h-5 text-[#D4AF37]" />
                <span>Business Identity & Device File Uploads</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Directly select images from your computer or smartphone. No copy-pasting links required.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Store Name & Tagline */}
            <div className="space-y-4 bg-[#111111] p-5 rounded-2xl border border-[#262626]">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-[#262626] pb-2">
                General Business Information
              </h4>
              <div>
                <label className="text-gray-300 font-bold block mb-1">Business Name</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37] font-semibold text-sm"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Store Slogan / Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-3 outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Business Logo Device Upload */}
            <div className="space-y-4 bg-[#111111] p-5 rounded-2xl border border-[#262626]">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-[#262626] pb-2">
                Business Logo (Upload from Device)
              </h4>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-[#1A1A1A] border-2 border-dashed border-[#3A3A3A] flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xl font-black text-[#D4AF37]">DC</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (dataUrl) => setLogoUrl(dataUrl))}
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full px-4 py-2.5 bg-[#2B2B2B] hover:bg-[#383838] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#444444]"
                  >
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>Choose File from Device</span>
                  </button>

                  {logoUrl && (
                    <button
                      onClick={() => setLogoUrl('')}
                      className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Custom Logo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Business Banner File Upload */}
            <div className="space-y-4 bg-[#111111] p-5 rounded-2xl border border-[#262626]">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-[#262626] pb-2">
                Homepage Hero Banner (Upload from Device)
              </h4>

              <input
                type="file"
                ref={bannerInputRef}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, (dataUrl) => setHeroBanner(dataUrl))}
                className="hidden"
              />

              <div className="h-32 rounded-xl bg-[#1A1A1A] border-2 border-dashed border-[#333333] overflow-hidden flex items-center justify-center relative group">
                {heroBanner ? (
                  <img src={heroBanner} alt="Hero Banner" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-500 font-medium">No custom banner uploaded yet</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="flex-1 px-4 py-2.5 bg-[#2B2B2B] hover:bg-[#383838] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#444444]"
                >
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>Select Banner File</span>
                </button>
                {heroBanner && (
                  <button
                    onClick={() => setHeroBanner('')}
                    className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Promotional Poster Upload */}
            <div className="space-y-4 bg-[#111111] p-5 rounded-2xl border border-[#262626]">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-xs border-b border-[#262626] pb-2">
                Promotional Poster Banner (Upload from Device)
              </h4>

              <input
                type="file"
                ref={posterInputRef}
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload(e, (dataUrl) => {
                    updateSettings({ categoryBgImage: dataUrl });
                    alert('Promotional Poster uploaded successfully!');
                  })
                }
                className="hidden"
              />

              <button
                onClick={() => posterInputRef.current?.click()}
                className="w-full py-8 bg-[#1A1A1A] hover:bg-[#222222] border-2 border-dashed border-[#3A3A3A] rounded-xl flex flex-col items-center justify-center gap-2 text-gray-300"
              >
                <Upload className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-xs font-bold">Choose Promotional Poster File</span>
                <span className="text-[10px] text-gray-500">Supports PNG, JPG, WEBP formats</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SECTION 2: WEBSITE APPEARANCE ------------------ */}
      {activeSection === 'appearance' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#D4AF37]" />
              <span>Website Appearance & Themes</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Select complete theme presets, font families, button curves, card styles, and animation toggles.
            </p>
          </div>

          {/* Theme Presets Buttons */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Choose Color Theme Preset
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'dark', name: '🌙 Dark Mode', bg: '#111111', text: '#FFFFFF', primary: '#D4AF37' },
                { id: 'light', name: '☀ Light Executive', bg: '#F8FAFC', text: '#0F172A', primary: '#2563EB' },
                { id: 'black_gold', name: '⚫ Black & Gold', bg: '#0A0A0A', text: '#FFFFFF', primary: '#D4AF37' },
                { id: 'white_gold', name: '⚪ White & Gold', bg: '#FAFAF9', text: '#1C1917', primary: '#B45309' }
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() =>
                    updateSettings({
                      themeMode: th.id.includes('light') || th.id.includes('white') ? 'light' : 'dark',
                      primaryColor: th.primary
                    })
                  }
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    (settings.themeMode === 'light' && th.id.includes('light')) ||
                    (settings.themeMode === 'dark' && th.id.includes('dark'))
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]'
                      : 'border-[#333333] hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: th.bg, color: th.text }}
                >
                  <span className="font-extrabold text-xs">{th.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: th.primary }} />
                    <span className="text-[10px] opacity-70">Primary Tone</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Font Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="text-gray-300 font-bold block">Select Primary Website Font</label>
              <select
                value={settings.headingFont || 'Poppins'}
                onChange={(e) => updateSettings({ headingFont: e.target.value as any, bodyFont: e.target.value as any })}
                className="w-full bg-[#111111] border border-[#333333] text-white p-3 rounded-xl outline-none text-xs font-bold"
              >
                <option value="Poppins">Poppins (Clean Modern Geometry)</option>
                <option value="Inter">Inter (Precision Tech & Density)</option>
                <option value="Montserrat">Montserrat (Luxury Fashion Editorial)</option>
                <option value="DM Sans">DM Sans (High Contrast Modernity)</option>
                <option value="Outfit">Outfit (Futuristic Contemporary)</option>
              </select>
            </div>

            {/* Button Style & Card Style */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Button Corners</label>
                <select
                  value={settings.buttonStyle || 'rounded'}
                  onChange={(e) => updateSettings({ buttonStyle: e.target.value as any })}
                  className="w-full bg-[#111111] border border-[#333333] text-white p-3 rounded-xl outline-none text-xs"
                >
                  <option value="rounded">Rounded Corners</option>
                  <option value="pill">Pill Curves</option>
                  <option value="sharp">Sharp Rectangular</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Card Container Style</label>
                <select
                  value={settings.cardStyle || 'glass'}
                  onChange={(e) => updateSettings({ cardStyle: e.target.value as any })}
                  className="w-full bg-[#111111] border border-[#333333] text-white p-3 rounded-xl outline-none text-xs"
                >
                  <option value="glass">Glassmorphism Blur</option>
                  <option value="flat">Flat Matte</option>
                  <option value="shadow">Soft Elevation Shadow</option>
                  <option value="bordered">Crisp 1px Border</option>
                </select>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-4 bg-[#111111] rounded-2xl border border-[#262626]">
              <div>
                <span className="font-bold text-white text-xs block">Enable Smooth Animations</span>
                <span className="text-[10px] text-gray-400">Micro-interactions, button hovers and page fade transitions</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableAnimations !== false}
                onChange={(e) => updateSettings({ enableAnimations: e.target.checked })}
                className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#111111] rounded-2xl border border-[#262626]">
              <div>
                <span className="font-bold text-white text-xs block">Enable Rounded UI Corners</span>
                <span className="text-[10px] text-gray-400">Applies soft curved corners across all cards and modal dialogs</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableRoundedCorners !== false}
                onChange={(e) => updateSettings({ enableRoundedCorners: e.target.checked })}
                className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SECTION 3: BACKGROUND MANAGER ------------------ */}
      {activeSection === 'background' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
              <span>Background Manager (Direct Device Upload)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Select or replace your store background wallpaper directly from your device storage.
            </p>
          </div>

          <input
            type="file"
            ref={bgImageInputRef}
            accept="image/*"
            onChange={(e) =>
              handleFileUpload(e, (dataUrl) => {
                setPublicBgUrl(dataUrl);
                updateSettings({ publicBgType: 'custom_image', publicBgValue: dataUrl });
                alert('Background Image uploaded and applied!');
              })
            }
            className="hidden"
          />

          {/* Current Background Preview Box */}
          <div className="h-48 rounded-2xl border-2 border-dashed border-[#333333] overflow-hidden relative flex items-center justify-center group bg-[#111111]">
            {publicBgUrl ? (
              <img src={publicBgUrl} alt="Public Background" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-1">
                <ImageIcon className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-xs text-gray-400 font-bold">Standard Store Canvas Background Active</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => bgImageInputRef.current?.click()}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Background Image</span>
            </button>

            {publicBgUrl && (
              <button
                onClick={() => {
                  setPublicBgUrl('');
                  updateSettings({ publicBgType: 'default', publicBgValue: '#111111' });
                }}
                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl flex items-center gap-2 border border-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Custom Background</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ------------------ SECTION 4: SLIDESHOW MANAGER ------------------ */}
      {activeSection === 'slideshow' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Play className="w-5 h-5 text-[#D4AF37]" />
                <span>Homepage Slideshow Manager</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Upload multiple slides, set transition intervals, and reorder slides with one click.
              </p>
            </div>

            <input
              type="file"
              ref={multiSlideInputRef}
              accept="image/*"
              multiple
              onChange={handleMultiFileUpload}
              className="hidden"
            />

            <button
              onClick={() => multiSlideInputRef.current?.click()}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Multiple Slide Images</span>
            </button>
          </div>

          {/* Slide Duration Dropdown & Auto Play Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111111] p-4 rounded-2xl border border-[#262626]">
            <div>
              <label className="text-gray-300 font-bold block mb-1 text-xs">Set Slide Auto-Switch Duration</label>
              <select
                value={settings.slideshowDuration || 5}
                onChange={(e) => updateSettings({ slideshowDuration: parseInt(e.target.value) })}
                className="w-full bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-xl text-xs font-bold outline-none"
              >
                <option value={3}>3 Seconds Interval</option>
                <option value={5}>5 Seconds Interval (Recommended)</option>
                <option value={8}>8 Seconds Interval</option>
                <option value={10}>10 Seconds Interval</option>
              </select>
            </div>

            <div className="flex items-center justify-between px-4 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <div>
                <span className="font-bold text-white text-xs block">Enable Auto Play</span>
                <span className="text-[10px] text-gray-400">Slideshow loops automatically for storefront visitors</span>
              </div>
              <input
                type="checkbox"
                checked={settings.slideshowAutoPlay !== false}
                onChange={(e) => updateSettings({ slideshowAutoPlay: e.target.checked })}
                className="w-5 h-5 accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>

          {/* Slides List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Current Homepage Slides</h4>
            {(settings.slideshows || []).map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="flex items-center justify-between p-3 bg-[#111111] border border-[#2B2B2B] rounded-2xl gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#222222] text-[#D4AF37] font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <img src={slide.imageUrl} alt="Slide" className="w-16 h-12 object-cover rounded-xl border border-[#333333]" />
                  <div>
                    <span className="font-bold text-white text-xs block">{slide.title || 'Slide Title'}</span>
                    <span className="text-[10px] text-gray-400">{slide.subtitle || 'Subtitle text'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = [...(settings.slideshows || [])];
                      if (idx > 0) {
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        updateSettings({ slideshows: updated });
                      }
                    }}
                    disabled={idx === 0}
                    className="p-1.5 bg-[#222222] hover:bg-[#333333] text-white rounded-lg disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const updated = [...(settings.slideshows || [])];
                      if (idx < updated.length - 1) {
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        updateSettings({ slideshows: updated });
                      }
                    }}
                    disabled={idx === (settings.slideshows?.length || 0) - 1}
                    className="p-1.5 bg-[#222222] hover:bg-[#333333] text-white rounded-lg disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const updated = (settings.slideshows || []).filter((_, i) => i !== idx);
                      updateSettings({ slideshows: updated });
                    }}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------ SECTION 5: BUSINESS HOURS DROPDOWN TABLE ------------------ */}
      {activeSection === 'hours' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span>Business Operating Hours (Dropdown Selection)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Select opening and closing times for each day of the week using simple dropdown menus.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2B2B2B] text-gray-400 font-bold uppercase text-[10px]">
                  <th className="p-3">Day of Week</th>
                  <th className="p-3">Opening Time</th>
                  <th className="p-3">Closing Time</th>
                  <th className="p-3 text-center">Mark Closed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {schedule.map((item, index) => (
                  <tr key={item.day} className={`hover:bg-[#141414] ${item.isClosed ? 'opacity-50' : ''}`}>
                    <td className="p-3 font-bold text-white text-xs">{item.day}</td>
                    <td className="p-3">
                      <select
                        value={item.openTime}
                        disabled={item.isClosed}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[index].openTime = e.target.value;
                          setSchedule(updated);
                        }}
                        className="bg-[#111111] border border-[#333333] text-white text-xs rounded-xl p-2 outline-none disabled:opacity-30"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={item.closeTime}
                        disabled={item.isClosed}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[index].closeTime = e.target.value;
                          setSchedule(updated);
                        }}
                        className="bg-[#111111] border border-[#333333] text-white text-xs rounded-xl p-2 outline-none disabled:opacity-30"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.isClosed}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[index].isClosed = e.target.checked;
                          setSchedule(updated);
                        }}
                        className="w-5 h-5 accent-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------ SECTION 6: SOCIAL MEDIA ACCOUNTS ------------------ */}
      {activeSection === 'socials' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#D4AF37]" />
              <span>Official Social Media Platforms</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Enter official usernames and numbers to display verified badges across customer touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { key: 'whatsapp', name: 'WhatsApp Business', icon: '📱', placeholder: '+254712345678' },
              { key: 'facebook', name: 'Facebook Page', icon: '📘', placeholder: 'decentcollectionke' },
              { key: 'instagram', name: 'Instagram Profile', icon: '📸', placeholder: 'decentcollection.co.ke' },
              { key: 'tiktok', name: 'TikTok Account', icon: '🎵', placeholder: '@decentcollection' },
              { key: 'youtube', name: 'YouTube Channel', icon: '▶', placeholder: 'DecentCollectionOfficial' },
              { key: 'twitter', name: 'X (Twitter)', icon: '🐦', placeholder: '@decent_ke' },
              { key: 'linkedin', name: 'LinkedIn Company', icon: '💼', placeholder: 'decent-collection-kenya' },
              { key: 'pinterest', name: 'Pinterest Board', icon: '📌', placeholder: 'decentcollection' },
              { key: 'telegram', name: 'Telegram Channel', icon: '✈', placeholder: 'decentcollectionke' }
            ].map((plat) => (
              <div key={plat.key} className="p-4 bg-[#111111] border border-[#262626] rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{plat.icon}</span>
                  <span className="font-bold text-white">{plat.name}</span>
                </div>
                <input
                  type="text"
                  value={(socials as any)[plat.key] || ''}
                  onChange={(e) => setSocials({ ...socials, [plat.key]: e.target.value })}
                  placeholder={plat.placeholder}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-xl outline-none font-mono text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------ SECTION 7: SHOP LOCATION & MAP ------------------ */}
      {activeSection === 'location' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span>Shop Location & Physical Store Address</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Select your flagship shop location or update physical street directions.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-2">Select Preset Flagship Location</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SHOP_LOCATION_PRESETS.map((loc) => (
                  <div
                    key={loc.name}
                    onClick={() => setAddress(loc.address)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      address === loc.address ? 'bg-[#222222] border-[#D4AF37]' : 'bg-[#111111] border-[#2B2B2B]'
                    }`}
                  >
                    <span className="font-bold text-white text-xs block">{loc.name}</span>
                    <span className="text-[10px] text-gray-400 mt-1 block">{loc.address}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Custom Business Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] text-white p-3 rounded-xl outline-none text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SECTION 8: SHOP CATEGORIES ------------------ */}
      {activeSection === 'categories' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#D4AF37]" />
              <span>Shop Category Management</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Add, edit, hide, or reorder categories. New categories appear automatically across the website.
            </p>
          </div>

          {/* Add Category Form */}
          <div className="flex gap-2 bg-[#111111] p-3 rounded-2xl border border-[#262626]">
            <input
              type="text"
              placeholder="Emoji Icon (e.g. 🧥)"
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="w-20 bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-xl text-center text-sm outline-none"
            />
            <input
              type="text"
              placeholder="New Category Name (e.g. Leather Jackets)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-xl text-xs outline-none"
            />
            <button
              onClick={() => {
                if (newCatName.trim()) {
                  const id = newCatName.toLowerCase().replace(/[^a-z0-0]/g, '_');
                  setCategories([...categories, { id, name: newCatName.trim(), icon: newCatIcon || '🛍️', hidden: false }]);
                  setNewCatName('');
                }
              }}
              className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Existing Categories List */}
          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 bg-[#111111] border border-[#262626] rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className={`font-bold text-xs ${cat.hidden ? 'line-through text-gray-500' : 'text-white'}`}>
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = [...categories];
                      updated[idx].hidden = !updated[idx].hidden;
                      setCategories(updated);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                      cat.hidden ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {cat.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{cat.hidden ? 'Hidden' : 'Visible'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCategories(categories.filter((_, i) => i !== idx));
                    }}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

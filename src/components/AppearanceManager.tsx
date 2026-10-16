import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Palette, Image as ImageIcon, Type, Layout, Shield, Sparkles, RefreshCw, 
  Check, User, Video, Moon, Sun, Layers, Pipette, Sliders, Pin, Play, ChevronRight, Wand2
} from 'lucide-react';

export const BUILTIN_WALLPAPERS = [
  {
    id: 'dark_marble',
    name: 'Executive Dark Marble',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'gold_mesh',
    name: 'Gold & Obsidian Mesh',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1600&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'boutique_lounge',
    name: 'European Luxury Boutique',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'midnight_obsidian',
    name: 'Midnight Obsidian',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sapphire_studio',
    name: 'Royal Sapphire Studio',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'mahogany_office',
    name: 'Classic Mahogany Wood',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'slate_minimalist',
    name: 'Slate Minimalist Concrete',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop'
  }
];

export const GRADIENTS_LIST = [
  { id: 'gold_grad', name: 'Gold Luxury Gradient', value: 'linear-gradient(135deg, #111111 0%, #1A1810 50%, #2A2208 100%)' },
  { id: 'royal_velvet', name: 'Royal Velvet Dark', value: 'linear-gradient(135deg, #0B0E14 0%, #141A29 50%, #1A233A 100%)' },
  { id: 'emerald_deep', name: 'Emerald Prestige', value: 'linear-gradient(135deg, #0A140E 0%, #102418 50%, #183824 100%)' },
  { id: 'monochrome_slate', name: 'Monochrome Titanium', value: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)' },
  { id: 'light_executive', name: 'Classic Executive Light', value: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)' }
];

export const THEME_PRESETS = [
  {
    id: 'luxury_gold',
    name: 'Luxury Gold & Black',
    primary: '#D4AF37',
    secondary: '#1A1A1A',
    accent: '#F3E5AB',
    cardStyle: 'glass',
    buttonStyle: 'rounded',
    desc: 'Deep obsidian canvas framed with warm brushed 24k gold accents.'
  },
  {
    id: 'classic_executive',
    name: 'Classic Executive Light',
    primary: '#1E293B',
    secondary: '#FFFFFF',
    accent: '#2563EB',
    cardStyle: 'shadow',
    buttonStyle: 'rounded',
    desc: 'Clean corporate white canvas with crisp dark slate headers and royal blue highlights.'
  },
  {
    id: 'royal_navy',
    name: 'Royal Navy & Silver',
    primary: '#38BDF8',
    secondary: '#0F172A',
    accent: '#E2E8F0',
    cardStyle: 'bordered',
    buttonStyle: 'pill',
    desc: 'Deep oceanic midnight canvas with futuristic cyan & polished silver geometry.'
  },
  {
    id: 'emerald_prestige',
    name: 'Emerald Prestige',
    primary: '#10B981',
    secondary: '#064E3B',
    accent: '#A7F3D0',
    cardStyle: 'glass',
    buttonStyle: 'rounded',
    desc: 'Deep emerald forest background with vibrant mint highlights.'
  },
  {
    id: 'rose_gold',
    name: 'Rose Gold Chic',
    primary: '#FB7185',
    secondary: '#1F191B',
    accent: '#FECDD3',
    cardStyle: 'glass',
    buttonStyle: 'pill',
    desc: 'Sophisticated rose quartz gold paired with dark copper accents.'
  }
];

export const FONTS_LIST = [
  { name: 'Poppins', type: 'Sans-Serif', desc: 'Modern geometric, clean & highly readable' },
  { name: 'Inter', type: 'Sans-Serif', desc: 'Precision tech font designed for high density UI' },
  { name: 'Montserrat', type: 'Sans-Serif', desc: 'Bold, structured & luxury brand editorial look' },
  { name: 'DM Sans', type: 'Sans-Serif', desc: 'Soft geometry with high contrast letterforms' },
  { name: 'Manrope', type: 'Sans-Serif', desc: 'Contemporary minimalist European typography' },
  { name: 'Outfit', type: 'Sans-Serif', desc: 'Sleek, futuristic & luxury fashion aesthetic' },
  { name: 'Playfair Display', type: 'Serif', desc: 'High-end luxury editorial headline typography' }
];

export const AppearanceManager: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'workspace' | 'theme' | 'storefront' | 'typography' | 'personalization'>('workspace');

  // Local Form State
  const [adminName, setAdminName] = useState(settings.adminName || 'Mrs. Waithaka');
  const [adminTitle, setAdminTitle] = useState(settings.adminTitle || 'Managing Director & Store Founder');
  const [adminAvatarUrl, setAdminAvatarUrl] = useState(settings.adminAvatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop');
  const [adminWelcomeMessage, setAdminWelcomeMessage] = useState(settings.adminWelcomeMessage || 'Welcome to your Decent Collection Executive Portal.');
  
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState(settings.heroVideoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#D4AF37');
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || '#1A1A1A');
  const [accentColor, setAccentColor] = useState(settings.accentColor || '#F3E5AB');
  const [buttonStyle, setButtonStyle] = useState<'rounded' | 'pill' | 'sharp'>(settings.buttonStyle || 'rounded');
  const [cardStyle, setCardStyle] = useState<'glass' | 'flat' | 'shadow' | 'bordered'>(settings.cardStyle || 'glass');

  const [headingFont, setHeadingFont] = useState(settings.headingFont || 'Poppins');
  const [bodyFont, setBodyFont] = useState(settings.bodyFont || 'Inter');
  const [letterSpacing, setLetterSpacing] = useState(settings.letterSpacing || 'wide');

  const [categoryBgImage, setCategoryBgImage] = useState(settings.categoryBgImage || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop');
  const [footerBgImage, setFooterBgImage] = useState(settings.footerBgImage || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop');

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    updateSettings({
      themePreset: preset.id as any,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      cardStyle: preset.cardStyle as any,
      buttonStyle: preset.buttonStyle as any
    });
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    setCardStyle(preset.cardStyle as any);
    setButtonStyle(preset.buttonStyle as any);
  };

  const handleSaveAll = () => {
    updateSettings({
      adminName,
      adminTitle,
      adminAvatarUrl,
      adminWelcomeMessage,
      primaryColor,
      secondaryColor,
      accentColor,
      buttonStyle,
      cardStyle,
      headingFont: headingFont as any,
      bodyFont: bodyFont as any,
      letterSpacing: letterSpacing as any,
      categoryBgImage,
      footerBgImage,
      heroVideoUrl: customVideoUrl
    });
    alert('✅ Workspace theme, background & typography preferences updated successfully!');
  };

  const handleResetBackground = () => {
    updateSettings({
      adminBgType: 'wallpaper',
      adminBgValue: 'dark_marble',
      adminGlassmorphism: true,
      adminThemeMode: 'dark'
    });
    alert('Reset workspace background to Executive Dark Marble default.');
  };

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#222222] to-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#262626] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-xl">
              <Wand2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  EXECUTIVE CUSTOMIZER
                </span>
                <span className="text-xs text-gray-400">Live Real-time Rendering</span>
              </div>
              <h2 className="text-2xl font-black text-white font-heading mt-1 tracking-tight">
                Workspace Background & Theme Engine
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Tailor your administrator workspace wallpaper, dark/light modes, color presets, public storefront design, and typography.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetBackground}
              className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-gray-300 font-bold text-xs uppercase rounded-xl border border-[#3A3A3A] flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#2B2B2B] overflow-x-auto scrollbar-none">
          {[
            { id: 'workspace', label: '1. Admin Workspace Backgrounds', icon: ImageIcon },
            { id: 'theme', label: '2. Theme Presets & Palette', icon: Palette },
            { id: 'storefront', label: '3. Public Storefront Media', icon: Layout },
            { id: 'typography', label: '4. Fonts & Typography', icon: Type },
            { id: 'personalization', label: '5. Executive Personalization', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* ------------------ SUB-TAB 1: ADMIN WORKSPACE BACKGROUNDS ------------------ */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* Active Background Status Bar */}
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                <span>Current Background Setting:</span>
                <span className="text-[#D4AF37] capitalize font-mono text-xs bg-[#2B2B2B] px-2.5 py-1 rounded-lg border border-[#3A3A3A]">
                  {settings.adminBgType || 'wallpaper'} ({settings.adminBgValue || 'dark_marble'})
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Choose between elegant wallpapers, soft solid tones, rich dark gradients, or upload custom imagery & motion video backgrounds.
              </p>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateSettings({ adminGlassmorphism: !settings.adminGlassmorphism })}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                  settings.adminGlassmorphism
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-[#222222] border-[#333333] text-gray-400'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Glassmorphism Cards: {settings.adminGlassmorphism ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => updateSettings({ adminThemeMode: settings.adminThemeMode === 'light' ? 'dark' : 'light' })}
                className="px-3 py-2 bg-[#222222] border border-[#333333] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#2B2B2B]"
              >
                {settings.adminThemeMode === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>Admin Mode: {settings.adminThemeMode === 'light' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* 1. Built-in Premium Wallpapers */}
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
              <span>Built-in Luxury Wallpapers</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BUILTIN_WALLPAPERS.map((wp) => {
                const isSelected = settings.adminBgType === 'wallpaper' && settings.adminBgValue === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => updateSettings({ adminBgType: 'wallpaper', adminBgValue: wp.id })}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer group transition-all h-36 ${
                      isSelected ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/20 scale-[1.02]' : 'border-[#333333] hover:border-gray-500'
                    }`}
                  >
                    <img src={wp.preview} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white drop-shadow">{wp.name}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-black text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Gradients & Solid Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>Executive Gradients</span>
              </h3>
              <div className="space-y-3">
                {GRADIENTS_LIST.map((g) => {
                  const isSelected = settings.adminBgType === 'gradient' && settings.adminBgValue === g.value;
                  return (
                    <div
                      key={g.id}
                      onClick={() => updateSettings({ adminBgType: 'gradient', adminBgValue: g.value })}
                      style={{ background: g.value }}
                      className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : 'border-[#333333] hover:border-gray-500'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-white drop-shadow">{g.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Pipette className="w-5 h-5 text-[#D4AF37]" />
                <span>Solid Professional Colors</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Onyx Black', hex: '#0B0B0B' },
                  { name: 'Midnight Graphite', hex: '#141416' },
                  { name: 'Deep Slate', hex: '#1E1E24' },
                  { name: 'Corporate Charcoal', hex: '#26262B' },
                  { name: 'Executive Off-White', hex: '#F8FAFC' },
                  { name: 'Warm Vanilla', hex: '#FAF9F5' }
                ].map((col) => {
                  const isSelected = settings.adminBgType === 'solid' && settings.adminBgValue === col.hex;
                  return (
                    <button
                      key={col.hex}
                      onClick={() => updateSettings({ adminBgType: 'solid', adminBgValue: col.hex })}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : 'border-[#333333] hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      <span className="w-5 h-5 rounded-full border border-gray-400" style={{ backgroundColor: col.hex }} />
                      <span className={`text-xs font-bold ${col.hex.startsWith('#F') ? 'text-black' : 'text-white'}`}>
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Upload Custom Wallpaper or Video Background */}
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Video className="w-5 h-5 text-[#D4AF37]" />
              <span>Custom Image or Motion Video Background URL</span>
            </h3>
            <p className="text-xs text-gray-400">
              Provide a direct image URL or MP4 motion video URL to set as your workspace background.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">Custom Background Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/your-custom-wallpaper.jpg"
                    value={customBgUrl}
                    onChange={(e) => setCustomBgUrl(e.target.value)}
                    className="flex-1 bg-[#111111] border border-[#333333] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                  <button
                    onClick={() => {
                      if (customBgUrl) {
                        updateSettings({ adminBgType: 'custom_image', adminBgValue: customBgUrl });
                        alert('Custom background image applied!');
                      }
                    }}
                    className="px-4 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1">Custom Background Motion Video URL (.mp4)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/video-background.mp4"
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                    className="flex-1 bg-[#111111] border border-[#333333] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                  <button
                    onClick={() => {
                      if (customVideoUrl) {
                        updateSettings({ adminBgType: 'custom_video', adminBgValue: customVideoUrl, heroVideoUrl: customVideoUrl });
                        alert('Custom video background applied!');
                      }
                    }}
                    className="px-4 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SUB-TAB 2: THEME PRESETS & COLOR PALETTE ------------------ */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          {/* 1. Theme Presets */}
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>1-Click Theme Presets</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {THEME_PRESETS.map((preset) => {
                const isActive = settings.themePreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 bg-[#111111] ${
                      isActive ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]' : 'border-[#2B2B2B] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{preset.name}</h4>
                      {isActive && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed">{preset.desc}</p>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#222222]">
                      <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} title="Primary" />
                      <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.secondary }} title="Secondary" />
                      <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }} title="Accent" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Custom Color Palette & Live Interactive Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#D4AF37]" />
                <span>Custom Color Pickers</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Primary Highlight Color (Buttons / Accents)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl text-xs font-mono w-32"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Secondary Canvas / Card Dark Tone</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl text-xs font-mono w-32"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Accent Highlight Tone</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl text-xs font-mono w-32"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Button Corners</label>
                    <select
                      value={buttonStyle}
                      onChange={(e) => setButtonStyle(e.target.value as any)}
                      className="w-full bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl text-xs"
                    >
                      <option value="rounded">Rounded (Standard)</option>
                      <option value="pill">Pill (Full Curved)</option>
                      <option value="sharp">Sharp (Executive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Card Container Style</label>
                    <select
                      value={cardStyle}
                      onChange={(e) => setCardStyle(e.target.value as any)}
                      className="w-full bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl text-xs"
                    >
                      <option value="glass">Glassmorphism Blur</option>
                      <option value="flat">Flat Matte</option>
                      <option value="shadow">Elevated Soft Shadow</option>
                      <option value="bordered">Crisp 1px Border</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#D4AF37]" />
                <span>Live Card Preview</span>
              </h3>

              <div
                style={{ backgroundColor: secondaryColor }}
                className={`p-6 border border-white/10 ${
                  cardStyle === 'glass'
                    ? 'backdrop-blur-md bg-black/60'
                    : cardStyle === 'shadow'
                    ? 'shadow-2xl'
                    : ''
                } ${
                  buttonStyle === 'pill' ? 'rounded-3xl' : buttonStyle === 'sharp' ? 'rounded-none' : 'rounded-2xl'
                } space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ color: primaryColor }}
                    className="text-xs font-black uppercase tracking-widest"
                  >
                    Product Preview Card
                  </span>
                  <span
                    style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    BESTSELLER
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white font-heading">
                  Italian Leather Double-Monk Shoe
                </h4>

                <p className="text-xs text-gray-300">
                  Polished calfskin leather crafted in Florence, Italy.
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span style={{ color: accentColor }} className="text-base font-black">
                    KSh 12,500
                  </span>

                  <button
                    style={{ backgroundColor: primaryColor, color: '#000' }}
                    className={`px-4 py-2 font-black text-xs uppercase shadow-lg ${
                      buttonStyle === 'pill'
                        ? 'rounded-full'
                        : buttonStyle === 'sharp'
                        ? 'rounded-none'
                        : 'rounded-xl'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SUB-TAB 3: PUBLIC STOREFRONT MEDIA ------------------ */}
      {activeTab === 'storefront' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#D4AF37]" />
              <span>Public Website Media & Section Backgrounds</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Set custom background images and motion headers for public storefront sections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="text-gray-300 font-bold block mb-1">Featured Categories Section Background</label>
              <input
                type="url"
                value={categoryBgImage}
                onChange={(e) => setCategoryBgImage(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl outline-none"
              />
              <div className="mt-2 h-24 rounded-xl overflow-hidden border border-[#333333]">
                <img src={categoryBgImage} alt="Category Background" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Footer Section Background Image</label>
              <input
                type="url"
                value={footerBgImage}
                onChange={(e) => setFooterBgImage(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl outline-none"
              />
              <div className="mt-2 h-24 rounded-xl overflow-hidden border border-[#333333]">
                <img src={footerBgImage} alt="Footer Background" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SUB-TAB 4: FONTS & TYPOGRAPHY ------------------ */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Type className="w-5 h-5 text-[#D4AF37]" />
                <span>Executive Typography Engine</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Select your preferred font pairings for section headers and body text across both public website and manager dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-2">Primary Heading Font</label>
                <div className="space-y-2">
                  {FONTS_LIST.map((f) => (
                    <div
                      key={f.name}
                      onClick={() => setHeadingFont(f.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        headingFont === f.name ? 'bg-[#222222] border-[#D4AF37]' : 'bg-[#111111] border-[#2B2B2B]'
                      }`}
                    >
                      <div>
                        <span style={{ fontFamily: f.name }} className="text-sm font-bold text-white block">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-gray-400">{f.desc}</span>
                      </div>
                      {headingFont === f.name && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-2">Body Text Font</label>
                <div className="space-y-2">
                  {FONTS_LIST.filter(f => f.type === 'Sans-Serif').map((f) => (
                    <div
                      key={f.name}
                      onClick={() => setBodyFont(f.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        bodyFont === f.name ? 'bg-[#222222] border-[#D4AF37]' : 'bg-[#111111] border-[#2B2B2B]'
                      }`}
                    >
                      <div>
                        <span style={{ fontFamily: f.name }} className="text-sm font-medium text-white block">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-gray-400">{f.desc}</span>
                      </div>
                      {bodyFont === f.name && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography Live Specimen */}
            <div className="p-6 bg-[#111111] border border-[#2B2B2B] rounded-2xl space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">
                Real-Time Typography Specimen
              </span>
              <h2 style={{ fontFamily: headingFont }} className="text-2xl font-bold text-white tracking-wide">
                Decent Collection Executive Luxury Fashion
              </h2>
              <p style={{ fontFamily: bodyFont }} className="text-xs text-gray-300 leading-relaxed">
                Handcrafted Italian leather footwear, bespoke European wool suits, and non-iron Egyptian cotton formal shirts. Designed for Kenyan gentlemen seeking uncompromising prestige.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SUB-TAB 5: EXECUTIVE PERSONALIZATION ------------------ */}
      {activeTab === 'personalization' && (
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <User className="w-5 h-5 text-[#D4AF37]" />
              <span>Administrator Personalization & Profile</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Personalize your manager profile, display title, welcome greeting, and quick dashboard preferences.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 bg-[#111111] border border-[#2B2B2B] rounded-2xl">
              <img src={adminAvatarUrl} alt="Manager Profile" className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]" />
              <div className="flex-1">
                <label className="text-gray-300 font-bold block mb-1">Profile Photo Image URL</label>
                <input
                  type="url"
                  value={adminAvatarUrl}
                  onChange={(e) => setAdminAvatarUrl(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white p-2 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Manager Display Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Executive Title</label>
                <input
                  type="text"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  className="w-full bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Dashboard Executive Welcome Message</label>
              <textarea
                rows={3}
                value={adminWelcomeMessage}
                onChange={(e) => setAdminWelcomeMessage(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] text-white p-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveAll}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

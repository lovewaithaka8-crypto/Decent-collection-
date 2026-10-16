import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SlideshowItem } from '../types';
import { Image as ImageIcon, Plus, Trash2, ArrowUp, ArrowDown, Save, Layers } from 'lucide-react';

export const SlideshowManager: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const slides = settings.slideshows || [
    {
      id: 'sl1',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
      title: 'LUXURY EXECUTIVE SUITS & BLAZERS',
      subtitle: 'Bespoke European Cut • 100% Fine Wool Blend',
      buttonText: 'SHOP SUITS NOW'
    },
    {
      id: 'sl2',
      imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1600&auto=format&fit=crop',
      title: 'AUTHENTIC ITALIAN LEATHER FOOTWEAR',
      subtitle: 'Polished Oxfords, Penny Loafers & Dress Boots',
      buttonText: 'BROWSE FOOTWEAR'
    }
  ];

  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newBtn, setNewBtn] = useState('EXPLORE COLLECTION');

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) return;

    const newSlide: SlideshowItem = {
      id: 'sl_' + Date.now(),
      imageUrl: newUrl.trim(),
      title: newTitle.trim(),
      subtitle: newSubtitle.trim(),
      buttonText: newBtn.trim()
    };

    const updated = [...slides, newSlide];
    updateSettings({ slideshows: updated });
    setNewUrl('');
    setNewTitle('');
    setNewSubtitle('');
    alert('New Slideshow Banner added live!');
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm('Delete this slideshow banner slide?')) {
      const updated = slides.filter(s => s.id !== id);
      updateSettings({ slideshows: updated });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const copy = [...slides];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    updateSettings({ slideshows: copy });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#D4AF37]" />
              <span>Super Admin - Homepage Slideshow & Banner Manager</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Manage hero slideshow images, headlines, taglines, and call-to-action buttons.
            </p>
          </div>
        </div>

        {/* Add New Slide Form */}
        <form onSubmit={handleAddSlide} className="bg-[#111111] p-4 rounded-xl border border-[#222222] space-y-3 mb-6">
          <h3 className="font-bold text-[#D4AF37] text-xs uppercase tracking-wider">➕ Add New Hero Slide</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-gray-300 block mb-1 font-semibold">Image URL *</label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-lg outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-gray-300 block mb-1 font-semibold">Headline Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. LUXURY ITALIAN LEATHER COLLECTION"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-lg outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-gray-300 block mb-1 font-semibold">Subtitle Description</label>
              <input
                type="text"
                placeholder="e.g. Handcrafted in Milan • Genuine Grain Leather"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-lg outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-gray-300 block mb-1 font-semibold">Button Action Text</label>
              <input
                type="text"
                value={newBtn}
                onChange={(e) => setNewBtn(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] text-white p-2.5 rounded-lg outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#D4AF37] text-black font-extrabold text-xs rounded-lg uppercase shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Hero Banner Slide</span>
          </button>
        </form>

        {/* Existing Slides List */}
        <div className="space-y-4">
          {slides.map((sl, idx) => (
            <div key={sl.id} className="bg-[#111111] border border-[#2B2B2B] rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
              <img
                src={sl.imageUrl}
                alt={sl.title}
                className="w-32 h-20 object-cover rounded-lg border border-[#333333] shrink-0"
              />

              <div className="flex-1 space-y-1 text-xs">
                <h4 className="font-bold text-white text-sm font-heading">{sl.title}</h4>
                <p className="text-gray-400">{sl.subtitle}</p>
                <div className="inline-block px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] font-mono font-bold text-[10px] rounded uppercase">
                  Btn: {sl.buttonText}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 bg-[#1A1A1A] text-gray-300 rounded hover:bg-[#2B2B2B] disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === slides.length - 1}
                  className="p-2 bg-[#1A1A1A] text-gray-300 rounded hover:bg-[#2B2B2B] disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSlide(sl.id)}
                  className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

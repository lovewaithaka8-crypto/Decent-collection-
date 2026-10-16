import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { VIPClubSection } from './VIPClubSection';
import { 
  Sparkles, ShieldCheck, ArrowRight, Star, 
  Award, Clock, ChevronLeft, ChevronRight, Mail, CheckCircle2
} from 'lucide-react';

interface CustomerStoreProps {
  onQuickView: (product: Product) => void;
}

export const CustomerStore: React.FC<CustomerStoreProps> = ({ onQuickView }) => {
  const { 
    products, activeCategory, setActiveCategory, searchQuery, 
    settings, setViewMode, isLoggedIn, reviews 
  } = useStore();

  const [selectedSubCategory, setSelectedSubCategory] = useState<'all' | 'shoes' | 'suits' | 'shirts' | 'jeans' | 'accessories'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const heroImages = settings.heroBanners && settings.heroBanners.length > 0
    ? settings.heroBanners
    : [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop'
      ];

  // Auto slide timer
  useEffect(() => {
    if (activeCategory !== 'all' || searchQuery) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length, activeCategory, searchQuery]);

  // Filter Products
  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'shoes' && p.category !== 'shoes') return false;
    if (activeCategory === 'clothing' && !['suits', 'shirts', 'jeans'].includes(p.category)) return false;
    if (activeCategory === 'new' && !p.isNew) return false;
    if (activeCategory === 'offers' && !p.isOffer) return false;
    
    if (selectedSubCategory !== 'all' && p.category !== selectedSubCategory) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const bestSellers = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNew);
  const specialOffers = products.filter(p => p.isOffer);

  const categoriesList = settings.customCategories && settings.customCategories.length > 0
    ? settings.customCategories.filter(c => !c.hidden)
    : [
        { id: 'suits', name: 'Suits', icon: '👔', hidden: false },
        { id: 'shirts', name: 'Shirts', icon: '👕', hidden: false },
        { id: 'jeans', name: 'Jeans', icon: '👖', hidden: false },
        { id: 'shoes', name: 'Shoes', icon: '👞', hidden: false },
        { id: 'accessories', name: 'Accessories', icon: '⌚', hidden: false }
      ];

  const featuredCategories = categoriesList.map(cat => ({
    id: cat.id,
    label: cat.name,
    icon: cat.icon,
    image: products.find(p => p.category === cat.id)?.image || 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop',
    count: products.filter(p => p.category === cat.id).length
  }));

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 5000);
    }
  };

  return (
    <div className="space-y-16">
      {/* ------------------ HERO SLIDER SECTION ------------------ */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="relative overflow-hidden bg-black text-white h-[480px] sm:h-[580px] border-b border-[#222222]">
          {/* Background Images Slider */}
          {heroImages.map((imgUrl, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(17,17,17,0.9)), url(${imgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transitionProperty: 'opacity, transform'
              }}
            />
          ))}

          {/* Hero Content Overlay */}
          <div className="relative z-10 container mx-auto h-full px-4 flex flex-col justify-center items-center text-center max-w-4xl space-y-6">
            <div className="flex items-center gap-2 bg-black/60 border border-[#D4AF37]/50 px-4 py-1.5 rounded-full text-xs text-[#D4AF37] font-semibold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Authentic Men's Luxury Wear in Kenya</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-heading uppercase text-white leading-tight">
              {settings.shopName.toUpperCase()} <br />
              <span className="text-[#D4AF37] font-heading font-normal">LUXURY COLLECTION</span>
            </h1>

            <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Tailored for the modern gentleman. Handcrafted Italian leather footwear, bespoke executive suits, Egyptian cotton formal shirts, and luxury stretch denim.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={scrollToCatalog}
                className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToCatalog}
                className="px-8 py-3.5 bg-black/50 hover:bg-black/80 border border-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all backdrop-blur-sm"
              >
                View Collection
              </button>
            </div>
          </div>

          {/* Slider Prev / Next Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 border border-[#D4AF37]/40 text-white flex items-center justify-center transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 border border-[#D4AF37]/40 text-white flex items-center justify-center transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-[#D4AF37] w-8' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------ FEATURED CATEGORIES ------------------ */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-widest block">
              DISCOVER OUR DEPARTMENTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Featured Categories
            </h2>
            <p className="text-xs text-gray-400">
              Curated luxury wardrobe essentials tailored for distinction and elegance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  if (['suits', 'shirts', 'jeans'].includes(cat.id)) {
                    setActiveCategory('clothing');
                    setSelectedSubCategory(cat.id as any);
                  } else {
                    setActiveCategory(cat.id);
                  }
                  scrollToCatalog();
                }}
                className="group relative h-64 rounded-2xl overflow-hidden border border-[#2B2B2B] hover:border-[#D4AF37] cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-end p-4"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="relative z-10 space-y-1">
                  <span className="text-2xl block">{cat.icon}</span>
                  <h3 className="font-bold text-white text-base font-heading group-hover:text-[#D4AF37] transition-colors">
                    {cat.label}
                  </h3>
                  <span className="text-[11px] text-gray-300 block">
                    {cat.count} Items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------ PROMOTIONS & OFFERS BANNER ------------------ */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1C160B] via-[#2A210E] to-[#1C160B] border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-3 text-center md:text-left max-w-2xl relative z-10">
              <span className="inline-block bg-[#D4AF37] text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                🔥 EXCLUSIVE PROMOTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {settings.promoBannerText || "Mid-Year Gentlemen's Luxury Sale"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Use code <strong className="text-[#D4AF37] font-mono font-bold bg-black/60 px-2 py-0.5 rounded border border-[#D4AF37]/30">{settings.promoCode || 'DECENT15'}</strong> at checkout for special discount on all orders above KSh 10,000.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCategory('offers');
                scrollToCatalog();
              }}
              className="relative z-10 px-8 py-4 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#c39e2d] transition-transform active:scale-95 shrink-0 shadow-lg shadow-[#D4AF37]/20"
            >
              Shop Promoted Offers
            </button>
          </div>
        </section>
      )}

      {/* ------------------ NEW ARRIVALS CAROUSEL/GRID ------------------ */}
      {activeCategory === 'all' && !searchQuery && newArrivals.length > 0 && (
        <section className="container mx-auto px-4 space-y-6">
          <div className="flex justify-between items-end border-b border-[#262626] pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-widest block">
                JUST LANDED
              </span>
              <h2 className="text-2xl font-extrabold text-white font-heading">
                ⭐ New Arrivals
              </h2>
            </div>
            <button
              onClick={() => { setActiveCategory('new'); scrollToCatalog(); }}
              className="text-xs text-[#D4AF37] font-bold hover:underline flex items-center gap-1"
            >
              View All New Arrivals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------ MAIN PRODUCT CATALOG SECTION ------------------ */}
      <section id="catalog-section" className="container mx-auto px-4 space-y-6">
        {/* Category Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#262626] pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-heading capitalize flex items-center gap-2">
              <span>
                {activeCategory === 'shoes' && '👞 Footwear & Shoes'}
                {activeCategory === 'clothing' && '👔 Clothing & Suits'}
                {activeCategory === 'new' && '⭐ New Arrivals'}
                {activeCategory === 'offers' && '🔥 Special Offers'}
                {activeCategory === 'all' && '🛍️ Complete Collection'}
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Showing {filteredProducts.length} premium items in Kenyan Shillings (KSh)
            </p>
          </div>

          {/* Subcategory Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'shoes', label: 'Shoes 👞' },
              { id: 'suits', label: 'Suits 👔' },
              { id: 'shirts', label: 'Shirts 👕' },
              { id: 'jeans', label: 'Jeans 👖' },
              { id: 'accessories', label: 'Accessories ⌚' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(sub.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedSubCategory === sub.id
                    ? 'bg-[#D4AF37] text-black shadow'
                    : 'bg-[#1F1F1F] text-gray-300 hover:bg-[#2A2A2A]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#161616] border border-[#262626] rounded-2xl text-gray-400 space-y-3">
            <p className="text-base font-semibold text-white">No products match your selected filters.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedSubCategory('all');
              }}
              className="px-6 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-lg uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ------------------ BEST SELLERS SECTION ------------------ */}
      {activeCategory === 'all' && !searchQuery && bestSellers.length > 0 && (
        <section className="container mx-auto px-4 space-y-6">
          <div className="flex justify-between items-end border-b border-[#262626] pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-widest block">
                MOST POPULAR
              </span>
              <h2 className="text-2xl font-extrabold text-white font-heading">
                🔥 Best Sellers
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------ CUSTOMER REVIEWS & TESTIMONIALS ------------------ */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="container mx-auto px-4 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-widest block">
              GENTLEMEN'S FEEDBACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Customer Reviews
            </h2>
            <p className="text-xs text-gray-400">
              Hear what our distinguished clients in Kenya say about Decent Collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="bg-[#161616] border border-[#2B2B2B] p-6 rounded-2xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-[#D4AF37]' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#262626] flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{rev.customerName}</span>
                  <span className="text-gray-500 text-[11px]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------ ABOUT US SECTION ------------------ */}
      {activeCategory === 'all' && !searchQuery && (
        <section id="about-section" className="bg-[#141414] border-y border-[#222222] py-16 px-4">
          <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-widest block">
                THE DECENT STORY
              </span>
              <h2 className="text-3xl font-extrabold text-white font-heading">
                {settings.aboutUsTitle || "Crafted for Style, Built for Comfort"}
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                {settings.aboutUsText || "Founded in Nairobi CBD, Decent Collection was established with a singular vision: bringing world-class European men's fashion and authentic Italian leather footwear directly to Kenyan gentlemen."}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#222222]">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#D4AF37]" />
                  <div>
                    <div className="font-bold text-white text-sm">100% Genuine</div>
                    <div className="text-[11px] text-gray-400">Leather Guarantee</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-[#D4AF37]" />
                  <div>
                    <div className="font-bold text-white text-sm">Same-Day</div>
                    <div className="text-[11px] text-gray-400">Nairobi Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"
                alt="Decent Collection Tailoring"
                referrerPolicy="no-referrer"
                className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-2xl border border-[#2B2B2B]"
              />
              <div className="absolute -bottom-4 -left-4 bg-[#111111] border border-[#D4AF37] p-4 rounded-xl shadow-xl">
                <div className="text-2xl font-extrabold text-[#D4AF37] font-heading">5,000+</div>
                <div className="text-[11px] text-gray-300 font-semibold">Satisfied Gentlemen in Kenya</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------ VIP CLUB SUBSCRIPTION SECTION ------------------ */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="container mx-auto px-4">
          <VIPClubSection />
        </section>
      )}
    </div>
  );
};


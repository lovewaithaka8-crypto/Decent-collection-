import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, wishlistIds, settings } = useStore();
  const isWishlisted = wishlistIds.includes(product.id);

  const displaySizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : product.category === 'shoes'
      ? ['40', '41', '42', '43', '44']
      : ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="group relative bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D4AF37]/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 flex flex-col justify-between">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#222222]">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-[#D4AF37] text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow">
              NEW
            </span>
          )}
          {product.isOffer && product.discountPrice && (
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow">
              OFFER
            </span>
          )}
          {product.stock <= product.lowStockThreshold && (
            <span className="bg-amber-500/90 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onQuickView(product)}
            className="p-2.5 bg-white/90 hover:bg-[#D4AF37] text-black rounded-full transition-colors shadow-lg"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2.5 rounded-full transition-colors shadow-lg ${
              isWishlisted
                ? 'bg-red-600 text-white'
                : 'bg-white/90 hover:bg-red-500 hover:text-white text-black'
            }`}
            title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest block mb-1">
            {product.category}
          </span>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-white text-sm line-clamp-1 group-hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 mb-2">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Sizes Pills */}
          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="text-[10px] text-gray-500 uppercase font-semibold mr-1">Sizes:</span>
            {displaySizes.slice(0, 4).map((size, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-[#111111] border border-[#333333] text-gray-300 px-1.5 py-0.5 rounded font-mono"
              >
                {size}
              </span>
            ))}
            {displaySizes.length > 4 && (
              <span className="text-[10px] text-gray-500 font-mono">+more</span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-white font-heading">
              {settings.currency} {(product.discountPrice || product.price).toLocaleString()}
            </div>
            {product.discountPrice && (
              <div className="text-xs text-gray-500 line-through">
                {settings.currency} {product.price.toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isWishlisted
                  ? 'border-red-500/50 bg-red-500/10 text-red-500'
                  : 'border-[#333333] hover:border-red-500/50 text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                product.stock > 0
                  ? 'bg-[#D4AF37] hover:bg-[#c39e2d] text-black shadow-md active:scale-95'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{product.stock > 0 ? 'Add' : 'Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


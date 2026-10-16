import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onOpenCart }) => {
  const { addToCart, toggleWishlist, wishlistIds, settings } = useStore();

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Standard');
  const [added, setAdded] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const currentPrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor);
    onClose();
    onOpenCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181818] border border-[#2B2B2B] w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-gray-300 hover:text-white hover:bg-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-[#111111] relative flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-72 md:h-96 object-cover rounded-xl shadow-lg"
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-[#D4AF37] text-black font-extrabold text-[10px] px-2.5 py-1 rounded tracking-wider uppercase">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest block mb-1">
              DECENT COLLECTION • {product.category}
            </span>
            <h2 className="text-xl font-bold text-white font-heading leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {product.rating} ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-white font-heading">
                {settings.currency} {currentPrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {settings.currency} {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-300 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSize === sz
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-bold'
                          : 'border-[#333333] bg-[#222222] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                  Color Option
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setSelectedColor(clr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedColor === clr
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] font-bold'
                          : 'border-[#333333] bg-[#222222] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-gray-300 font-medium">
                {product.stock > 0 ? `In Stock (${product.stock} units available at CBD branch)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#2B2B2B]">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.stock > 0
                    ? 'bg-[#D4AF37] hover:bg-[#c39e2d] text-black shadow-lg'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-red-600/20 border-red-500 text-red-500'
                    : 'border-[#333333] bg-[#222222] text-gray-400 hover:text-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full py-2.5 px-4 bg-[#252525] hover:bg-[#333333] border border-[#333333] text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors"
            >
              Buy Now with M-Pesa
            </button>

            <div className="flex items-center justify-around text-[10px] text-gray-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 100% Authentic Leather
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Same Day Nairobi Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

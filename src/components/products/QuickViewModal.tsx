import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/format';
import { RatingStars } from '../common/RatingStars';
import { SafeImage } from '../common/SafeImage';

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0]?.label ?? 'Standard');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  const activeSizeObj =
    quickViewProduct.sizes.find((s) => s.label === selectedSize) ?? quickViewProduct.sizes[0];
  const computedPrice = quickViewProduct.price + (activeSizeObj?.priceDelta ?? 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${quickViewProduct.name}`}
    >
      <div
        className="fixed inset-0 bg-[#252525]/55 backdrop-blur-[2px]"
        onClick={closeQuickView}
      />

      <div className="relative z-10 w-full max-w-3xl bg-[#F8F5EF] rounded-xl border border-[#E8DED2] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close quick view"
          className="absolute top-3.5 right-3.5 z-20 inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#F8F5EF]/90 hover:bg-white text-[#252525] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image */}
        <div className="aspect-[4/3] md:aspect-auto md:h-full bg-[#F1ECE3]">
          <SafeImage
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.imageAlt}
            fallbackLabel={quickViewProduct.name}
          />
        </div>

        {/* Right Purchase Summary */}
        <div className="p-6 sm:p-7 flex flex-col justify-between gap-5 bg-white">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#57534E]">
              <span>{quickViewProduct.category}</span>
              <span aria-hidden="true">·</span>
              <span>{quickViewProduct.routineStep}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#294D3B] font-medium">In Stock (Demo)</span>
            </div>

            <h2 className="font-serif text-2xl text-[#252525] leading-tight">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-lg font-semibold text-[#252525]">
                  {formatCurrency(computedPrice)}
                </span>
                {quickViewProduct.compareAtPrice && (
                  <span className="text-sm text-[#57534E]/75 line-through">
                    {formatCurrency(quickViewProduct.compareAtPrice)}
                  </span>
                )}
              </div>
              <RatingStars
                rating={quickViewProduct.rating}
                reviewCount={quickViewProduct.reviewCount}
              />
            </div>

            <p className="text-sm text-[#57534E] leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Key Ingredients Summary */}
            <div className="pt-2 border-t border-[#F1ECE3]">
              <p className="text-xs font-semibold text-[#252525] mb-1.5">Key Ingredients</p>
              <p className="text-xs text-[#57534E] leading-relaxed">
                {quickViewProduct.keyIngredients.map((i) => i.name).join(' · ')}
              </p>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-[#252525] mb-2">
                Size: <span className="font-normal text-[#57534E]">{activeSizeObj.volume}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.sizes.map((size) => {
                  const active = size.label === activeSizeObj.label;
                  return (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                          : 'bg-[#F8F5EF] text-[#252525] border-[#E8DED2] hover:border-[#B8A99A]'
                      }`}
                    >
                      {size.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#F1ECE3]">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#E8DED2] rounded-md bg-[#F8F5EF]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-11 inline-flex items-center justify-center text-[#252525] hover:text-[#294D3B]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-11 inline-flex items-center justify-center text-[#252525] hover:text-[#294D3B]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(quickViewProduct, {
                    sizeLabel: activeSizeObj.label,
                    quantity,
                    openDrawer: true,
                  });
                  closeQuickView();
                }}
                className="flex-1 py-3 px-5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
              >
                Add to Bag · {formatCurrency(computedPrice * quantity)}
              </button>
            </div>

            <Link
              to={`/product/${quickViewProduct.slug}`}
              onClick={closeQuickView}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-[#294D3B] hover:underline"
            >
              View full product details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

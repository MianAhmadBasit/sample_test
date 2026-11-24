import { Link } from 'react-router-dom';
import { Eye, Heart, Plus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Product } from '../../types/store';
import { formatCurrency } from '../../utils/format';
import { RatingStars } from '../common/RatingStars';
import { SafeImage } from '../common/SafeImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const saved = isWishlisted(product.id);

  const subtleTag = product.compareAtPrice
    ? `Save ${formatCurrency(product.compareAtPrice - product.price)}`
    : product.isBestseller
      ? 'Best Seller'
      : product.isNewArrival
        ? 'New Formula'
        : null;

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-[#E8DED2] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,37,37,0.06)]">
      {/* Image Frame: 4:3 uniform aspect ratio */}
      <div className="relative aspect-[4/3] bg-[#F1ECE3] overflow-hidden">
        <Link
          to={`/product/${product.slug}`}
          className="block w-full h-full"
          aria-label={`View ${product.name}`}
        >
          <SafeImage
            src={product.images[0]}
            alt={product.imageAlt}
            fallbackLabel={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Quiet Single Editorial Tag (No Pill Clutter) */}
        {subtleTag && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold tracking-[0.04em] text-[#252525] bg-[#F8F5EF]/90 backdrop-blur-sm px-2.5 py-1 rounded">
            {subtleTag}
          </span>
        )}

        {/* Functional Utility Controls: Wishlist & Quick View */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
            aria-pressed={saved}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-md backdrop-blur-sm transition-colors duration-150 ${
              saved
                ? 'bg-[#294D3B] text-[#F8F5EF]'
                : 'bg-[#F8F5EF]/90 text-[#252525] hover:bg-white hover:text-[#294D3B]'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => openQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#F8F5EF]/90 text-[#252525] hover:bg-white hover:text-[#294D3B] backdrop-blur-sm transition-colors duration-150"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Body: Uniform field order & aligned price baseline */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1.5 text-xs text-[#57534E]">
          <span>{product.category}</span>
          <span aria-hidden="true" className="text-[#B8A99A]">·</span>
          <span className="truncate">{product.routineStep}</span>
        </div>

        <h3 className="mt-1.5 font-sans text-base font-semibold text-[#252525] leading-snug">
          <Link
            to={`/product/${product.slug}`}
            className="hover:text-[#294D3B] transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-[#57534E] line-clamp-1">
          {product.subtitle}
        </p>

        <div className="mt-2.5">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Footer Row: Tabular Price + Quick Add */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-[#F1ECE3]">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-[15px] font-semibold text-[#252525]">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#57534E]/75 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, { openDrawer: true })}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[38px] bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.25]" aria-hidden="true" />
            Quick Add
          </button>
        </div>
      </div>
    </article>
  );
}

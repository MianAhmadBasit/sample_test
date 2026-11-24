import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { formatCurrency } from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

const QUICK_SEARCH_TERMS = [
  'Vitamin C',
  'SPF 50',
  'Niacinamide',
  'Ceramide',
  'Sensitive',
  'Bundle',
];

export function SearchModal() {
  const { isSearchOpen, closeSearch, addToCart } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSearchOpen, closeSearch]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);
    return PRODUCTS.filter((p) => {
      const haystack = [
        p.name,
        p.subtitle,
        p.category,
        p.description,
        ...p.skinTypes,
        ...p.concerns,
        ...p.keyIngredients.map((i) => i.name),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeSearch();
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search LUMÉRA SKIN products"
    >
      <div
        className="fixed inset-0 bg-[#252525]/50 backdrop-blur-[2px]"
        onClick={closeSearch}
      />
      <div className="relative z-10 w-full max-w-2xl bg-[#F8F5EF] rounded-xl shadow-2xl border border-[#E8DED2] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-[#E8DED2] bg-white">
          <Search className="w-5 h-5 text-[#57534E] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cleansers, Vitamin C, ceramides, sensitive skin..."
            className="w-full bg-transparent text-base text-[#252525] placeholder:text-[#57534E]/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="p-2 text-[#57534E] hover:text-[#252525] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
          <div>
            <p className="text-xs font-medium text-[#57534E] mb-2.5">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#E8DED2]/70 hover:bg-[#E8DED2] text-[#252525] rounded-md transition-colors whitespace-nowrap"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[#57534E]">
                {query.trim()
                  ? `${results.length} matching formula${results.length === 1 ? '' : 's'}`
                  : 'Best-Selling Essentials'}
              </p>
              <Link
                to={query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop'}
                onClick={closeSearch}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#294D3B] hover:underline"
              >
                View all in Shop <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {results.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#252525] font-medium">No products matched “{query}”.</p>
                <p className="text-xs text-[#57534E] mt-1">
                  Try searching by ingredient (niacinamide, squalane) or skin concern (dryness, dullness).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#E8DED2]/80 hover:border-[#B8A99A] transition-colors"
                  >
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="w-16 h-16 rounded-md overflow-hidden bg-[#F1ECE3] shrink-0"
                    >
                      <SafeImage src={product.images[0]} alt={product.imageAlt} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={closeSearch}
                        className="block text-sm font-semibold text-[#252525] hover:text-[#294D3B] truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-[#57534E] truncate">
                        {product.category} · {formatCurrency(product.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product, { openDrawer: true });
                          closeSearch();
                        }}
                        className="mt-1.5 text-xs font-semibold text-[#294D3B] hover:underline"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

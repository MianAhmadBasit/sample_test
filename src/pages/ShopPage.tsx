import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import type { ProductCategory, SkinConcern, SkinType } from '../types/store';
import { useSEO } from '../utils/seo';

const CATEGORIES: Array<'All' | ProductCategory> = [
  'All',
  'Cleansers',
  'Toners',
  'Serums',
  'Moisturizers',
  'Sun Care',
  'Masks & Eye Care',
  'Bundles',
];

const SKIN_TYPES: Array<'All' | SkinType> = [
  'All',
  'Dry',
  'Oily',
  'Combination',
  'Sensitive',
  'Normal',
];

const SKIN_CONCERNS: Array<'All' | SkinConcern> = [
  'All',
  'Acne-Prone',
  'Dryness',
  'Excess Oil',
  'Sensitivity',
  'Uneven Tone',
  'Dullness',
];

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
type PriceRange = 'all' | 'under-25' | '25-35' | 'over-35';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState<'All' | ProductCategory>('All');
  const [skinType, setSkinType] = useState<'All' | SkinType>('All');
  const [concern, setConcern] = useState<'All' | SkinConcern>('All');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);
  const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const paramCategory = searchParams.get('category') as 'All' | ProductCategory | null;
    const paramConcern = searchParams.get('concern') as 'All' | SkinConcern | null;
    const paramFilter = searchParams.get('filter') || '';
    const paramQuery = searchParams.get('q') || '';

    setCategory(paramCategory && CATEGORIES.includes(paramCategory) ? paramCategory : 'All');
    setConcern(paramConcern && SKIN_CONCERNS.includes(paramConcern) ? paramConcern : 'All');
    setOnlyBestSellers(paramFilter === 'bestsellers');
    setOnlyNewArrivals(paramFilter === 'new');
    setSearchQuery(paramQuery);
  }, [searchParams]);

  useSEO({
    title: 'Shop All Skincare',
    description:
      'Browse the complete LUMÉRA SKIN demonstration skincare catalogue. Filter cleansers, serums, moisturizers, and SPF 50 by skin type, concern, price, and rating.',
    canonicalPath: '/shop',
  });

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = PRODUCTS.filter((product) => {
      if (category !== 'All' && product.category !== category) return false;
      if (skinType !== 'All' && !product.skinTypes.includes(skinType)) return false;
      if (concern !== 'All' && !product.concerns.includes(concern)) return false;
      if (onlyBestSellers && !product.isBestseller) return false;
      if (onlyNewArrivals && !product.isNewArrival) return false;
      if (minRating > 0 && product.rating < minRating) return false;

      if (priceRange === 'under-25' && product.price >= 25) return false;
      if (priceRange === '25-35' && (product.price < 25 || product.price > 35)) return false;
      if (priceRange === 'over-35' && product.price <= 35) return false;

      if (q) {
        const haystack = [
          product.name,
          product.subtitle,
          product.description,
          product.category,
          ...product.skinTypes,
          ...product.concerns,
          ...product.keyIngredients.map((i) => i.name),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...matches];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating-desc') sorted.sort((a, b) => b.rating - a.rating);
    else sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));

    return sorted;
  }, [
    category,
    skinType,
    concern,
    priceRange,
    minRating,
    onlyBestSellers,
    onlyNewArrivals,
    searchQuery,
    sortBy,
  ]);

  const activeFilterCount =
    (category !== 'All' ? 1 : 0) +
    (skinType !== 'All' ? 1 : 0) +
    (concern !== 'All' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyBestSellers ? 1 : 0) +
    (onlyNewArrivals ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setCategory('All');
    setSkinType('All');
    setConcern('All');
    setPriceRange('all');
    setMinRating(0);
    setOnlyBestSellers(false);
    setOnlyNewArrivals(false);
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="bg-[#F8F5EF] min-h-screen">
      {/* Page Header */}
      <section className="border-b border-[#E8DED2] bg-[#F8F5EF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
            Complete Catalogue · Demonstration Pricing & Inventory
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#252525]">
                {onlyBestSellers
                  ? 'Best Sellers'
                  : concern !== 'All'
                    ? `For ${concern}`
                    : category !== 'All'
                      ? category
                      : 'Shop All Skincare'}
              </h1>
              <p className="mt-3 text-base text-[#57534E] max-w-2xl">
                Twelve streamlined, fragrance-free formulas designed to work individually or layer
                seamlessly together. All pricing, stock, and reviews represent demonstration data.
              </p>
            </div>
            <p className="text-sm text-[#57534E] tabular-nums shrink-0">
              Showing {filteredProducts.length} of {PRODUCTS.length} formulas
            </p>
          </div>
        </div>
      </section>

      {/* Category Strip & Controls */}
      <section className="border-b border-[#E8DED2] bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Category Segmented Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#294D3B] text-[#F8F5EF]'
                      : 'bg-[#F8F5EF] text-[#57534E] hover:text-[#252525] hover:bg-[#E8DED2]/70'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search, Toggle & Sort Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product, ingredient, or concern..."
                aria-label="Search products"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md text-[#252525] placeholder:text-[#57534E]/65 focus:outline-none focus:border-[#294D3B]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border border-[#E8DED2] rounded-md bg-[#F8F5EF] hover:border-[#B8A99A] text-[#252525] lg:hidden"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>

              <button
                type="button"
                onClick={() => setOnlyBestSellers((v) => !v)}
                aria-pressed={onlyBestSellers}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap ${
                  onlyBestSellers
                    ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                    : 'bg-white text-[#252525] border-[#E8DED2] hover:border-[#B8A99A]'
                }`}
              >
                Best Sellers
              </button>

              <button
                type="button"
                onClick={() => setOnlyNewArrivals((v) => !v)}
                aria-pressed={onlyNewArrivals}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap ${
                  onlyNewArrivals
                    ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                    : 'bg-white text-[#252525] border-[#E8DED2] hover:border-[#B8A99A]'
                }`}
              >
                New Arrivals
              </button>

              <label className="inline-flex items-center gap-2 text-xs text-[#57534E]">
                <span className="hidden sm:inline">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort products"
                  className="px-3 py-2.5 text-xs font-semibold bg-[#F8F5EF] border border-[#E8DED2] rounded-md text-[#252525] focus:outline-none focus:border-[#294D3B]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </label>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#294D3B] hover:underline whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar Filters + Product Grid */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Filter Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-7 bg-white p-6 rounded-xl border border-[#E8DED2] ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between lg:hidden pb-3 border-b border-[#E8DED2]">
              <h2 className="font-sans text-sm font-semibold text-[#252525]">Filter Catalogue</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 text-[#57534E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Skin Type */}
            <div>
              <h3 className="font-sans text-xs font-semibold tracking-[0.06em] text-[#252525] mb-3">
                Skin Type
              </h3>
              <div className="space-y-1.5">
                {SKIN_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSkinType(type)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                      skinType === type
                        ? 'bg-[#294D3B] text-[#F8F5EF] font-semibold'
                        : 'text-[#57534E] hover:bg-[#F8F5EF] hover:text-[#252525]'
                    }`}
                  >
                    {type === 'All' ? 'All Skin Types' : `${type} Skin`}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Concern */}
            <div className="pt-6 border-t border-[#F1ECE3]">
              <h3 className="font-sans text-xs font-semibold tracking-[0.06em] text-[#252525] mb-3">
                Skin Concern
              </h3>
              <div className="space-y-1.5">
                {SKIN_CONCERNS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setConcern(item)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                      concern === item
                        ? 'bg-[#294D3B] text-[#F8F5EF] font-semibold'
                        : 'text-[#57534E] hover:bg-[#F8F5EF] hover:text-[#252525]'
                    }`}
                  >
                    {item === 'All' ? 'All Concerns' : item}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-6 border-t border-[#F1ECE3]">
              <h3 className="font-sans text-xs font-semibold tracking-[0.06em] text-[#252525] mb-3">
                Price (USD)
              </h3>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'Any Price' },
                  { id: 'under-25', label: 'Under $25' },
                  { id: '25-35', label: '$25 – $35' },
                  { id: 'over-35', label: 'Over $35' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPriceRange(opt.id as PriceRange)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                      priceRange === opt.id
                        ? 'bg-[#294D3B] text-[#F8F5EF] font-semibold'
                        : 'text-[#57534E] hover:bg-[#F8F5EF] hover:text-[#252525]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="pt-6 border-t border-[#F1ECE3]">
              <h3 className="font-sans text-xs font-semibold tracking-[0.06em] text-[#252525] mb-3">
                Minimum Rating
              </h3>
              <div className="space-y-1.5">
                {[
                  { value: 0, label: 'All Ratings' },
                  { value: 4.8, label: '4.8 Stars & Up' },
                  { value: 4.9, label: '4.9 Stars & Up' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMinRating(opt.value)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                      minRating === opt.value
                        ? 'bg-[#294D3B] text-[#F8F5EF] font-semibold'
                        : 'text-[#57534E] hover:bg-[#F8F5EF] hover:text-[#252525]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E8DED2] p-12 text-center">
                <h2 className="font-serif text-2xl text-[#252525]">
                  No formulas match those exact filters
                </h2>
                <p className="mt-2 text-sm text-[#57534E] max-w-md mx-auto">
                  Try clearing one or two filters to explore our full minimalist skincare range.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-6 px-5 py-2.5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, Heart, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { getProductById, getProductBySlug, PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/format';
import { RatingStars } from '../components/common/RatingStars';
import { SafeImage } from '../components/common/SafeImage';
import { ProductCard } from '../components/products/ProductCard';
import type { ProductReview, SkinType } from '../types/store';
import { useSEO } from '../utils/seo';

type DetailTab = 'ingredients' | 'usage' | 'benefits' | 'shipping';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted, pushToast } = useStore();

  const product = slug ? getProductBySlug(slug) : undefined;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSizeLabel, setSelectedSizeLabel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<DetailTab>('ingredients');

  // Local demo review composer
  const [localReviews, setLocalReviews] = useState<ProductReview[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSkinType, setReviewSkinType] = useState<SkinType>('Combination');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedSizeLabel(product.sizes[0]?.label ?? 'Standard');
      setQuantity(1);
      setLocalReviews([]);
      setReviewFormOpen(false);
    }
  }, [product]);

  const structuredData = useMemo(() => {
    if (!product) return undefined;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        brand: { '@type': 'Brand', name: 'LUMÉRA SKIN' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: product.price.toFixed(2),
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toFixed(1),
          reviewCount: product.reviewCount,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Shop All', item: '/shop' },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: `/product/${product.slug}`,
          },
        ],
      },
    ];
  }, [product]);

  useSEO({
    title: product ? `${product.name} — ${product.subtitle}` : 'Product Not Found',
    description: product
      ? product.description
      : 'Explore LUMÉRA SKIN minimalist skincare essentials.',
    canonicalPath: product ? `/product/${product.slug}` : '/shop',
    ogType: 'product',
    ogImage: product?.images[0],
    structuredData,
  });

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#252525]">Product Not Found</h1>
        <p className="mt-3 text-sm text-[#57534E]">
          The skincare formula you’re looking for may have moved. Explore our full collection below.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center px-6 py-3 bg-[#294D3B] text-[#F8F5EF] text-sm font-semibold rounded-md"
        >
          Back to Shop All
        </Link>
      </div>
    );
  }

  const activeSize =
    product.sizes.find((s) => s.label === selectedSizeLabel) ?? product.sizes[0];
  const unitPrice = Number((product.price + activeSize.priceDelta).toFixed(2));
  const saved = isWishlisted(product.id);

  const frequentlyBought = product.frequentlyBoughtWith
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const relatedProducts = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.category === product.category ||
        p.concerns.some((c) => product.concerns.includes(c)))
  ).slice(0, 3);

  const combinedReviews = [...localReviews, ...product.reviews];

  const handleBuyNow = () => {
    addToCart(product, {
      sizeLabel: activeSize.label,
      quantity,
      openDrawer: false,
    });
    navigate('/checkout');
  };

  const handleAddBundle = () => {
    addToCart(product, { sizeLabel: activeSize.label, quantity: 1, openDrawer: false });
    frequentlyBought.forEach((item) => {
      addToCart(item, { openDrawer: false });
    });
    pushToast({
      title: 'Added frequently bought trio',
      description: 'All paired formulas are ready in your bag.',
      variant: 'success',
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewTitle.trim() || !reviewBody.trim()) {
      pushToast({ title: 'Please fill in all review fields.' });
      return;
    }
    const newReview: ProductReview = {
      id: `local-${Date.now()}`,
      author: reviewAuthor.trim(),
      ageRange: 'Demo',
      skinType: reviewSkinType,
      rating: reviewRating,
      title: reviewTitle.trim(),
      body: `${reviewBody.trim()} (Submitted locally in demo mode)`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      verifiedDemo: true,
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewBody('');
    setReviewFormOpen(false);
    pushToast({
      title: 'Demo review posted',
      description: 'Your sample review is displayed on this page.',
      variant: 'success',
    });
  };

  const bundleTotal =
    unitPrice + frequentlyBought.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-[#F8F5EF] pb-24 lg:pb-16">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4"
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#57534E]">
          <li><Link to="/" className="hover:text-[#252525]">Home</Link></li>
          <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
          <li><Link to="/shop" className="hover:text-[#252525]">Shop All</Link></li>
          <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
          <li>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#252525]"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
          <li className="text-[#252525] font-medium" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Split: Sticky Gallery Left + Contiguous Purchase Module Right */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F1ECE3] border border-[#E8DED2]">
              <SafeImage
                src={product.images[activeImageIdx] ?? product.images[0]}
                alt={product.imageAlt}
                eager
              />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View image ${idx + 1} of ${product.name}`}
                  className={`aspect-[4/3] rounded-xl overflow-hidden bg-[#F1ECE3] border-2 transition-colors ${
                    activeImageIdx === idx
                      ? 'border-[#294D3B]'
                      : 'border-transparent hover:border-[#B8A99A]'
                  }`}
                >
                  <SafeImage src={img} alt={`${product.name} detail view ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                <span>{product.category}</span>
                <span aria-hidden="true" className="text-[#B8A99A]">·</span>
                <span>Step: {product.routineStep}</span>
                <span aria-hidden="true" className="text-[#B8A99A]">·</span>
                <span className="text-[#294D3B] font-semibold">
                  In Stock ({product.stockCount} demo units)
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#252525] leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-[#57534E] font-medium">{product.subtitle}</p>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-2.5 tabular-nums">
                  <span className="text-2xl font-semibold text-[#252525]">
                    {formatCurrency(unitPrice)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-[#57534E]/70 line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <a href="#reviews" className="hover:opacity-80 transition-opacity">
                  <RatingStars
                    rating={product.rating}
                    reviewCount={product.reviewCount + localReviews.length}
                    size="md"
                  />
                </a>
              </div>
            </div>

            <p className="text-sm sm:text-[15px] text-[#57534E] leading-relaxed">
              {product.description}
            </p>

            {/* Skin Compatibility Line */}
            <div className="py-3.5 border-y border-[#F1ECE3] text-xs text-[#57534E] space-y-1">
              <p>
                <strong className="text-[#252525]">Skin Types:</strong>{' '}
                {product.skinTypes.join(' · ')}
              </p>
              <p>
                <strong className="text-[#252525]">Addresses:</strong>{' '}
                {product.concerns.join(' · ')}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <p className="text-xs font-semibold text-[#252525] mb-2.5">
                Size:{' '}
                <span className="font-normal text-[#57534E]">{activeSize.volume}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => {
                  const selected = size.label === activeSize.label;
                  return (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => setSelectedSizeLabel(size.label)}
                      className={`px-4 py-2.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap ${
                        selected
                          ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                          : 'bg-[#F8F5EF] text-[#252525] border-[#E8DED2] hover:border-[#B8A99A]'
                      }`}
                    >
                      {size.label}
                      {size.priceDelta > 0 && (
                        <span className="ml-1.5 opacity-85 tabular-nums">
                          (+{formatCurrency(size.priceDelta)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Primary CTAs */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-[#E8DED2] rounded-md bg-[#F8F5EF]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-12 inline-flex items-center justify-center text-[#252525] hover:text-[#294D3B]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="w-11 h-12 inline-flex items-center justify-center text-[#252525] hover:text-[#294D3B]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addToCart(product, {
                      sizeLabel: activeSize.label,
                      quantity,
                      openDrawer: true,
                    })
                  }
                  className="flex-1 h-12 px-5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
                >
                  Add to Bag · {formatCurrency(unitPrice * quantity)}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={saved ? 'Remove from saved items' : 'Save product'}
                  aria-pressed={saved}
                  className={`w-12 h-12 inline-flex items-center justify-center rounded-md border transition-colors shrink-0 ${
                    saved
                      ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                      : 'bg-[#F8F5EF] text-[#252525] border-[#E8DED2] hover:border-[#294D3B]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 border border-[#252525]/25 hover:border-[#294D3B] hover:text-[#294D3B] text-[#252525] text-sm font-semibold rounded-md transition-colors"
              >
                Buy Now (Demo Checkout)
              </button>
            </div>

            {/* Shipping & Transparency Notes */}
            <div className="pt-4 border-t border-[#F1ECE3] space-y-2.5 text-xs text-[#57534E]">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#294D3B] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Complimentary standard US shipping on orders over $50 (3–5 business days demo estimate).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#294D3B] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Fragrance-free · Cruelty-free positioning · Demonstration product data.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Product Specs Tabs */}
      <section className="border-y border-[#E8DED2] bg-white py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#E8DED2]">
            {(
              [
                { id: 'ingredients', label: 'Key Ingredients' },
                { id: 'usage', label: 'How to Use' },
                { id: 'benefits', label: 'Product Benefits' },
                { id: 'shipping', label: 'Shipping & Returns' },
              ] as Array<{ id: DetailTab; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#294D3B] text-[#F8F5EF]'
                    : 'text-[#57534E] hover:bg-[#F8F5EF] hover:text-[#252525]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-8">
            {activeTab === 'ingredients' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.keyIngredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="p-5 rounded-xl bg-[#F8F5EF] border border-[#E8DED2]"
                    >
                      <p className="text-sm font-semibold text-[#252525]">
                        {ing.name}
                        {ing.percentage && (
                          <span className="ml-2 text-xs text-[#294D3B] tabular-nums">
                            {ing.percentage}
                          </span>
                        )}
                      </p>
                      <p className="mt-1.5 text-xs text-[#57534E] leading-relaxed">{ing.role}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-5 p-6 rounded-xl bg-[#F8F5EF] border border-[#E8DED2]">
                  <h3 className="font-sans text-xs font-semibold tracking-[0.06em] text-[#252525] mb-2">
                    Full INCI Disclosure (Demo Formula)
                  </h3>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {product.fullIngredientsList}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="max-w-2xl space-y-4">
                <h3 className="font-serif text-2xl text-[#252525]">Application Guide</h3>
                <p className="text-base text-[#57534E] leading-relaxed">{product.howToUse}</p>
                <p className="text-xs text-[#57534E]">
                  Patch test on the inner forearm before introducing any new cosmetic product into
                  your daily routine.
                </p>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl text-[#252525] mb-4">
                  Why It Belongs On Your Shelf
                </h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm text-[#252525]">
                      <Check className="w-4 h-4 text-[#294D3B] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-3 text-sm text-[#57534E] leading-relaxed">
                <h3 className="font-serif text-2xl text-[#252525]">US Shipping & Returns</h3>
                <p>
                  Standard US shipping is complimentary on orders over $50 ($6 below $50). Express
                  2-day shipping is available for $14.
                </p>
                <p>
                  Unopened or gently tried essentials are covered by our 30-day satisfaction policy.
                  Please note that this storefront operates in demonstration mode and does not
                  process live shipments.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Bought Together */}
      {frequentlyBought.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-[#294D3B]">
                  Routine Pairing
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#252525] mt-1">
                  Frequently Bought Together
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddBundle}
                className="px-5 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
              >
                Add All 3 to Bag · {formatCurrency(bundleTotal)}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[product, ...frequentlyBought].map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F5EF] border border-[#E8DED2]"
                >
                  <Link
                    to={`/product/${item.slug}`}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-[#F1ECE3] shrink-0"
                  >
                    <SafeImage src={item.images[0]} alt={item.imageAlt} />
                  </Link>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#57534E]">
                      {idx === 0 ? 'Current Item' : `Step: ${item.routineStep}`}
                    </p>
                    <Link
                      to={`/product/${item.slug}`}
                      className="block text-sm font-semibold text-[#252525] hover:text-[#294D3B] truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs font-semibold text-[#252525] mt-1 tabular-nums">
                      {formatCurrency(idx === 0 ? unitPrice : item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews (Demo) */}
      <section id="reviews" className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] text-[#294D3B]">
              Sample Demonstration Reviews
            </p>
            <h2 className="font-serif text-3xl text-[#252525] mt-1">
              Customer Impressions
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setReviewFormOpen((v) => !v)}
            className="px-4 py-2.5 border border-[#294D3B] text-[#294D3B] hover:bg-[#294D3B] hover:text-[#F8F5EF] text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
          >
            {reviewFormOpen ? 'Cancel Review' : 'Write a Demo Review'}
          </button>
        </div>

        {reviewFormOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-8 p-6 bg-white rounded-xl border border-[#E8DED2] grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                  Skin Type
                </label>
                <select
                  value={reviewSkinType}
                  onChange={(e) => setReviewSkinType(e.target.value as SkinType)}
                  className="w-full px-3 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                >
                  <option value="Combination">Combination</option>
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                  <option value="Sensitive">Sensitive</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                  Rating
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your impression"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#252525] mb-1.5">
                Review
              </label>
              <textarea
                rows={3}
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Share texture, comfort, and routine notes..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md"
              >
                Post Demo Review
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {combinedReviews.map((review) => (
            <article
              key={review.id}
              className="p-6 bg-white rounded-xl border border-[#E8DED2] space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <RatingStars rating={review.rating} showNumber={false} />
                <span className="text-xs text-[#57534E]">{review.date}</span>
              </div>
              <h3 className="font-sans text-base font-semibold text-[#252525]">{review.title}</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">{review.body}</p>
              <p className="pt-2 text-xs text-[#57534E]">
                <strong className="text-[#252525]">{review.author}</strong> · {review.skinType} Skin
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <h2 className="font-serif text-3xl text-[#252525] mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Buy Bar (Compact <= 64px) */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E8DED2] px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#252525] truncate">{product.name}</p>
          <p className="text-xs text-[#57534E] tabular-nums">
            {formatCurrency(unitPrice)} · {activeSize.label}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            addToCart(product, {
              sizeLabel: activeSize.label,
              quantity,
              openDrawer: true,
            })
          }
          className="px-5 py-2.5 bg-[#294D3B] text-[#F8F5EF] text-xs font-semibold rounded-md whitespace-nowrap shrink-0"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import {
  COMMUNITY_GALLERY,
  DEMO_TESTIMONIALS,
  ROUTINE_STEPS,
  SKIN_CONCERNS_GUIDE,
} from '../data/content';
import { BRAND_ASSETS, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import { SafeImage } from '../components/common/SafeImage';
import { useStore } from '../context/StoreContext';
import { storefrontService } from '../services/storefrontService';
import { useSEO } from '../utils/seo';

const TRUST_INDICATORS = [
  {
    title: 'Skin-Conscious Formulations',
    detail: 'Balanced pH and fragrance-free textures crafted for daily comfort.',
  },
  {
    title: 'Cruelty-Free Positioning',
    detail: 'Thoughtfully developed without animal testing at any stage.',
  },
  {
    title: 'Transparent Ingredients',
    detail: 'Every active disclosed clearly in plain language—no mystery blends.',
  },
  {
    title: 'Inclusive Skincare',
    detail: 'Formulated for all genders, ages 18–30+, and zero cast across all skin tones.',
  },
];

export function HomePage() {
  const { pushToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useSEO({
    title: 'LUMÉRA SKIN — Your Skin. Your Science. Your Glow.',
    description:
      'Minimalist, science-inspired skincare designed for healthy, hydrated, and glowing skin. Explore gentle cleansers, serums, moisturizers, and invisible daily SPF 50.',
    canonicalPath: '/',
  });

  const bestSellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 6);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    const { alreadySubscribed } = storefrontService.subscribeNewsletter(trimmed);
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    pushToast({
      title: alreadySubscribed ? 'Already subscribed' : 'You’re on the LUMÉRA list',
      description: 'Apply demo code WELCOME10 at checkout for 10% off.',
      variant: 'success',
    });
  };

  return (
    <div>
      {/* 1. Editorial Hero Section */}
      <section className="relative bg-[#F8F5EF] border-b border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Editorial Copy Column */}
            <div className="lg:col-span-5 flex flex-col justify-center py-2 lg:py-6">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#294D3B] mb-4">
                Your Skin · Your Science · Your Glow
              </p>

              <h1 className="font-serif text-[clamp(2.35rem,4.2vw,3.85rem)] leading-[1.08] tracking-[-0.015em] text-[#252525]">
                Healthy Skin Starts With The Right Routine.
              </h1>

              <p className="mt-5 text-base sm:text-[17px] text-[#57534E] leading-relaxed max-w-md">
                Minimalist, fragrance-free skincare powered by transparent actives—gentle enough for
                everyday consistency across every skin type and tone.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/shop?filter=bestsellers"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors duration-150 whitespace-nowrap"
                >
                  Shop Best Sellers <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/routine"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[46px] bg-transparent border border-[#252525]/25 hover:border-[#294D3B] hover:text-[#294D3B] text-[#252525] text-sm font-semibold rounded-md transition-colors duration-150 whitespace-nowrap"
                >
                  Discover Your Routine
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8DED2] flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#57534E]">
                <span>Free US Shipping $50+</span>
                <span aria-hidden="true" className="text-[#B8A99A]">·</span>
                <span>12 Demo Formulations</span>
                <span aria-hidden="true" className="text-[#B8A99A]">·</span>
                <span>Fragrance-Free Essentials</span>
              </div>
            </div>

            {/* Hero Editorial Visual */}
            <div className="lg:col-span-7">
              <div className="relative h-full min-h-[300px] sm:min-h-[420px] lg:min-h-[540px] rounded-2xl overflow-hidden bg-[#E8DED2]">
                <SafeImage
                  src={BRAND_ASSETS.heroEditorial}
                  alt="Inclusive young woman and man with naturally glowing skin in a sunlit travertine bathroom with LUMÉRA SKIN bottles"
                  eager
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#252525]/70 via-[#252525]/25 to-transparent p-6 sm:p-8 flex items-end justify-between gap-4">
                  <div className="text-[#F8F5EF]">
                    <p className="text-xs tracking-[0.06em] text-[#E8DED2]">Featured Set</p>
                    <p className="font-serif text-lg sm:text-xl mt-0.5">
                      Radiance Skincare Bundle — $65
                    </p>
                  </div>
                  <Link
                    to="/product/radiance-skincare-bundle"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F8F5EF] hover:bg-white text-[#252525] text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    Explore Set <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Trust Indicators Strip (Full-Width Row Below Hero Split) */}
          <div className="mt-12 pt-8 border-t border-[#E8DED2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TRUST_INDICATORS.map((item, idx) => (
              <div key={item.title} className="space-y-1.5">
                <p className="text-xs text-[#294D3B] font-semibold tabular-nums">
                  0{idx + 1}. {item.title}
                </p>
                <p className="text-sm text-[#57534E] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Best-Selling Products */}
      <section className="py-16 lg:py-24 bg-[#F8F5EF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
                Curated Essentials · Demonstration Catalogue
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
                Best-Selling Formulas
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#294D3B] hover:underline underline-offset-4 whitespace-nowrap"
            >
              Shop All 12 Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shop By Skin Concern */}
      <section className="py-16 lg:py-24 bg-[#E8DED2]/45 border-y border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
              Targeted Cosmetic Support
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
              Shop By Skin Concern
            </h2>
            <p className="mt-3 text-base text-[#57534E] leading-relaxed">
              Select your primary skin focus to filter our minimalist formulations directly to the
              ingredients that match your daily goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SKIN_CONCERNS_GUIDE.map((item) => (
              <Link
                key={item.concern}
                to={`/shop?concern=${encodeURIComponent(item.concern)}`}
                className="group bg-[#F8F5EF] hover:bg-white rounded-xl p-6 border border-[#E8DED2] hover:border-[#294D3B]/40 transition-all duration-200 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-xl text-[#252525] group-hover:text-[#294D3B] transition-colors">
                      {item.headline}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#57534E] group-hover:text-[#294D3B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </div>
                  <p className="mt-2.5 text-sm text-[#57534E] leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <p className="pt-3 border-t border-[#E8DED2]/80 text-xs font-medium text-[#294D3B]">
                  {item.keyActive}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Philosophy Editorial Split */}
      <section className="py-16 lg:py-24 bg-[#F8F5EF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[320px] rounded-2xl overflow-hidden bg-[#E8DED2]">
                <SafeImage
                  src={BRAND_ASSETS.textureScience}
                  alt="Macro texture study of LUMÉRA SKIN ceramide cream swirl, clear hyaluronic droplets, and glass laboratory pipette on travertine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-3">
                Brand Philosophy
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#252525] leading-tight">
                Where Minimalist Science Meets Daily Calm.
              </h2>
              <p className="mt-4 text-base text-[#57534E] leading-relaxed">
                Great skin rarely comes from a crowded twelve-step shelf. LUMÉRA SKIN focuses on
                dependable, barrier-respecting staples with clear percentages and breathable
                textures designed to fit real schedules.
              </p>

              <div className="mt-8 space-y-5 border-t border-[#E8DED2] pt-6">
                <div>
                  <h3 className="font-sans text-sm font-semibold text-[#252525]">
                    01. Science-Inspired Clarity
                  </h3>
                  <p className="mt-1 text-sm text-[#57534E] leading-relaxed">
                    Formulated around proven cosmetic staples—5% niacinamide, 10% THD vitamin C,
                    multi-weight hyaluronic acid, and skin-identical ceramides.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-[#252525]">
                    02. Simple, Repeatable Routines
                  </h3>
                  <p className="mt-1 text-sm text-[#57534E] leading-relaxed">
                    Four intuitive steps—Cleanse, Treat, Hydrate, Protect—so consistency feels
                    effortless every morning and night.
                  </p>
                </div>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-[#252525]">
                    03. Inclusive By Default
                  </h3>
                  <p className="mt-1 text-sm text-[#57534E] leading-relaxed">
                    Gender-neutral packaging, zero synthetic fragrance, and sheer UV filters made
                    to disappear smoothly on every complexion.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#294D3B] hover:underline underline-offset-4"
                >
                  Read Our Brand Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Four-Step Skincare Routine Section */}
      <section className="py-16 lg:py-24 bg-white border-y border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
                The LUMÉRA Framework
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
                Four Steps to Balanced, Hydrated Skin
              </h2>
            </div>
            <Link
              to="/routine"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
            >
              Take the Routine Quiz <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROUTINE_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex flex-col justify-between p-6 rounded-xl bg-[#F8F5EF] border border-[#E8DED2]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#57534E] pb-4 border-b border-[#E8DED2]">
                    <span className="font-semibold text-[#294D3B] tabular-nums">
                      {step.number}. {step.step}
                    </span>
                    <span>{step.timing}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-[#252525]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <Link
                  to={`/product/${step.productSlug}`}
                  className="mt-6 pt-4 border-t border-[#E8DED2] inline-flex items-center justify-between text-xs font-semibold text-[#294D3B] hover:underline"
                >
                  <span>{step.productName}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials (Clearly Marked Demo Sample Reviews) */}
      <section className="py-16 lg:py-24 bg-[#F8F5EF]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
              Community Notes · Sample Demonstration Reviews
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
              Real-Life Routines, Simplified
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_TESTIMONIALS.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col justify-between p-7 bg-white rounded-xl border border-[#E8DED2]"
              >
                <blockquote className="text-sm sm:text-[15px] text-[#252525] leading-relaxed">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 pt-4 border-t border-[#F1ECE3]">
                  <p className="text-sm font-semibold text-[#252525]">{review.name}</p>
                  <p className="text-xs text-[#57534E] mt-0.5">{review.detail}</p>
                  <p className="text-xs text-[#294D3B] font-medium mt-2">
                    Routine pick: {review.productUsed} · Sample demo review
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram-Inspired Community Lifestyle Gallery */}
      <section className="py-16 lg:py-20 bg-[#E8DED2]/35 border-t border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
                @lumeraskin
              </p>
              <h2 className="font-serif text-3xl text-[#252525]">
                In Your Daily Ritual
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-[#294D3B] hover:underline underline-offset-4"
            >
              Shop Featured Essentials
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMMUNITY_GALLERY.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.productSlug}`}
                className="group block bg-white rounded-xl overflow-hidden border border-[#E8DED2] hover:border-[#B8A99A] transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#F1ECE3]">
                  <SafeImage
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#252525] leading-relaxed line-clamp-2">
                    {item.caption}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-[#57534E]">
                    {item.handle} · Tap to view formula
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription Band */}
      <section className="py-16 lg:py-20 bg-[#F8F5EF] border-t border-[#E8DED2]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
            Stay Connected
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
            10% Off Your First Ritual
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#57534E] leading-relaxed">
            Subscribe for minimalist routine guides, ingredient breakdowns, and early access to
            upcoming demonstration launches. Use code{' '}
            <strong className="font-semibold text-[#252525]">WELCOME10</strong> anytime.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            noValidate
            className="mt-7 max-w-md mx-auto flex flex-col sm:flex-row gap-2.5"
          >
            <label htmlFor="home-newsletter" className="sr-only">Email address</label>
            <input
              id="home-newsletter"
              type="email"
              value={newsletterEmail}
              onChange={(e) => {
                setNewsletterEmail(e.target.value);
                if (newsletterError) setNewsletterError('');
              }}
              placeholder="you@example.com"
              className="flex-1 min-w-0 px-4 py-3 bg-white border border-[#E8DED2] rounded-md text-sm text-[#252525] placeholder:text-[#57534E]/60 focus:outline-none focus:border-[#294D3B]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          {newsletterError && (
            <p className="mt-2.5 text-xs text-[#8B3A2B]">{newsletterError}</p>
          )}
          {newsletterSuccess && !newsletterError && (
            <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#294D3B]">
              <Check className="w-3.5 h-3.5" /> Thank you — demo subscription saved locally.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

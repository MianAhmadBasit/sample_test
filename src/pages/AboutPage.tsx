import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND_ASSETS } from '../data/products';
import { SafeImage } from '../components/common/SafeImage';
import { useSEO } from '../utils/seo';

const BRAND_VALUES = [
  {
    number: '01',
    title: 'Radical Clarity Over Hype',
    body: 'We skip miracle promises and unverified claims. Every LUMÉRA SKIN label lists active concentrations and plain-English ingredient roles so you know exactly what touches your face.',
  },
  {
    number: '02',
    title: 'Barrier-First Formulation',
    body: 'Healthy radiance starts with an intact moisture barrier. We formulate around skin-friendly pH ranges, zero added synthetic fragrance, and gentle delivery systems built for everyday use.',
  },
  {
    number: '03',
    title: 'Inclusive By Architecture',
    body: 'Skincare has no gender. Our textures, neutral packaging, and invisible broad-spectrum SPF 50 are crafted for men, women, and non-binary routines across every shade and complexion.',
  },
  {
    number: '04',
    title: 'Thoughtful Restraint',
    body: 'Instead of launching fifty overlapping bottles, we refine twelve foundational products designed to earn a permanent spot on your bathroom counter.',
  },
];

export function AboutPage() {
  useSEO({
    title: 'About LUMÉRA SKIN — Brand Story & Philosophy',
    description:
      'Discover the story behind LUMÉRA SKIN: minimalist, science-inspired, inclusive skincare built around transparent ingredients and calm daily routines.',
    canonicalPath: '/about',
  });

  return (
    <div className="bg-[#F8F5EF]">
      {/* Editorial Hero */}
      <section className="border-b border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-3">
              About LUMÉRA SKIN
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] text-[#252525]">
              Skincare Designed for Real Mornings, Honest Ingredients, and Every Face.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#57534E] leading-relaxed">
              LUMÉRA SKIN was conceived as a calm counterweight to complicated 12-step trends and
              confusing marketing jargon. Our mission is simple: deliver minimalist,
              science-inspired cosmetic staples that make daily care effortless and trustworthy.
            </p>
          </div>
        </div>
      </section>

      {/* Story Split */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] rounded-2xl overflow-hidden bg-[#E8DED2]">
              <SafeImage
                src={BRAND_ASSETS.radianceBundle}
                alt="LUMÉRA SKIN four-piece minimalist skincare collection arranged on travertine stone blocks"
                eager
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
                Our Story & Vision
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
                Your Skin. Your Science. Your Glow.
              </h2>
            </div>

            <p className="text-base text-[#57534E] leading-relaxed">
              Young adults navigating skincare today face two frustrating extremes: overly harsh
              formulas that leave skin sensitized, or overpriced luxury jars filled with heavy
              perfume and vague promises.
            </p>

            <p className="text-base text-[#57534E] leading-relaxed">
              Our product development approach pairs trusted cosmetic workhorses—such as 5%
              niacinamide, lipid-soluble 10% THD vitamin C, multi-weight hyaluronic acid, and
              ceramide lipid complexes—with breathable, modern textures that layer smoothly under
              sunscreen and makeup alike.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#E8DED2]">
              <div>
                <h3 className="font-sans text-sm font-semibold text-[#252525]">Our Mission</h3>
                <p className="mt-1.5 text-sm text-[#57534E] leading-relaxed">
                  Empower consistent, calm skincare habits through clear education and dependable,
                  fragrance-free essentials.
                </p>
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-[#252525]">Our Vision</h3>
                <p className="mt-1.5 text-sm text-[#57534E] leading-relaxed">
                  A modern beauty standard where transparency, inclusivity, and skin comfort replace
                  complexity and perfectionism.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 lg:py-24 bg-white border-y border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
              Formulation Standards
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
              Four Principles Behind Every Bottle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {BRAND_VALUES.map((val) => (
              <div
                key={val.number}
                className="p-7 rounded-xl bg-[#F8F5EF] border border-[#E8DED2] space-y-2.5"
              >
                <p className="text-xs font-semibold text-[#294D3B] tabular-nums">
                  {val.number}. {val.title}
                </p>
                <p className="text-sm sm:text-[15px] text-[#57534E] leading-relaxed">{val.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusive Commitment + Demo Transparency */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B]">
              Commitment to Inclusivity
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
              Shared Shelf, Universal Comfort
            </h2>
            <p className="text-base text-[#57534E] leading-relaxed">
              Every texture in the LUMÉRA SKIN range is thoughtfully conceptualized to wear
              comfortably across dry, oily, combination, and sensitive skin—whether worn bare, over
              facial hair, or underneath makeup.
            </p>
            <p className="text-xs text-[#57534E] bg-[#E8DED2]/55 p-4 rounded-lg border border-[#E8DED2]">
              Transparency Note: LUMÉRA SKIN is a fictional demonstration skincare brand built as a
              production-grade e-commerce storefront showcase. Product specifications, reviews, and
              checkout operations are demonstration experiences.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
              >
                Explore the Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/routine"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#252525]/25 hover:border-[#294D3B] text-[#252525] text-sm font-semibold rounded-md transition-colors"
              >
                Take the Routine Quiz
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[300px] rounded-2xl overflow-hidden bg-[#E8DED2]">
              <SafeImage
                src={BRAND_ASSETS.heroEditorial}
                alt="Inclusive young woman and man sharing a calm morning skincare routine"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

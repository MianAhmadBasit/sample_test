import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Moon, RotateCcw, Sun } from 'lucide-react';
import { computeQuizRecommendations, ROUTINE_STEPS } from '../data/content';
import { BRAND_ASSETS, getProductById } from '../data/products';
import { useStore } from '../context/StoreContext';
import type { QuizSelection, SkinConcern, SkinType } from '../types/store';
import { formatCurrency } from '../utils/format';
import { SafeImage } from '../components/common/SafeImage';
import { useSEO } from '../utils/seo';

const SKIN_TYPE_GUIDANCE: Array<{
  type: string;
  feel: string;
  focus: string;
  keyPickSlug: string;
  keyPickName: string;
}> = [
  {
    type: 'Dry Skin',
    feel: 'Often feels tight after cleansing, with occasional flaky patches.',
    focus: 'Layer humectants (Hyaluronic Acid) on damp skin and seal with ceramides.',
    keyPickSlug: 'barrier-repair-cream',
    keyPickName: 'Barrier Repair Cream',
  },
  {
    type: 'Oily Skin',
    feel: 'Develops visible shine across the forehead, nose, and chin by midday.',
    focus: 'Use a gentle pH-balanced cleanser, 5% niacinamide, and lightweight oil-free hydration.',
    keyPickSlug: 'niacinamide-balance-serum',
    keyPickName: 'Niacinamide Balance Serum',
  },
  {
    type: 'Combination Skin',
    feel: 'Balanced or dry cheeks paired with a shinier T-zone.',
    focus: 'Hydrate evenly with squalane and spot-treat congested areas with gentle PHA/BHA.',
    keyPickSlug: 'hydrating-daily-moisturizer',
    keyPickName: 'Hydrating Daily Moisturizer',
  },
  {
    type: 'Sensitive Skin',
    feel: 'Reacts quickly to fragrance, harsh scrubs, or cold wind with visible redness.',
    focus: 'Keep steps minimal, avoid added fragrance, and prioritize oat lipids and panthenol.',
    keyPickSlug: 'gentle-glow-cleanser',
    keyPickName: 'Gentle Glow Cleanser',
  },
];

export function RoutinePage() {
  const { addToCart, saveQuizResult, pushToast } = useStore();
  const [routineTab, setRoutineTab] = useState<'morning' | 'evening'>('morning');

  // Interactive Quiz State
  const [quizStep, setQuizStep] = useState<number>(1);
  const [selection, setSelection] = useState<QuizSelection>({
    skinType: 'Combination',
    primaryConcern: 'Dullness',
    routineGoal: 'minimal',
    sensitivity: 'moderate',
  });
  const [quizCompleted, setQuizCompleted] = useState(false);

  useSEO({
    title: 'Skincare Routine Guide & Interactive Quiz',
    description:
      'Build a simple, effective morning and evening skincare routine. Take the LUMÉRA SKIN interactive cosmetic routine quiz for personalized product suggestions.',
    canonicalPath: '/routine',
  });

  const quizOutput = computeQuizRecommendations(selection);
  const recommendedProducts = quizOutput.productIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const recommendedTotal = recommendedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    saveQuizResult({
      completedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      selection,
      recommendedProductIds: quizOutput.productIds,
    });
    pushToast({
      title: 'Your cosmetic routine is ready',
      description: 'Saved to your Account for easy reference.',
      variant: 'success',
    });
  };

  const handleAddCompleteRoutine = () => {
    recommendedProducts.forEach((product) => {
      addToCart(product, { openDrawer: false });
    });
    pushToast({
      title: `Added ${recommendedProducts.length} routine essentials`,
      description: 'Your personalized demo lineup is now in your bag.',
      variant: 'success',
    });
  };

  return (
    <div className="bg-[#F8F5EF]">
      {/* Editorial Intro */}
      <section className="border-b border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-3">
                Educational Skincare Guide
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#252525] leading-tight">
                Simplicity Builds Consistency. Consistency Builds Glow.
              </h1>
              <p className="mt-4 text-base text-[#57534E] leading-relaxed">
                Whether you are starting from scratch or streamlining a crowded shelf, our
                four-step routine architecture focuses on barrier comfort, smart layering, and daily
                UV defense.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#skincare-quiz"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
                >
                  Start Routine Quiz <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/product/radiance-skincare-bundle"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#252525]/25 hover:border-[#294D3B] text-[#252525] text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
                >
                  Shop Complete 4-Step Set
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] rounded-2xl overflow-hidden bg-[#E8DED2]">
                <SafeImage
                  src={BRAND_ASSETS.inclusiveRoutine}
                  alt="Smiling young man applying clear hydrating serum in sunlit modern bathroom"
                  eager
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Skincare Quiz */}
      <section id="skincare-quiz" className="py-16 lg:py-24 bg-white border-b border-[#E8DED2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
              Interactive Routine Builder
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
              Find Your Minimalist Routine
            </h2>
            <p className="mt-3 text-sm text-[#57534E] leading-relaxed">
              Answer four quick questions to generate a tailored demonstration lineup. Recommendations
              represent general cosmetic guidance—not medical or dermatological diagnoses.
            </p>
          </div>

          <div className="bg-[#F8F5EF] rounded-2xl border border-[#E8DED2] p-6 sm:p-10">
            {!quizCompleted ? (
              <div className="space-y-8">
                {/* Step Indicator */}
                <div className="flex items-center justify-between text-xs text-[#57534E] pb-4 border-b border-[#E8DED2]">
                  <span className="font-semibold text-[#294D3B] tabular-nums">
                    Question {quizStep} of 4
                  </span>
                  <div className="flex gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className={`h-1.5 w-8 rounded-full transition-colors ${
                          n <= quizStep ? 'bg-[#294D3B]' : 'bg-[#E8DED2]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {quizStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#252525]">
                      How does your skin typically feel by midday?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          {
                            value: 'Dry',
                            label: 'Dry & Tight',
                            desc: 'Craves richer hydration and occasionally feels flaky.',
                          },
                          {
                            value: 'Oily',
                            label: 'Shiny & Oily',
                            desc: 'Noticeable excess oil across forehead, nose, and cheeks.',
                          },
                          {
                            value: 'Combination',
                            label: 'Combination',
                            desc: 'Slightly shiny T-zone with balanced or dry cheeks.',
                          },
                          {
                            value: 'Sensitive',
                            label: 'Easily Sensitized',
                            desc: 'Flushes or feels reactive to strong actives or weather.',
                          },
                          {
                            value: 'Normal',
                            label: 'Balanced / Normal',
                            desc: 'Comfortable overall, focused on daily glow and prevention.',
                          },
                        ] as Array<{ value: SkinType; label: string; desc: string }>
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelection((s) => ({ ...s, skinType: opt.value }))}
                          className={`text-left p-4 rounded-xl border transition-colors ${
                            selection.skinType === opt.value
                              ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                              : 'bg-white text-[#252525] border-[#E8DED2] hover:border-[#294D3B]/50'
                          }`}
                        >
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p
                            className={`text-xs mt-1 ${
                              selection.skinType === opt.value
                                ? 'text-[#E8DED2]'
                                : 'text-[#57534E]'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#252525]">
                      What is your primary cosmetic goal right now?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          { value: 'Dullness', label: 'Brighter, More Rested Glow' },
                          { value: 'Dryness', label: 'Deep Lasting Hydration' },
                          { value: 'Acne-Prone', label: 'Clearer-Looking Pores' },
                          { value: 'Excess Oil', label: 'Balanced Midday Shine' },
                          { value: 'Uneven Tone', label: 'Smoother, More Even Tone' },
                          { value: 'Sensitivity', label: 'Calm, Comforted Skin Barrier' },
                        ] as Array<{ value: SkinConcern; label: string }>
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setSelection((s) => ({ ...s, primaryConcern: opt.value }))
                          }
                          className={`text-left p-4 rounded-xl border transition-colors ${
                            selection.primaryConcern === opt.value
                              ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                              : 'bg-white text-[#252525] border-[#E8DED2] hover:border-[#294D3B]/50'
                          }`}
                        >
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p
                            className={`text-xs mt-0.5 ${
                              selection.primaryConcern === opt.value
                                ? 'text-[#E8DED2]'
                                : 'text-[#57534E]'
                            }`}
                          >
                            Focus: {opt.value}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#252525]">
                      How sensitive is your skin to new formulas?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(
                        [
                          {
                            value: 'low',
                            label: 'Resilient',
                            desc: 'Tolerates gentle acids and vitamin C comfortably.',
                          },
                          {
                            value: 'moderate',
                            label: 'Occasionally Reactive',
                            desc: 'Prefers balanced percentages and calm hydration.',
                          },
                          {
                            value: 'high',
                            label: 'Very Sensitive',
                            desc: 'Best suited to barrier-first, minimal-step formulas.',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelection((s) => ({ ...s, sensitivity: opt.value }))}
                          className={`text-left p-4 rounded-xl border transition-colors ${
                            selection.sensitivity === opt.value
                              ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                              : 'bg-white text-[#252525] border-[#E8DED2] hover:border-[#294D3B]/50'
                          }`}
                        >
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p
                            className={`text-xs mt-1 ${
                              selection.sensitivity === opt.value
                                ? 'text-[#E8DED2]'
                                : 'text-[#57534E]'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#252525]">
                      How many steps fit your real schedule?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(
                        [
                          {
                            value: 'minimal',
                            label: 'Essential 4-Step Routine',
                            desc: 'Cleanse, 1 targeted serum, daily moisturizer, and SPF 50. Under 2 minutes.',
                          },
                          {
                            value: 'complete',
                            label: 'Complete AM & PM Ritual',
                            desc: 'Adds a dedicated evening treatment or rich night cream for extra care.',
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelection((s) => ({ ...s, routineGoal: opt.value }))}
                          className={`text-left p-5 rounded-xl border transition-colors ${
                            selection.routineGoal === opt.value
                              ? 'bg-[#294D3B] text-[#F8F5EF] border-[#294D3B]'
                              : 'bg-white text-[#252525] border-[#E8DED2] hover:border-[#294D3B]/50'
                          }`}
                        >
                          <p className="text-base font-semibold">{opt.label}</p>
                          <p
                            className={`text-xs mt-1.5 leading-relaxed ${
                              selection.routineGoal === opt.value
                                ? 'text-[#E8DED2]'
                                : 'text-[#57534E]'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="pt-4 border-t border-[#E8DED2] flex items-center justify-between">
                  <button
                    type="button"
                    disabled={quizStep === 1}
                    onClick={() => setQuizStep((s) => Math.max(1, s - 1))}
                    className="px-4 py-2.5 text-xs font-semibold text-[#57534E] hover:text-[#252525] disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {quizStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setQuizStep((s) => s + 1)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishQuiz}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
                    >
                      Build My Routine <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Results */
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E8DED2]">
                  <div>
                    <p className="text-xs font-semibold text-[#294D3B]">
                      Personalized Cosmetic Guidance · Demo Selection
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#252525] mt-1">
                      Your Recommended LUMÉRA Lineup
                    </h3>
                    <p className="mt-2 text-sm text-[#57534E] max-w-xl">{quizOutput.summary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizCompleted(false);
                      setQuizStep(1);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#294D3B] hover:underline whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                  </button>
                </div>

                {/* Recommended Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E8DED2]"
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        className="w-20 h-20 rounded-lg overflow-hidden bg-[#F1ECE3] shrink-0"
                      >
                        <SafeImage src={product.images[0]} alt={product.imageAlt} />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-[#294D3B]">
                          0{idx + 1}. {product.routineStep}
                        </p>
                        <Link
                          to={`/product/${product.slug}`}
                          className="block text-sm font-semibold text-[#252525] hover:text-[#294D3B] truncate"
                        >
                          {product.name}
                        </Link>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#252525] tabular-nums">
                            {formatCurrency(product.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(product, { openDrawer: true })}
                            className="text-xs font-semibold text-[#294D3B] hover:underline"
                          >
                            Add Single
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AM / PM Application Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 bg-white rounded-xl border border-[#E8DED2]">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#252525] mb-3">
                      <Sun className="w-4 h-4 text-[#294D3B]" /> Morning Order
                    </p>
                    <ol className="space-y-2 text-xs text-[#57534E] list-decimal list-inside leading-relaxed">
                      {quizOutput.morningSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-5 bg-white rounded-xl border border-[#E8DED2]">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#252525] mb-3">
                      <Moon className="w-4 h-4 text-[#294D3B]" /> Evening Order
                    </p>
                    <ol className="space-y-2 text-xs text-[#57534E] list-decimal list-inside leading-relaxed">
                      {quizOutput.eveningSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E8DED2]">
                  <p className="text-xs text-[#57534E] max-w-md">
                    Disclaimer: These suggestions provide general cosmetic skincare guidance only
                    and are not a substitute for professional medical or dermatological advice.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddCompleteRoutine}
                    className="px-6 py-3.5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    Add Complete Routine · {formatCurrency(recommendedTotal)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Morning vs. Evening Guide */}
      <section className="py-16 lg:py-24 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
              Daily Structure
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252525]">
              Morning & Evening Skincare Routines
            </h2>
          </div>

          <div className="inline-flex p-1 bg-[#E8DED2]/70 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setRoutineTab('morning')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                routineTab === 'morning'
                  ? 'bg-white text-[#252525] shadow-xs'
                  : 'text-[#57534E] hover:text-[#252525]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Morning (AM)
            </button>
            <button
              type="button"
              onClick={() => setRoutineTab('evening')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                routineTab === 'evening'
                  ? 'bg-white text-[#252525] shadow-xs'
                  : 'text-[#57534E] hover:text-[#252525]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Evening (PM)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(routineTab === 'morning'
            ? ROUTINE_STEPS
            : [
                ROUTINE_STEPS[0],
                {
                  number: '02',
                  step: 'Exfoliate / Tone',
                  title: 'Polish 2–3x Weekly',
                  timing: 'Evening Only',
                  description:
                    'Use Exfoliating Facial Toner (4% PHA + 1% BHA) on alternating nights to gently refine dull surface buildup.',
                  productSlug: 'exfoliating-facial-toner',
                  productName: 'Exfoliating Facial Toner',
                },
                {
                  number: '03',
                  step: 'Hydrate',
                  title: 'Replenish Moisture',
                  timing: 'Every Evening',
                  description:
                    'Press Hyaluronic Acid Serum or Niacinamide Balance Serum onto damp skin before sealing in moisture.',
                  productSlug: 'hyaluronic-acid-serum',
                  productName: 'Hyaluronic Acid Serum',
                },
                {
                  number: '04',
                  step: 'Recover',
                  title: 'Seal Overnight',
                  timing: 'Final PM Step',
                  description:
                    'Finish with Overnight Recovery Cream or Barrier Repair Cream to lock in softness while you sleep.',
                  productSlug: 'overnight-recovery-cream',
                  productName: 'Overnight Recovery Cream',
                },
              ]
          ).map((item) => (
            <div
              key={`${routineTab}-${item.number}`}
              className="flex flex-col justify-between p-6 bg-white rounded-xl border border-[#E8DED2]"
            >
              <div>
                <p className="text-xs font-semibold text-[#294D3B] tabular-nums">
                  {item.number}. {item.step} · {item.timing}
                </p>
                <h3 className="mt-3 font-serif text-xl text-[#252525]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#57534E] leading-relaxed">{item.description}</p>
              </div>
              <Link
                to={`/product/${item.productSlug}`}
                className="mt-6 pt-4 border-t border-[#F1ECE3] inline-flex items-center justify-between text-xs font-semibold text-[#294D3B] hover:underline"
              >
                <span>{item.productName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Skin Type Guidance Matrix */}
      <section className="py-16 bg-[#E8DED2]/40 border-t border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[#252525] mb-8">Skin Type Guidance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKIN_TYPE_GUIDANCE.map((item) => (
              <div
                key={item.type}
                className="p-6 bg-[#F8F5EF] rounded-xl border border-[#E8DED2] space-y-3"
              >
                <h3 className="font-serif text-xl text-[#252525]">{item.type}</h3>
                <p className="text-sm text-[#57534E]">
                  <strong className="text-[#252525]">How it feels:</strong> {item.feel}
                </p>
                <p className="text-sm text-[#57534E]">
                  <strong className="text-[#252525]">Cosmetic focus:</strong> {item.focus}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/product/${item.keyPickSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#294D3B] hover:underline"
                  >
                    <Check className="w-3.5 h-3.5" /> Suggested starter: {item.keyPickName}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

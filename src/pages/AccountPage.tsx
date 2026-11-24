import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Package, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/products';
import { formatCurrency } from '../utils/format';
import { SafeImage } from '../components/common/SafeImage';
import { BACKEND_INTEGRATION_STATUS } from '../services/storefrontService';
import { useSEO } from '../utils/seo';

export function AccountPage() {
  const { wishlist, toggleWishlist, addToCart, demoOrders, savedQuiz } = useStore();

  useSEO({
    title: 'Account, Saved Items & Demo Orders',
    description:
      'View your saved LUMÉRA SKIN wishlist products, saved routine quiz recommendations, and demonstration order history.',
    canonicalPath: '/account',
  });

  const savedProducts = wishlist
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const quizProducts =
    savedQuiz?.recommendedProductIds
      .map((id) => getProductById(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)) ?? [];

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-12 lg:py-16">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E8DED2]">
          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
              Guest Profile · Local Persistence Mode
            </p>
            <h1 className="font-serif text-4xl text-[#252525]">Your LUMÉRA Space</h1>
            <p className="mt-2 text-sm text-[#57534E] max-w-2xl">
              Your wishlist, routine quiz profile, and demonstration orders are saved automatically
              in your browser. Ready for Supabase Auth & PostgreSQL sync when credentials are
              configured ({BACKEND_INTEGRATION_STATUS.supabaseConfigured ? 'Connected' : 'Demo Local Mode'}).
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#294D3B] hover:underline whitespace-nowrap"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Saved Wishlist */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#252525] flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#294D3B]" aria-hidden="true" />
              Saved Items ({savedProducts.length})
            </h2>
          </div>

          {savedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8DED2] p-8 text-center">
              <p className="text-sm text-[#57534E]">
                No saved formulas yet. Tap the heart icon on any product to build your personal
                shelf.
              </p>
              <Link
                to="/shop"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#294D3B] hover:underline"
              >
                Explore Products <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-[#E8DED2] p-4 flex items-center gap-4"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-[#F1ECE3] shrink-0"
                  >
                    <SafeImage src={product.images[0]} alt={product.imageAlt} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${product.slug}`}
                      className="block text-sm font-semibold text-[#252525] hover:text-[#294D3B] truncate"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[#57534E] tabular-nums mt-0.5">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="mt-2.5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => addToCart(product, { openDrawer: true })}
                        className="text-xs font-semibold text-[#294D3B] hover:underline"
                      >
                        Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className="text-xs text-[#57534E] hover:text-[#252525]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved Routine Quiz */}
        <section className="space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#252525] flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#294D3B]" aria-hidden="true" />
            Your Saved Routine Quiz
          </h2>

          {!savedQuiz ? (
            <div className="bg-white rounded-2xl border border-[#E8DED2] p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-[#57534E]">
                Take our 4-question cosmetic routine quiz to save personalized morning and evening
                suggestions.
              </p>
              <Link
                to="/routine"
                className="px-5 py-2.5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-xs font-semibold rounded-md whitespace-nowrap self-start sm:self-auto"
              >
                Take Routine Quiz
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8DED2] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
                <span>
                  Completed {savedQuiz.completedAt} · {savedQuiz.selection.skinType} Skin · Focus:{' '}
                  {savedQuiz.selection.primaryConcern}
                </span>
                <Link to="/routine" className="font-semibold text-[#294D3B] hover:underline">
                  Update Preferences
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {quizProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="p-3 rounded-lg bg-[#F8F5EF] border border-[#E8DED2] hover:border-[#294D3B]/40 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-[#294D3B]">
                      {product.routineStep}
                    </p>
                    <p className="text-sm font-semibold text-[#252525] mt-0.5">{product.name}</p>
                    <p className="text-xs text-[#57534E] tabular-nums mt-1">
                      {formatCurrency(product.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Demo Orders History */}
        <section className="space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#252525] flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#294D3B]" aria-hidden="true" />
            Demonstration Orders ({demoOrders.length})
          </h2>

          {demoOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8DED2] p-8 text-center">
              <p className="text-sm text-[#57534E]">
                No demonstration orders placed yet. Try completing a checkout flow to see receipts
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {demoOrders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="bg-white rounded-2xl border border-[#E8DED2] p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#F1ECE3]">
                    <div>
                      <p className="text-sm font-semibold text-[#252525] tabular-nums">
                        Order {order.orderNumber}
                      </p>
                      <p className="text-xs text-[#57534E]">
                        {order.createdAt} · {order.status}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-[#252525] tabular-nums">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[#57534E]">
                    {order.items.map((item) => (
                      <span
                        key={`${order.orderNumber}-${item.productId}-${item.sizeLabel}`}
                        className="bg-[#F8F5EF] px-3 py-1.5 rounded border border-[#E8DED2]"
                      >
                        {item.quantity}× {item.name} ({item.sizeLabel})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

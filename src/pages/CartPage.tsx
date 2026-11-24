import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProductById, PRODUCTS } from '../data/products';
import { FREE_SHIPPING_THRESHOLD, formatCurrency } from '../utils/format';
import { SafeImage } from '../components/common/SafeImage';
import { ProductCard } from '../components/products/ProductCard';
import { useSEO } from '../utils/seo';

export function CartPage() {
  const {
    cart,
    cartCount,
    subtotal,
    discount,
    shippingCost,
    taxEstimate,
    total,
    amountToFreeShipping,
    qualifiesForFreeShipping,
    appliedPromo,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ valid: boolean; message: string } | null>(null);

  useSEO({
    title: 'Shopping Bag',
    description: 'Review your LUMÉRA SKIN skincare essentials, apply promotional codes, and proceed to demonstration checkout.',
    canonicalPath: '/cart',
  });

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoMsg(res);
    if (res.valid) setPromoInput('');
  };

  const cartIds = new Set(cart.map((c) => c.productId));
  const recommendations = PRODUCTS.filter((p) => !cartIds.has(p.id)).slice(0, 3);

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-12 lg:py-16">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
              Shopping Bag
            </p>
            <h1 className="font-serif text-4xl text-[#252525]">
              Your Ritual ({cartCount})
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#294D3B] hover:underline underline-offset-4"
          >
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8DED2] p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-[#B8A99A] stroke-[1.5] mx-auto mb-3" />
            <h2 className="font-serif text-2xl text-[#252525]">Your shopping bag is empty</h2>
            <p className="mt-2 text-sm text-[#57534E] max-w-md mx-auto">
              Start with our gentle cleanser, daily moisturizer, or complete 4-step Radiance Bundle.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
            >
              Browse Skincare <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8DED2] overflow-hidden">
              {/* Free shipping bar */}
              <div className="px-6 py-4 bg-[#E8DED2]/40 border-b border-[#E8DED2]">
                <p className="text-xs font-medium text-[#252525]">
                  {qualifiesForFreeShipping
                    ? 'Complimentary US standard shipping unlocked.'
                    : `Add ${formatCurrency(amountToFreeShipping)} more to unlock complimentary US shipping (orders $${FREE_SHIPPING_THRESHOLD}+).`}
                </p>
              </div>

              <ul className="divide-y divide-[#E8DED2]">
                {cart.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  return (
                    <li
                      key={`${item.productId}-${item.sizeLabel}`}
                      className="p-6 flex flex-col sm:flex-row sm:items-center gap-5"
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-[#F1ECE3] border border-[#E8DED2] shrink-0"
                      >
                        <SafeImage src={product.images[0]} alt={product.imageAlt} />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              to={`/product/${product.slug}`}
                              className="text-base font-semibold text-[#252525] hover:text-[#294D3B]"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-[#57534E] mt-0.5">
                              {product.category} · {item.sizeLabel} · {formatCurrency(item.unitPrice)} each
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.sizeLabel)}
                            aria-label={`Remove ${product.name}`}
                            className="p-1.5 text-[#57534E] hover:text-[#252525]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="inline-flex items-center border border-[#E8DED2] rounded-md bg-[#F8F5EF]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.productId, item.sizeLabel, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="w-9 h-9 inline-flex items-center justify-center"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.productId, item.sizeLabel, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="w-9 h-9 inline-flex items-center justify-center"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-base font-semibold text-[#252525] tabular-nums">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-4 bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7 space-y-5">
              <h2 className="font-serif text-2xl text-[#252525]">Order Summary</h2>

              {/* Promo Code */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#F8F5EF] border border-[#E8DED2] rounded-md text-xs">
                    <span className="font-semibold text-[#294D3B]">
                      {appliedPromo.code} applied
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[#57534E] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePromo} className="flex gap-2">
                    <label htmlFor="cart-promo" className="sr-only">Promo code</label>
                    <input
                      id="cart-promo"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="WELCOME10 or GLOW15"
                      className="flex-1 min-w-0 px-3.5 py-2.5 text-xs bg-[#F8F5EF] border border-[#E8DED2] rounded-md focus:outline-none focus:border-[#294D3B]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 text-xs font-semibold bg-[#E8DED2] hover:bg-[#DBD0C2] text-[#252525] rounded-md whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMsg && !appliedPromo && (
                  <p
                    className={`mt-1.5 text-xs ${
                      promoMsg.valid ? 'text-[#294D3B]' : 'text-[#8B3A2B]'
                    }`}
                  >
                    {promoMsg.message}
                  </p>
                )}
              </div>

              <div className="space-y-2.5 text-sm border-t border-[#F1ECE3] pt-4">
                <div className="flex justify-between text-[#57534E]">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[#252525] font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#294D3B]">
                    <span>Discount</span>
                    <span className="tabular-nums font-medium">−{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#57534E]">
                  <span>Estimated Shipping</span>
                  <span className="tabular-nums text-[#252525] font-medium">
                    {shippingCost === 0 ? 'Complimentary' : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-[#57534E]">
                  <span>Estimated Tax (Demo)</span>
                  <span className="tabular-nums text-[#252525] font-medium">
                    {formatCurrency(taxEstimate)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#252525] pt-3 border-t border-[#F1ECE3]">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[11px] text-[#57534E] leading-relaxed">
                Demonstration storefront: cart data is persisted locally in your browser and no real
                payment processing occurs.
              </p>
            </aside>
          </div>
        )}

        {/* Recommended Additions */}
        {recommendations.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#E8DED2]">
            <h2 className="font-serif text-3xl text-[#252525] mb-7">Pair With Your Routine</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProductById, PRODUCTS } from '../../data/products';
import { FREE_SHIPPING_THRESHOLD, formatCurrency } from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

export function CartDrawer() {
  const {
    cart,
    cartCount,
    subtotal,
    discount,
    shippingCost,
    total,
    amountToFreeShipping,
    qualifiesForFreeShipping,
    appliedPromo,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    addToCart,
    applyPromoCode,
    removePromoCode,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ valid: boolean; message: string } | null>(
    null
  );

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const progressPct = Math.min(
    100,
    Math.round(((FREE_SHIPPING_THRESHOLD - amountToFreeShipping) / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.valid) setPromoInput('');
  };

  // Suggest one complementary bestseller not already in bag
  const cartProductIds = new Set(cart.map((c) => c.productId));
  const suggestedAddon = PRODUCTS.find((p) => p.isBestseller && !cartProductIds.has(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <div
        className="fixed inset-0 bg-[#252525]/45 backdrop-blur-[2px]"
        onClick={closeCart}
      />

      <aside className="relative z-10 w-full max-w-md bg-[#F8F5EF] h-full shadow-2xl flex flex-col border-l border-[#E8DED2]">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E8DED2] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-xl text-[#252525]">Your Bag</h2>
            <span className="text-xs text-[#57534E] tabular-nums">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping bag"
            className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-[#252525] hover:text-[#294D3B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div className="px-6 py-3.5 bg-[#E8DED2]/45 border-b border-[#E8DED2]">
            <p className="text-xs text-[#252525] font-medium">
              {qualifiesForFreeShipping
                ? 'Your order qualifies for complimentary US standard shipping.'
                : `Add ${formatCurrency(amountToFreeShipping)} more for complimentary US standard shipping.`}
            </p>
            <div className="mt-2 h-1.5 w-full bg-[#E8DED2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#294D3B] transition-all duration-300"
                style={{ width: `${qualifiesForFreeShipping ? 100 : progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-[#B8A99A] stroke-[1.5] mb-3" />
              <p className="font-serif text-xl text-[#252525]">Your bag is currently empty</p>
              <p className="text-sm text-[#57534E] mt-1.5 max-w-xs">
                Explore minimalist cleansers, serums, and barrier creams crafted for daily glow.
              </p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
              >
                Explore Best Sellers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-[#E8DED2]">
                {cart.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  return (
                    <li
                      key={`${item.productId}-${item.sizeLabel}`}
                      className="py-4 first:pt-0 flex gap-4"
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={closeCart}
                        className="w-20 h-20 rounded-lg overflow-hidden bg-[#F1ECE3] border border-[#E8DED2] shrink-0"
                      >
                        <SafeImage src={product.images[0]} alt={product.imageAlt} />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={closeCart}
                              className="block text-sm font-semibold text-[#252525] hover:text-[#294D3B] truncate"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-[#57534E] mt-0.5">{item.sizeLabel}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.sizeLabel)}
                            aria-label={`Remove ${product.name}`}
                            className="p-1 text-[#57534E] hover:text-[#252525] transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center border border-[#E8DED2] rounded bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.productId, item.sizeLabel, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="w-8 h-8 inline-flex items-center justify-center text-[#252525] hover:text-[#294D3B]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.productId, item.sizeLabel, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="w-8 h-8 inline-flex items-center justify-center text-[#252525] hover:text-[#294D3B]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#252525] tabular-nums">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Gentle Complementary Recommendation */}
              {suggestedAddon && (
                <div className="pt-4 border-t border-[#E8DED2]">
                  <p className="text-xs font-semibold text-[#57534E] mb-2.5">
                    Complete Your Routine
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E8DED2]">
                    <div className="w-14 h-14 rounded overflow-hidden bg-[#F1ECE3] shrink-0">
                      <SafeImage src={suggestedAddon.images[0]} alt={suggestedAddon.imageAlt} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#252525] truncate">
                        {suggestedAddon.name}
                      </p>
                      <p className="text-xs text-[#57534E] tabular-nums">
                        {formatCurrency(suggestedAddon.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(suggestedAddon, { openDrawer: true })}
                      className="px-3 py-1.5 text-xs font-semibold border border-[#294D3B] text-[#294D3B] hover:bg-[#294D3B] hover:text-[#F8F5EF] rounded-md transition-colors whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Totals & Actions */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E8DED2] space-y-4">
            {/* Promo Code */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between text-xs bg-[#F8F5EF] px-3 py-2 rounded-md border border-[#E8DED2]">
                  <span className="text-[#294D3B] font-semibold">
                    Code {appliedPromo.code} applied
                  </span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-[#57534E] hover:text-[#252525] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <label htmlFor="drawer-promo" className="sr-only">Promo code</label>
                  <input
                    id="drawer-promo"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (try WELCOME10)"
                    className="flex-1 min-w-0 px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E8DED2] rounded-md focus:outline-none focus:border-[#294D3B]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold bg-[#E8DED2] hover:bg-[#DBD0C2] text-[#252525] rounded-md transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoFeedback && !appliedPromo && (
                <p
                  className={`mt-1.5 text-xs ${
                    promoFeedback.valid ? 'text-[#294D3B]' : 'text-[#8B3A2B]'
                  }`}
                >
                  {promoFeedback.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#57534E]">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#252525] font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#294D3B]">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span className="tabular-nums font-medium">−{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#57534E]">
                <span>Estimated US Shipping</span>
                <span className="tabular-nums text-[#252525] font-medium">
                  {shippingCost === 0 ? 'Complimentary' : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#252525] pt-2 border-t border-[#F1ECE3]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
              <p className="text-[11px] text-[#57534E]">
                Includes estimated demo tax. No real payment is charged.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-xs font-medium text-[#57534E] hover:text-[#252525] underline underline-offset-4"
                >
                  Continue Shopping
                </button>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="text-xs font-semibold text-[#294D3B] hover:underline underline-offset-4"
                >
                  View Full Bag
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

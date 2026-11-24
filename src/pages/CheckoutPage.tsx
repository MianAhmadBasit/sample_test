import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/products';
import type { DemoOrder, ShippingAddress } from '../types/store';
import {
  EXPRESS_SHIPPING_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_RATE,
  formatCurrency,
  generateDemoOrderNumber,
} from '../utils/format';
import { SafeImage } from '../components/common/SafeImage';
import { useSEO } from '../utils/seo';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID',
  'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
  'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
  'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function CheckoutPage() {
  const {
    cart,
    subtotal,
    discount,
    shippingCost,
    taxEstimate,
    total,
    appliedPromo,
    shippingMethod,
    setShippingMethod,
    recordDemoOrder,
    clearCart,
    pushToast,
  } = useStore();

  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: 'NY',
    zipCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<DemoOrder | null>(null);

  useSEO({
    title: 'Checkout (Demonstration)',
    description:
      'Complete your LUMÉRA SKIN demonstration checkout. No real payment is processed in preview mode.',
    canonicalPath: '/checkout',
  });

  const updateField = <K extends keyof ShippingAddress>(key: K, value: ShippingAddress[K]) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handlePlaceDemoOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!address.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) {
      nextErrors.email = 'Enter a valid contact email.';
    }
    if (address.firstName.trim().length < 2) nextErrors.firstName = 'First name is required.';
    if (address.lastName.trim().length < 2) nextErrors.lastName = 'Last name is required.';
    if (address.address1.trim().length < 4) nextErrors.address1 = 'Street address is required.';
    if (address.city.trim().length < 2) nextErrors.city = 'City is required.';
    if (!/^\d{5}(-\d{4})?$/.test(address.zipCode.trim())) {
      nextErrors.zipCode = 'Enter a valid 5-digit US ZIP code.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      pushToast({ title: 'Please review highlighted checkout fields.' });
      return;
    }

    const orderItems = cart
      .map((item) => {
        const prod = getProductById(item.productId);
        if (!prod) return null;
        return {
          productId: item.productId,
          name: prod.name,
          sizeLabel: item.sizeLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          image: prod.images[0],
        };
      })
      .filter((i): i is NonNullable<typeof i> => Boolean(i));

    const order: DemoOrder = {
      orderNumber: generateDemoOrderNumber(),
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      items: orderItems,
      subtotal,
      discount,
      shippingCost,
      taxEstimate,
      total,
      promoCode: appliedPromo?.code,
      shippingMethod,
      shippingAddress: address,
      status: 'Demo Order Recorded',
    };

    recordDemoOrder(order);
    clearCart();
    setConfirmedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    pushToast({
      title: `Demo Order ${order.orderNumber} Confirmed`,
      description: 'Saved locally in your Account order history.',
      variant: 'success',
    });
  };

  if (confirmedOrder) {
    return (
      <div className="bg-[#F8F5EF] min-h-screen py-14 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-[#E8DED2] p-8 sm:p-10 space-y-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-7 h-7 text-[#294D3B] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#294D3B]">
                  Order {confirmedOrder.orderNumber} Confirmed · Demonstration Mode
                </p>
                <h1 className="font-serif text-3xl text-[#252525] mt-1">
                  Thank You, {confirmedOrder.shippingAddress.firstName}
                </h1>
                <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                  Your demonstration order has been recorded locally for{' '}
                  <strong className="text-[#252525]">{confirmedOrder.shippingAddress.email}</strong>.
                  No real payment was charged and no physical parcel will ship.
                </p>
              </div>
            </div>

            <div className="border-t border-[#E8DED2] pt-5 space-y-3">
              <h2 className="font-sans text-xs font-semibold tracking-[0.06em] text-[#252525]">
                Items Summary
              </h2>
              <ul className="divide-y divide-[#F1ECE3]">
                {confirmedOrder.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.sizeLabel}`}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-[#F1ECE3] shrink-0">
                        <SafeImage src={item.image} alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#252525] truncate">{item.name}</p>
                        <p className="text-xs text-[#57534E]">
                          {item.sizeLabel} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#252525] tabular-nums shrink-0">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#E8DED2] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#57534E]">
              <div>
                <p className="font-semibold text-[#252525] mb-1">Shipping Destination</p>
                <p>
                  {confirmedOrder.shippingAddress.firstName}{' '}
                  {confirmedOrder.shippingAddress.lastName}
                </p>
                <p>{confirmedOrder.shippingAddress.address1}</p>
                {confirmedOrder.shippingAddress.address2 && (
                  <p>{confirmedOrder.shippingAddress.address2}</p>
                )}
                <p>
                  {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state}{' '}
                  {confirmedOrder.shippingAddress.zipCode}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[#252525]">
                    {formatCurrency(confirmedOrder.subtotal)}
                  </span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#294D3B]">
                    <span>Discount</span>
                    <span className="tabular-nums">−{formatCurrency(confirmedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums text-[#252525]">
                    {confirmedOrder.shippingCost === 0
                      ? 'Complimentary'
                      : formatCurrency(confirmedOrder.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Demo Tax</span>
                  <span className="tabular-nums text-[#252525]">
                    {formatCurrency(confirmedOrder.taxEstimate)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#252525] pt-2 border-t border-[#F1ECE3]">
                  <span>Total (Demo)</span>
                  <span className="tabular-nums">{formatCurrency(confirmedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="px-5 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
              >
                Continue Exploring
              </Link>
              <Link
                to="/account"
                className="px-5 py-3 border border-[#E8DED2] hover:border-[#294D3B] text-[#252525] text-sm font-semibold rounded-md transition-colors"
              >
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#F8F5EF] py-20 px-4 text-center">
        <h1 className="font-serif text-3xl text-[#252525]">Your Bag Is Empty</h1>
        <p className="mt-2 text-sm text-[#57534E]">
          Add skincare essentials to your bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center px-6 py-3 bg-[#294D3B] text-[#F8F5EF] text-sm font-semibold rounded-md"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const qualifiesStandardFree = subtotal - discount >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 lg:py-14">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#294D3B] hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Bag
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-1">
            Demonstration Checkout Interface
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252525]">Checkout</h1>
        </div>

        <form
          onSubmit={handlePlaceDemoOrder}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Left Checkout Form Sections */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact Information */}
            <section className="bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7 space-y-4">
              <h2 className="font-serif text-xl text-[#252525]">01. Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="chk-email" className="block text-xs font-semibold text-[#252525] mb-1.5">
                    Contact Email
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    value={address.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#8B3A2B]">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="chk-phone" className="block text-xs font-semibold text-[#252525] mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    value={address.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 012-3456"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                  />
                </div>
              </div>
            </section>

            {/* 2. Shipping Address */}
            <section className="bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7 space-y-4">
              <h2 className="font-serif text-xl text-[#252525]">02. US Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="chk-first" className="block text-xs font-semibold text-[#252525] mb-1.5">
                    First Name
                  </label>
                  <input
                    id="chk-first"
                    type="text"
                    value={address.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Maya"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-[#8B3A2B]">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chk-last" className="block text-xs font-semibold text-[#252525] mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="chk-last"
                    type="text"
                    value={address.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Lin"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-[#8B3A2B]">{errors.lastName}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="chk-addr1" className="block text-xs font-semibold text-[#252525] mb-1.5">
                    Street Address
                  </label>
                  <input
                    id="chk-addr1"
                    type="text"
                    value={address.address1}
                    onChange={(e) => updateField('address1', e.target.value)}
                    placeholder="420 Mercer Street"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                  />
                  {errors.address1 && (
                    <p className="mt-1 text-xs text-[#8B3A2B]">{errors.address1}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="chk-addr2" className="block text-xs font-semibold text-[#252525] mb-1.5">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    id="chk-addr2"
                    type="text"
                    value={address.address2}
                    onChange={(e) => updateField('address2', e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="chk-city" className="block text-xs font-semibold text-[#252525] mb-1.5">
                    City
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    value={address.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="New York"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                  />
                  {errors.city && <p className="mt-1 text-xs text-[#8B3A2B]">{errors.city}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="chk-state" className="block text-xs font-semibold text-[#252525] mb-1.5">
                      State
                    </label>
                    <select
                      id="chk-state"
                      value={address.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                    >
                      {US_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="chk-zip" className="block text-xs font-semibold text-[#252525] mb-1.5">
                      ZIP Code
                    </label>
                    <input
                      id="chk-zip"
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                      placeholder="10012"
                      className="w-full px-3 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-xs text-[#8B3A2B]">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Shipping Method */}
            <section className="bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7 space-y-4">
              <h2 className="font-serif text-xl text-[#252525]">03. Shipping Method</h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    shippingMethod === 'standard'
                      ? 'border-[#294D3B] bg-[#F8F5EF]'
                      : 'border-[#E8DED2] hover:border-[#B8A99A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-[#294D3B]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#252525]">
                        Standard US Ground (3–5 business days)
                      </p>
                      <p className="text-xs text-[#57534E]">
                        Complimentary on orders over $50
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#252525] tabular-nums">
                    {qualifiesStandardFree || appliedPromo?.type === 'free_shipping'
                      ? 'Free'
                      : formatCurrency(STANDARD_SHIPPING_RATE)}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    shippingMethod === 'express'
                      ? 'border-[#294D3B] bg-[#F8F5EF]'
                      : 'border-[#E8DED2] hover:border-[#B8A99A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-[#294D3B]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#252525]">
                        Express 2-Day US Air
                      </p>
                      <p className="text-xs text-[#57534E]">
                        Priority fulfillment (demonstration option)
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#252525] tabular-nums">
                    {formatCurrency(EXPRESS_SHIPPING_RATE)}
                  </span>
                </label>
              </div>
            </section>

            {/* 4. Payment UI Placeholder (Explicitly Disclosed) */}
            <section className="bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-[#252525]">04. Payment (Demo Placeholder)</h2>
                <Lock className="w-4 h-4 text-[#294D3B]" aria-hidden="true" />
              </div>

              <div className="p-4 rounded-xl bg-[#F8F5EF] border border-[#E8DED2] space-y-2">
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#294D3B]">
                  <CreditCard className="w-4 h-4" /> Payment Gateway Not Connected
                </p>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  For your security, live card entry is intentionally disabled in this demonstration
                  storefront. Connect a production payment gateway (such as Stripe Payment Element
                  via a secure backend endpoint) to accept real payments.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
              >
                Place Demonstration Order · {formatCurrency(total)}
              </button>
            </section>
          </div>

          {/* Right Order Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7 space-y-5">
            <h2 className="font-serif text-xl text-[#252525]">Order Summary</h2>

            <ul className="divide-y divide-[#F1ECE3] max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <li
                    key={`${item.productId}-${item.sizeLabel}`}
                    className="py-3 first:pt-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F1ECE3] border border-[#E8DED2] shrink-0">
                        <SafeImage src={product.images[0]} alt={product.imageAlt} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#252525] truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#57534E]">
                          {item.sizeLabel} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#252525] tabular-nums shrink-0">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-[#E8DED2] pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#57534E]">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#252525] font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#294D3B]">
                  <span>Promo ({appliedPromo?.code})</span>
                  <span className="tabular-nums font-medium">−{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#57534E]">
                <span>Shipping</span>
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
                <span>Total (USD)</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-start gap-2.5 text-xs text-[#57534E]">
              <Truck className="w-4 h-4 text-[#294D3B] shrink-0 mt-0.5" aria-hidden="true" />
              <span>30-day satisfaction policy · Demonstration storefront preview.</span>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

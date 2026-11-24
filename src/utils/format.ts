import type { PromoCode, ShippingMethodId } from '../types/store';

export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING_RATE = 6;
export const EXPRESS_SHIPPING_RATE = 14;
export const DEMO_TAX_RATE = 0.0825;

export const AVAILABLE_PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME10',
    description: '10% off your first demonstration order',
    type: 'percentage',
    value: 10,
  },
  {
    code: 'GLOW15',
    description: '15% off demonstration orders over $60',
    type: 'percentage',
    value: 15,
    minSubtotal: 60,
  },
  {
    code: 'FREESHIP',
    description: 'Complimentary standard US shipping',
    type: 'free_shipping',
    value: 0,
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function validatePromoCode(
  inputCode: string,
  subtotal: number
): { valid: boolean; promo?: PromoCode; message: string } {
  const normalized = inputCode.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, message: 'Enter a promo code to apply.' };
  }

  const found = AVAILABLE_PROMO_CODES.find((p) => p.code === normalized);
  if (!found) {
    return {
      valid: false,
      message: 'Code not recognized. Try WELCOME10, GLOW15, or FREESHIP.',
    };
  }

  if (found.minSubtotal && subtotal < found.minSubtotal) {
    return {
      valid: false,
      message: `${found.code} requires a subtotal of at least ${formatCurrency(found.minSubtotal)}.`,
    };
  }

  return {
    valid: true,
    promo: found,
    message: `${found.code} applied — ${found.description}.`,
  };
}

export function calculateCartTotals(
  subtotal: number,
  promo: PromoCode | null,
  shippingMethod: ShippingMethodId = 'standard'
) {
  let discount = 0;
  if (promo && promo.type === 'percentage') {
    if (!promo.minSubtotal || subtotal >= promo.minSubtotal) {
      discount = Number(((subtotal * promo.value) / 100).toFixed(2));
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);

  let shippingCost = 0;
  if (subtotal > 0) {
    if (shippingMethod === 'express') {
      shippingCost = EXPRESS_SHIPPING_RATE;
    } else if (
      discountedSubtotal >= FREE_SHIPPING_THRESHOLD ||
      promo?.type === 'free_shipping'
    ) {
      shippingCost = 0;
    } else {
      shippingCost = STANDARD_SHIPPING_RATE;
    }
  }

  const taxEstimate = Number((discountedSubtotal * DEMO_TAX_RATE).toFixed(2));
  const total = Number((discountedSubtotal + shippingCost + taxEstimate).toFixed(2));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);

  return {
    subtotal,
    discount,
    discountedSubtotal,
    shippingCost,
    taxEstimate,
    total,
    amountToFreeShipping,
    qualifiesForFreeShipping: amountToFreeShipping === 0 && subtotal > 0,
  };
}

export function generateDemoOrderNumber(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `LM-${randomDigits}`;
}

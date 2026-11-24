import type { CartItem, DemoOrder, SavedQuizResult } from '../types/store';

/**
 * Backend-Ready Storefront Persistence Layer.
 *
 * Currently operates in browser localStorage demonstration mode.
 * Ready to connect to Supabase (PostgreSQL + Auth) by providing
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and swapping these
 * repository methods with @supabase/supabase-js queries.
 */

const STORAGE_KEYS = {
  CART: 'lumera_skin_cart_v1',
  WISHLIST: 'lumera_skin_wishlist_v1',
  ORDERS: 'lumera_skin_demo_orders_v1',
  QUIZ: 'lumera_skin_quiz_result_v1',
  NEWSLETTER: 'lumera_skin_newsletter_v1',
} as const;

export const BACKEND_INTEGRATION_STATUS = {
  mode: 'demo-local-storage' as const,
  supabaseConfigured: Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ),
  paymentGatewayConfigured: false,
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors in restricted preview sandboxes
  }
}

export const storefrontService = {
  getCart(): CartItem[] {
    return safeRead<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  saveCart(items: CartItem[]): void {
    safeWrite(STORAGE_KEYS.CART, items);
  },

  getWishlist(): string[] {
    return safeRead<string[]>(STORAGE_KEYS.WISHLIST, []);
  },
  saveWishlist(productIds: string[]): void {
    safeWrite(STORAGE_KEYS.WISHLIST, productIds);
  },

  getDemoOrders(): DemoOrder[] {
    return safeRead<DemoOrder[]>(STORAGE_KEYS.ORDERS, []);
  },
  saveDemoOrder(order: DemoOrder): DemoOrder[] {
    const existing = safeRead<DemoOrder[]>(STORAGE_KEYS.ORDERS, []);
    const updated = [order, ...existing];
    safeWrite(STORAGE_KEYS.ORDERS, updated);
    return updated;
  },

  getSavedQuizResult(): SavedQuizResult | null {
    return safeRead<SavedQuizResult | null>(STORAGE_KEYS.QUIZ, null);
  },
  saveQuizResult(result: SavedQuizResult): void {
    safeWrite(STORAGE_KEYS.QUIZ, result);
  },

  getNewsletterEmails(): string[] {
    return safeRead<string[]>(STORAGE_KEYS.NEWSLETTER, []);
  },
  subscribeNewsletter(email: string): { alreadySubscribed: boolean } {
    const normalized = email.trim().toLowerCase();
    const existing = safeRead<string[]>(STORAGE_KEYS.NEWSLETTER, []);
    if (existing.includes(normalized)) {
      return { alreadySubscribed: true };
    }
    safeWrite(STORAGE_KEYS.NEWSLETTER, [normalized, ...existing]);
    return { alreadySubscribed: false };
  },
};

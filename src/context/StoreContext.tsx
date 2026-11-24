import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../data/products';
import { storefrontService } from '../services/storefrontService';
import type {
  CartItem,
  DemoOrder,
  Product,
  PromoCode,
  SavedQuizResult,
  ShippingMethodId,
  ToastMessage,
} from '../types/store';
import { calculateCartTotals, validatePromoCode } from '../utils/format';

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  taxEstimate: number;
  total: number;
  amountToFreeShipping: number;
  qualifiesForFreeShipping: boolean;
  appliedPromo: PromoCode | null;
  shippingMethod: ShippingMethodId;
  setShippingMethod: (method: ShippingMethodId) => void;
  addToCart: (product: Product, options?: { sizeLabel?: string; quantity?: number; openDrawer?: boolean }) => void;
  removeFromCart: (productId: string, sizeLabel: string) => void;
  updateQuantity: (productId: string, sizeLabel: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { valid: boolean; message: string };
  removePromoCode: () => void;

  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;

  demoOrders: DemoOrder[];
  recordDemoOrder: (order: DemoOrder) => void;

  savedQuiz: SavedQuizResult | null;
  saveQuizResult: (result: SavedQuizResult) => void;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => storefrontService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => storefrontService.getWishlist());
  const [demoOrders, setDemoOrders] = useState<DemoOrder[]>(() => storefrontService.getDemoOrders());
  const [savedQuiz, setSavedQuiz] = useState<SavedQuizResult | null>(() =>
    storefrontService.getSavedQuizResult()
  );

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    storefrontService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    storefrontService.saveWishlist(wishlist);
  }, [wishlist]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const addToCart = useCallback(
    (
      product: Product,
      options?: { sizeLabel?: string; quantity?: number; openDrawer?: boolean }
    ) => {
      const defaultSize = product.sizes[0];
      const selectedSize =
        product.sizes.find((s) => s.label === options?.sizeLabel) ?? defaultSize;
      const quantityToAdd = Math.max(1, options?.quantity ?? 1);
      const unitPrice = Number((product.price + selectedSize.priceDelta).toFixed(2));

      setCart((prev) => {
        const idx = prev.findIndex(
          (item) => item.productId === product.id && item.sizeLabel === selectedSize.label
        );
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + quantityToAdd,
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId: product.id,
            sizeLabel: selectedSize.label,
            unitPrice,
            quantity: quantityToAdd,
          },
        ];
      });

      if (options?.openDrawer !== false) {
        setIsCartOpen(true);
      }

      pushToast({
        title: `Added ${product.name}`,
        description: `${selectedSize.label} · Qty ${quantityToAdd}`,
        variant: 'success',
      });
    },
    [pushToast]
  );

  const removeFromCart = useCallback(
    (productId: string, sizeLabel: string) => {
      const prod = getProductById(productId);
      setCart((prev) =>
        prev.filter((item) => !(item.productId === productId && item.sizeLabel === sizeLabel))
      );
      if (prod) {
        pushToast({
          title: `Removed ${prod.name}`,
          description: 'Updated your shopping bag.',
        });
      }
    },
    [pushToast]
  );

  const updateQuantity = useCallback((productId: string, sizeLabel: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) =>
        prev.filter((item) => !(item.productId === productId && item.sizeLabel === sizeLabel))
      );
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.sizeLabel === sizeLabel
          ? { ...item, quantity: Math.min(20, quantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
  }, []);

  const subtotal = useMemo(
    () => Number(cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2)),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totals = useMemo(
    () => calculateCartTotals(subtotal, appliedPromo, shippingMethod),
    [subtotal, appliedPromo, shippingMethod]
  );

  const applyPromoCode = useCallback(
    (code: string) => {
      const result = validatePromoCode(code, subtotal);
      if (result.valid && result.promo) {
        setAppliedPromo(result.promo);
        pushToast({
          title: `Promo ${result.promo.code} applied`,
          description: result.promo.description,
          variant: 'success',
        });
      }
      return { valid: result.valid, message: result.message };
    },
    [subtotal, pushToast]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    pushToast({ title: 'Promo code removed' });
  }, [pushToast]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          pushToast({ title: `Removed ${product.name} from saved items` });
          return prev.filter((id) => id !== product.id);
        }
        pushToast({
          title: `Saved ${product.name}`,
          description: 'View saved products anytime in your Account.',
          variant: 'success',
        });
        return [product.id, ...prev];
      });
    },
    [pushToast]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const recordDemoOrder = useCallback((order: DemoOrder) => {
    const updated = storefrontService.saveDemoOrder(order);
    setDemoOrders(updated);
  }, []);

  const saveQuizResult = useCallback((result: SavedQuizResult) => {
    storefrontService.saveQuizResult(result);
    setSavedQuiz(result);
  }, []);

  const value: StoreContextValue = {
    cart,
    cartCount,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingCost: totals.shippingCost,
    taxEstimate: totals.taxEstimate,
    total: totals.total,
    amountToFreeShipping: totals.amountToFreeShipping,
    qualifiesForFreeShipping: totals.qualifiesForFreeShipping,
    appliedPromo,
    shippingMethod,
    setShippingMethod,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    wishlist,
    toggleWishlist,
    isWishlisted,
    demoOrders,
    recordDemoOrder,
    savedQuiz,
    saveQuizResult,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    isSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
    quickViewProduct,
    openQuickView: (product) => setQuickViewProduct(product),
    closeQuickView: () => setQuickViewProduct(null),
    toasts,
    pushToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}

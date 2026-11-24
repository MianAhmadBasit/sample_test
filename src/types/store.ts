export type ProductCategory =
  | 'Cleansers'
  | 'Toners'
  | 'Serums'
  | 'Moisturizers'
  | 'Sun Care'
  | 'Masks & Eye Care'
  | 'Bundles';

export type SkinType =
  | 'All Skin Types'
  | 'Dry'
  | 'Oily'
  | 'Combination'
  | 'Sensitive'
  | 'Normal';

export type SkinConcern =
  | 'Acne-Prone'
  | 'Dryness'
  | 'Excess Oil'
  | 'Sensitivity'
  | 'Uneven Tone'
  | 'Dullness';

export type RoutineStep = 'Cleanse' | 'Treat' | 'Hydrate' | 'Protect';

export interface ProductSizeOption {
  label: string;
  volume: string;
  priceDelta: number;
}

export interface ProductIngredient {
  name: string;
  percentage?: string;
  role: string;
}

export interface ProductReview {
  id: string;
  author: string;
  ageRange: string;
  skinType: SkinType;
  rating: number;
  title: string;
  body: string;
  date: string;
  verifiedDemo: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  imageAlt: string;
  category: ProductCategory;
  routineStep: RoutineStep;
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  keyIngredients: ProductIngredient[];
  fullIngredientsList: string;
  howToUse: string;
  benefits: string[];
  sizes: ProductSizeOption[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  frequentlyBoughtWith: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
}

export interface PromoCode {
  code: string;
  description: string;
  type: 'percentage' | 'free_shipping';
  value: number;
  minSubtotal?: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export type ShippingMethodId = 'standard' | 'express';

export interface DemoOrder {
  orderNumber: string;
  createdAt: string;
  items: Array<{
    productId: string;
    name: string;
    sizeLabel: string;
    quantity: number;
    unitPrice: number;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  shippingCost: number;
  taxEstimate: number;
  total: number;
  promoCode?: string;
  shippingMethod: ShippingMethodId;
  shippingAddress: ShippingAddress;
  status: 'Demo Order Recorded';
}

export interface QuizSelection {
  skinType: SkinType;
  primaryConcern: SkinConcern;
  routineGoal: 'minimal' | 'complete';
  sensitivity: 'low' | 'moderate' | 'high';
}

export interface SavedQuizResult {
  completedAt: string;
  selection: QuizSelection;
  recommendedProductIds: string[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error';
}

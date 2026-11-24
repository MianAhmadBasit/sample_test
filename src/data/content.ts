import type { QuizSelection, SkinConcern } from '../types/store';
import { BRAND_ASSETS } from './products';

export const SKIN_CONCERNS_GUIDE: Array<{
  concern: SkinConcern;
  headline: string;
  summary: string;
  keyActive: string;
}> = [
  {
    concern: 'Acne-Prone',
    headline: 'Acne-Prone Skin',
    summary: 'Gentle pore-clarifying care with balanced 5% niacinamide and non-stripping washes.',
    keyActive: 'Niacinamide · Salicylic Acid',
  },
  {
    concern: 'Dryness',
    headline: 'Dry Skin',
    summary: 'Layered multi-weight humectants sealed in with ceramides and plant squalane.',
    keyActive: 'Hyaluronic Acid · Ceramides',
  },
  {
    concern: 'Excess Oil',
    headline: 'Oily Skin',
    summary: 'Featherlight, breathable hydration and zinc PCA to balance midday shine.',
    keyActive: 'Zinc PCA · PHA Toner',
  },
  {
    concern: 'Sensitivity',
    headline: 'Sensitive Skin',
    summary: 'Fragrance-free, pH-balanced formulas enriched with colloidal oat and madecassoside.',
    keyActive: 'Madecassoside · Oat Lipids',
  },
  {
    concern: 'Uneven Tone',
    headline: 'Uneven Skin Tone',
    summary: 'Gentle daytime antioxidants paired with invisible broad-spectrum SPF 50 protection.',
    keyActive: '10% THD Vitamin C · SPF 50',
  },
  {
    concern: 'Dullness',
    headline: 'Dull Skin',
    summary: 'Daily radiance boosters and subtle PHA polishing for a rested, hydrated glow.',
    keyActive: 'Ferulic Acid · Gluconolactone',
  },
];

export const ROUTINE_STEPS = [
  {
    number: '01',
    step: 'Cleanse',
    title: 'Reset Without Stripping',
    timing: 'Morning & Evening',
    description:
      'Lift excess oil, sunscreen, and daily pollutants with a pH-balanced oat amino acid gel cleanser that leaves your barrier intact.',
    productSlug: 'gentle-glow-cleanser',
    productName: 'Gentle Glow Cleanser',
  },
  {
    number: '02',
    step: 'Treat',
    title: 'Target With Purpose',
    timing: 'Choose 1–2 Serums',
    description:
      'Apply concentrated, well-tolerated actives—brightening Vitamin C in the morning, balancing Niacinamide or Hyaluronic Acid whenever needed.',
    productSlug: 'vitamin-c-brightening-serum',
    productName: 'Vitamin C Brightening Serum',
  },
  {
    number: '03',
    step: 'Hydrate',
    title: 'Seal In Comfort',
    timing: 'Morning & Evening',
    description:
      'Lock in moisture with ceramides and squalane to maintain bounce, softness, and calm-looking skin across changing climates.',
    productSlug: 'hydrating-daily-moisturizer',
    productName: 'Hydrating Daily Moisturizer',
  },
  {
    number: '04',
    step: 'Protect',
    title: 'Defend Every Morning',
    timing: 'Daily AM Step',
    description:
      'Finish every daytime routine with an invisible broad-spectrum SPF 50 fluid formulated for zero white cast across every complexion.',
    productSlug: 'daily-spf-50-sunscreen',
    productName: 'Daily SPF 50 Sunscreen',
  },
];

export const DEMO_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Amara Okafor',
    detail: '26 · Graphic Designer, Chicago · Combination Skin',
    quote:
      'Switching from an eight-step shelf to the four-step Radiance Bundle made my mornings calmer and my skin visibly more even. The SPF 50 leaves zero cast on my skin tone.',
    productUsed: 'Radiance Skincare Bundle',
  },
  {
    id: 'test-2',
    name: 'Devon Brooks',
    detail: '27 · Product Engineer, Seattle · Sensitive Skin',
    quote:
      'I wanted straightforward, fragrance-free skincare that didn’t feel like a chemistry exam. Gentle Glow Cleanser plus Hydrating Daily Moisturizer is now automatic every morning.',
    productUsed: 'Gentle Glow Cleanser',
  },
  {
    id: 'test-3',
    name: 'Camila Reyes',
    detail: '22 · Graduate Student, Austin · Dry & Dull Skin',
    quote:
      'Pressing Hyaluronic Acid Serum onto damp skin before Barrier Repair Cream completely changed how hydrated my cheeks stay during dry winter weeks.',
    productUsed: 'Hyaluronic Acid Serum',
  },
];

export const COMMUNITY_GALLERY = [
  {
    id: 'gal-1',
    image: BRAND_ASSETS.heroEditorial,
    caption: 'Morning light & four calm essentials — shared shelf energy.',
    handle: '@lumeraskin',
    productSlug: 'radiance-skincare-bundle',
  },
  {
    id: 'gal-2',
    image: BRAND_ASSETS.inclusiveRoutine,
    caption: 'Three drops of Hyaluronic Acid Serum on damp skin before heading out.',
    handle: '@lumeraskin',
    productSlug: 'hyaluronic-acid-serum',
  },
  {
    id: 'gal-3',
    image: BRAND_ASSETS.amberSerum,
    caption: '10% THD Vitamin C + Ferulic: gentle daytime luminosity in amber glass.',
    handle: '@lumeraskin',
    productSlug: 'vitamin-c-brightening-serum',
  },
  {
    id: 'gal-4',
    image: BRAND_ASSETS.textureScience,
    caption: 'Cushiony ceramide cream meets weightless humectant gel droplets.',
    handle: '@lumeraskin',
    productSlug: 'barrier-repair-cream',
  },
];

export const FAQS = [
  {
    category: 'Orders & Demo Notice',
    question: 'Is LUMÉRA SKIN an active store processing real payments?',
    answer:
      'LUMÉRA SKIN is a complete interactive e-commerce demonstration storefront. All products, inventory counts, customer reviews, pricing, and checkout confirmations are demonstration data. No real payments are charged and no physical shipments are dispatched.',
  },
  {
    category: 'Formulations',
    question: 'Are LUMÉRA SKIN products suitable for both men and women?',
    answer:
      'Yes. Skin biology is not gendered—our minimalist, fragrance-free formulations are designed for all genders, ages 18–30+, and all skin tones, with textures that absorb cleanly without heavy residue or white cast.',
  },
  {
    category: 'Formulations',
    question: 'Are your demonstration formulas cruelty-free and fragrance-free?',
    answer:
      'Our brand philosophy centers on cruelty-free positioning, transparent ingredient disclosures, and fragrance-free, skin-conscious formulations crafted without unnecessary fillers.',
  },
  {
    category: 'Routines',
    question: 'In what order should I layer my skincare products?',
    answer:
      'Follow the simple thinnest-to-thickest rule: 01. Cleanse, 02. Exfoliating Toner (evening, 2–3x weekly), 03. Water-based Serums (Hyaluronic or Niacinamide) or Vitamin C Serum, 04. Eye Cream, 05. Moisturizer, and 06. Daily SPF 50 every morning.',
  },
  {
    category: 'Shipping & Returns',
    question: 'How does shipping work in this storefront?',
    answer:
      'In our storefront demo pricing model, standard US shipping is complimentary on orders over $50 (otherwise $6), and express 2-day US shipping is $14. You can test promo codes WELCOME10, GLOW15, or FREESHIP in the cart or checkout.',
  },
  {
    category: 'Routines',
    question: 'Does the Skincare Quiz provide medical advice?',
    answer:
      'No. Our interactive Skincare Quiz provides general cosmetic routine suggestions based on your preferences and skin feel. For persistent dermatological conditions or medical concerns, please consult a board-certified dermatologist.',
  },
];

export function computeQuizRecommendations(selection: QuizSelection): {
  productIds: string[];
  summary: string;
  morningSteps: string[];
  eveningSteps: string[];
} {
  const recommended = new Set<string>();

  // Step 1: Always start with the pH-balanced cleanser
  recommended.add('prod-01');

  // Step 2: Targeted treatment based on primary concern & sensitivity
  if (selection.primaryConcern === 'Acne-Prone' || selection.primaryConcern === 'Excess Oil') {
    recommended.add('prod-04'); // Niacinamide Balance Serum
    if (selection.routineGoal === 'complete' && selection.sensitivity !== 'high') {
      recommended.add('prod-08'); // Exfoliating Facial Toner
    }
  } else if (selection.primaryConcern === 'Uneven Tone' || selection.primaryConcern === 'Dullness') {
    recommended.add('prod-03'); // Vitamin C Brightening Serum
    if (selection.routineGoal === 'complete') {
      recommended.add('prod-06'); // Hyaluronic Acid Serum
    }
  } else {
    recommended.add('prod-06'); // Hyaluronic Acid Serum for Dryness / Sensitivity
  }

  // Step 3: Moisturizer tailored to skin type & sensitivity
  if (selection.sensitivity === 'high' || selection.primaryConcern === 'Sensitivity') {
    recommended.add('prod-11'); // Barrier Repair Cream
  } else if (selection.skinType === 'Dry') {
    recommended.add('prod-02'); // Hydrating Daily Moisturizer
    if (selection.routineGoal === 'complete') {
      recommended.add('prod-07'); // Overnight Recovery Cream
    }
  } else {
    recommended.add('prod-02'); // Hydrating Daily Moisturizer
  }

  // Step 4: Always include daily SPF 50 protection
  recommended.add('prod-05');

  const summary =
    selection.routineGoal === 'minimal'
      ? `A focused ${recommended.size}-step cosmetic routine tailored for ${selection.skinType.toLowerCase()} skin prioritizing ${selection.primaryConcern.toLowerCase()} support.`
      : `A complete morning-and-evening cosmetic ritual designed for ${selection.skinType.toLowerCase()} skin focused on ${selection.primaryConcern.toLowerCase()} and daily barrier comfort.`;

  const morningSteps = [
    'Cleanse gently with lukewarm water using Gentle Glow Cleanser.',
    selection.primaryConcern === 'Uneven Tone' || selection.primaryConcern === 'Dullness'
      ? 'Apply 3–4 drops of Vitamin C Brightening Serum for daytime radiance.'
      : selection.primaryConcern === 'Acne-Prone' || selection.primaryConcern === 'Excess Oil'
        ? 'Press 3 drops of Niacinamide Balance Serum to refine shine.'
        : 'Press Hyaluronic Acid Serum onto damp skin for cushioned hydration.',
    selection.sensitivity === 'high'
      ? 'Seal moisture with Barrier Repair Cream.'
      : 'Smooth Hydrating Daily Moisturizer evenly over face and neck.',
    'Finish with two finger-lengths of Daily SPF 50 Sunscreen.',
  ];

  const eveningSteps = [
    'Wash away SPF and daily residue with Gentle Glow Cleanser.',
    selection.routineGoal === 'complete' &&
    (selection.primaryConcern === 'Acne-Prone' || selection.primaryConcern === 'Excess Oil') &&
    selection.sensitivity !== 'high'
      ? 'Use Exfoliating Facial Toner 2–3 evenings per week, followed by Niacinamide Balance Serum.'
      : 'Apply your hydrating or balancing treatment serum onto damp skin.',
    selection.skinType === 'Dry' && selection.routineGoal === 'complete'
      ? 'Lock in overnight comfort with Overnight Recovery Cream.'
      : selection.sensitivity === 'high'
        ? 'Apply a generous layer of Barrier Repair Cream to calm skin overnight.'
        : 'Finish with Hydrating Daily Moisturizer.',
  ];

  return {
    productIds: Array.from(recommended),
    summary,
    morningSteps,
    eveningSteps,
  };
}

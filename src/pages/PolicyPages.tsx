import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/content';
import { useSEO } from '../utils/seo';

export function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }),
    []
  );

  useSEO({
    title: 'Frequently Asked Questions',
    description:
      'Find clear answers on LUMÉRA SKIN formulations, routine layering, shipping thresholds, and demonstration storefront functionality.',
    canonicalPath: '/faq',
    structuredData,
  });

  return (
    <div className="bg-[#F8F5EF] py-14 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">Help Center</p>
        <h1 className="font-serif text-4xl text-[#252525]">Frequently Asked Questions</h1>
        <p className="mt-3 text-base text-[#57534E]">
          Straightforward answers on routines, ingredients, shipping estimates, and demonstration
          storefront mode.
        </p>

        <div className="mt-10 bg-white rounded-2xl border border-[#E8DED2] divide-y divide-[#E8DED2]">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.question} className="p-6">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-[#294D3B] mb-1">
                      {item.category}
                    </p>
                    <span className="text-base font-semibold text-[#252525]">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#57534E] shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3.5 text-sm text-[#57534E] leading-relaxed">{item.answer}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-sm text-[#57534E]">
          Still have a question?{' '}
          <Link to="/contact" className="font-semibold text-[#294D3B] hover:underline">
            Contact our care team
          </Link>
        </div>
      </div>
    </div>
  );
}

interface PolicyLayoutProps {
  kicker: string;
  title: string;
  updated: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
}

function PolicyLayout({ kicker, title, updated, sections }: PolicyLayoutProps) {
  return (
    <div className="bg-[#F8F5EF] py-14 lg:py-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">{kicker}</p>
        <h1 className="font-serif text-4xl text-[#252525]">{title}</h1>
        <p className="mt-2 text-xs text-[#57534E]">Effective {updated} · Demonstration Policy</p>

        <div className="mt-10 bg-white rounded-2xl border border-[#E8DED2] p-7 sm:p-10 space-y-8">
          {sections.map((sec) => (
            <section key={sec.heading} className="space-y-3">
              <h2 className="font-serif text-2xl text-[#252525]">{sec.heading}</h2>
              {sec.paragraphs.map((p) => (
                <p key={p} className="text-sm sm:text-[15px] text-[#57534E] leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

export function ShippingReturnsPage() {
  useSEO({
    title: 'Shipping & Returns Policy',
    description:
      'Review LUMÉRA SKIN US shipping rates, complimentary shipping over $50, and 30-day return guidelines.',
    canonicalPath: '/shipping-returns',
  });

  return (
    <PolicyLayout
      kicker="Delivery & Care"
      title="Shipping & Returns"
      updated="November 2026"
      sections={[
        {
          heading: 'US Domestic Shipping (Demonstration Rates)',
          paragraphs: [
            'Orders over $50 qualify for complimentary Standard US Ground shipping (3–5 business days estimated transit). Orders under $50 carry a flat $6 standard shipping fee.',
            'Express 2-Day US Air shipping is available at checkout for $14.',
          ],
        },
        {
          heading: '30-Day Satisfaction Policy',
          paragraphs: [
            'In a live retail operation, LUMÉRA SKIN accepts returns within 30 days of delivery for gently tried or unopened items. Refunds are processed back to the original payment method within 5–7 business days of inspection.',
          ],
        },
        {
          heading: 'Demonstration Storefront Notice',
          paragraphs: [
            'This website operates as an interactive e-commerce showcase. No live payment transactions or physical shipments are executed until connected to a fulfillment and payment provider.',
          ],
        },
      ]}
    />
  );
}

export function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy',
    description:
      'Learn how LUMÉRA SKIN handles local browser storage, demo preferences, and privacy transparency.',
    canonicalPath: '/privacy-policy',
  });

  return (
    <PolicyLayout
      kicker="Legal"
      title="Privacy Policy"
      updated="November 2026"
      sections={[
        {
          heading: 'Local Storage in Demonstration Mode',
          paragraphs: [
            'LUMÉRA SKIN stores your shopping bag, saved wishlist items, skincare quiz selections, and demonstration order receipts exclusively inside your browser’s localStorage.',
            'We do not transmit personal payment data or sell personal information. Clearing your browser storage removes all saved demo records immediately.',
          ],
        },
        {
          heading: 'Contact & Inquiries',
          paragraphs: [
            'For questions regarding privacy practices in this demonstration storefront, reach out via our Contact page or care@lumeraskin.example.',
          ],
        },
      ]}
    />
  );
}

export function TermsPage() {
  useSEO({
    title: 'Terms & Conditions',
    description:
      'Terms of use, cosmetic guidance disclaimers, and demonstration data notice for LUMÉRA SKIN.',
    canonicalPath: '/terms',
  });

  return (
    <PolicyLayout
      kicker="Legal"
      title="Terms & Conditions"
      updated="November 2026"
      sections={[
        {
          heading: 'Demonstration Storefront Terms',
          paragraphs: [
            'LUMÉRA SKIN is a fictional skincare brand created as a complete e-commerce application demonstration. All product descriptions, stock numbers, prices, promotional codes, and customer reviews are demonstration data.',
          ],
        },
        {
          heading: 'Cosmetic Guidance Disclaimer',
          paragraphs: [
            'All educational content, ingredient guides, and Skincare Quiz recommendations on this site are provided solely for general cosmetic skincare information. Nothing on this website constitutes medical advice, diagnosis, or treatment.',
          ],
        },
      ]}
    />
  );
}

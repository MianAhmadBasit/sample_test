import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSEO } from '../utils/seo';

export function NotFoundPage() {
  useSEO({
    title: 'Page Not Found (404)',
    description: 'The requested LUMÉRA SKIN page could not be found. Return to our skincare storefront.',
  });

  return (
    <div className="bg-[#F8F5EF] py-24 px-4 text-center">
      <div className="max-w-lg mx-auto space-y-5">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#294D3B] tabular-nums">
          Error 404
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#252525]">
          This Page Isn’t On Our Shelf.
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
          The link you followed may have moved or expired. Explore our best-selling formulas or
          build your minimalist routine below.
        </p>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
          >
            Return Home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 border border-[#252525]/25 hover:border-[#294D3B] text-[#252525] text-sm font-semibold rounded-md transition-colors"
          >
            Shop All
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { storefrontService } from '../../services/storefrontService';

export function Footer() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    const { alreadySubscribed } = storefrontService.subscribeNewsletter(trimmed);
    setSubmitted(true);
    setEmail('');
    pushToast({
      title: alreadySubscribed ? 'Already on the list' : 'Welcome to LUMÉRA SKIN',
      description: alreadySubscribed
        ? 'This demo email is already subscribed.'
        : 'Use demo code WELCOME10 at checkout for 10% off.',
      variant: 'success',
    });
  };

  return (
    <footer className="bg-[#252525] text-[#F8F5EF] border-t border-white/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              className="inline-block font-serif text-2xl tracking-[0.14em] text-[#F8F5EF]"
            >
              LUMÉRA SKIN
            </Link>
            <p className="text-sm text-[#E8DED2]/80 leading-relaxed max-w-sm tracking-[0.01em]">
              Your Skin. Your Science. Your Glow. Minimalist, fragrance-free cosmetic formulations
              crafted for healthy, hydrated, and inclusive daily routines.
            </p>
            <p className="text-xs text-[#B8A99A] leading-relaxed max-w-sm">
              Demonstration Storefront: Products, pricing, inventory, reviews, and checkout are
              interactive sample experiences for preview purposes.
            </p>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-sans text-xs font-semibold tracking-[0.08em] text-[#A6B49A]">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm text-[#E8DED2]/85">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/shop?filter=bestsellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop?category=Serums" className="hover:text-white transition-colors">Targeted Serums</Link></li>
              <li><Link to="/shop?category=Moisturizers" className="hover:text-white transition-colors">Moisturizers</Link></li>
              <li><Link to="/shop?category=Bundles" className="hover:text-white transition-colors">Routine Bundles</Link></li>
            </ul>
          </div>

          {/* Explore & Support */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-sans text-xs font-semibold tracking-[0.08em] text-[#A6B49A]">
              Learn & Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#E8DED2]/85">
              <li><Link to="/routine" className="hover:text-white transition-colors">Skincare Routine & Quiz</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About LUMÉRA</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Account & Saved</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-serif text-lg text-[#F8F5EF]">
              Thoughtful skin notes, never clutter.
            </h3>
            <p className="text-sm text-[#E8DED2]/80 leading-relaxed">
              Join for seasonal routine guides, ingredient deep dives, and demo promo code
              <span className="text-[#F8F5EF] font-medium"> WELCOME10</span>.
            </p>
            <form onSubmit={handleSubscribe} noValidate className="space-y-2">
              <div className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-md bg-white/10 border border-white/15 text-sm text-[#F8F5EF] placeholder:text-[#E8DED2]/55 focus:bg-white/15 focus:outline-none focus:border-[#A6B49A]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#A6B49A] hover:bg-[#93A485] text-[#252525] text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  Join <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {error && <p className="text-xs text-[#E8B4A0]">{error}</p>}
              {submitted && !error && (
                <p className="text-xs text-[#A6B49A]">
                  Subscribed to demo newsletter updates.
                </p>
              )}
            </form>
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#B8A99A]">
              <span>Instagram @lumeraskin</span>
              <span aria-hidden="true">·</span>
              <span>TikTok @lumeraskin</span>
              <span aria-hidden="true">·</span>
              <span>care@lumeraskin.example</span>
            </div>
          </div>
        </div>

        {/* Quiet Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#B8A99A]">
          <p>© {new Date().getFullYear()} LUMÉRA SKIN. All rights reserved. Demonstration e-commerce site.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/shipping-returns" className="hover:text-[#F8F5EF] transition-colors">
              Shipping & Returns
            </Link>
            <Link to="/privacy-policy" className="hover:text-[#F8F5EF] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#F8F5EF] transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

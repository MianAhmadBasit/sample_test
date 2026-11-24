import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/shop' },
  { label: 'Best Sellers', to: '/shop?filter=bestsellers' },
  { label: 'Routine', to: '/routine' },
  { label: 'About', to: '/about' },
];

export function Header() {
  const { cartCount, wishlist, openCart, openSearch } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#E8DED2]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 -ml-2 text-[#252525] hover:text-[#294D3B] transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[1.75]" />
          </button>
          <Link
            to="/"
            className="font-serif text-xl sm:text-2xl tracking-[0.14em] text-[#252525] hover:text-[#294D3B] transition-colors whitespace-nowrap shrink-0"
          >
            LUMÉRA SKIN
          </Link>
        </div>

        {/* Zone 2: Clean Single-Line Text Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#57534E]"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive && !item.to.includes('?')
                    ? 'text-[#252525] after:content-[""] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1.5px] after:bg-[#294D3B]'
                    : 'hover:text-[#252525]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Compact Storefront Utility Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search products"
            className="inline-flex items-center justify-center w-10 h-10 text-[#252525] hover:text-[#294D3B] rounded-md transition-colors"
          >
            <Search className="w-[19px] h-[19px] stroke-[1.75]" />
          </button>

          <Link
            to="/account"
            aria-label={`Account and saved items (${wishlist.length})`}
            className="inline-flex items-center justify-center w-10 h-10 text-[#252525] hover:text-[#294D3B] rounded-md transition-colors relative"
          >
            <User className="w-[19px] h-[19px] stroke-[1.75]" />
            {wishlist.length > 0 && (
              <span className="sr-only">{wishlist.length} saved items</span>
            )}
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.8]" aria-hidden="true" />
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums text-xs bg-[#F8F5EF]/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div
            className="fixed inset-0 bg-[#252525]/45 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-xs bg-[#F8F5EF] shadow-xl flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DED2]">
                <span className="font-serif text-lg tracking-[0.14em] text-[#252525]">
                  LUMÉRA SKIN
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex items-center justify-center w-11 h-11 -mr-2 text-[#252525] hover:text-[#294D3B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile menu links">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 text-base font-medium text-[#252525] hover:text-[#294D3B] border-b border-[#E8DED2]/60 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-base font-medium text-[#252525] hover:text-[#294D3B] border-b border-[#E8DED2]/60 transition-colors"
                >
                  Contact & FAQ
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-base font-medium text-[#252525] hover:text-[#294D3B] transition-colors flex items-center justify-between"
                >
                  <span>Account & Saved</span>
                  <span className="text-xs text-[#57534E] tabular-nums">{wishlist.length} saved</span>
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#E8DED2] space-y-3">
              <Link
                to="/routine"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 px-4 bg-[#294D3B] text-[#F8F5EF] text-sm font-semibold rounded-md hover:bg-[#1E3A2C] transition-colors"
              >
                Take Skincare Quiz
              </Link>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Demo storefront · Complimentary US shipping on orders over $50.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

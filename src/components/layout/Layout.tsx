import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from '../navigation/Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { SearchModal } from '../navigation/SearchModal';
import { QuickViewModal } from '../products/QuickViewModal';
import { ToastContainer } from '../common/ToastContainer';

export function Layout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, search]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#252525]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#294D3B] focus:text-[#F8F5EF] focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastContainer />
    </div>
  );
}

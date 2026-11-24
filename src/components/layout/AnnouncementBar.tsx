import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#294D3B] text-[#F8F5EF] text-xs leading-none">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
        <span className="hidden sm:inline-block w-6" aria-hidden="true" />
        <p className="text-center tracking-[0.02em] truncate">
          Complimentary US shipping on orders over $50
          <span className="mx-2 text-[#A6B49A]" aria-hidden="true">·</span>
          <Link to="/shop" className="underline underline-offset-4 hover:text-[#E8DED2] transition-colors">
            Demo code WELCOME10 for 10% off
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="p-1.5 -mr-1 text-[#F8F5EF]/80 hover:text-white transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

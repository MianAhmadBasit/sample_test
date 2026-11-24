import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
}

export function RatingStars({
  rating,
  reviewCount,
  size = 'sm',
  showNumber = true,
}: RatingStarsProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const rounded = Math.round(rating);

  return (
    <div
      className="inline-flex items-center gap-1.5 text-[#252525]"
      aria-label={`Rated ${rating.toFixed(1)} out of 5${reviewCount !== undefined ? ` from ${reviewCount} demo reviews` : ''}`}
    >
      <div className="inline-flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            className={`${starSize} ${
              index <= rounded
                ? 'fill-[#294D3B] text-[#294D3B]'
                : 'fill-transparent text-[#B8A99A]'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs text-[#57534E] tabular-nums">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <>
              <span className="mx-1 text-[#B8A99A]" aria-hidden="true">·</span>
              <span>({reviewCount})</span>
            </>
          )}
        </span>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Droplets } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  eager = false,
  fallbackLabel,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-[#E8DED2] text-[#252525]/70 p-6 text-center select-none"
        role="img"
        aria-label={alt}
      >
        <Droplets className="w-7 h-7 stroke-[1.5] text-[#294D3B] mb-2" aria-hidden="true" />
        <span className="font-serif text-sm tracking-wide text-[#252525]">
          {fallbackLabel ?? 'LUMÉRA SKIN'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

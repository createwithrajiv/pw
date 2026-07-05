import { useState } from 'react';
import { resolveAsset } from '@/utils/asset';
import { cn } from '@/utils/cn';

interface BlogCoverProps {
  cover?: string;
  title?: string;
  category?: string;
  variant?: 'hero' | 'card' | 'thumb';
  /** Overlay a scrim (for text over the image). */
  scrim?: boolean;
  className?: string;
}

const ASPECT: Record<NonNullable<BlogCoverProps['variant']>, string> = {
  hero: 'aspect-[2/1] sm:aspect-[21/9]',
  card: 'aspect-[16/9]',
  thumb: 'aspect-[16/9]',
};

/** Resolve a cover ref to a served URL (blog-folder image, or absolute/public path). */
function coverSrc(cover?: string): string | undefined {
  if (!cover) return undefined;
  return resolveAsset(cover) ?? (/^(https?:|\/)/.test(cover) ? cover : undefined);
}

/**
 * Cover image for a blog. Renders the image when present; otherwise a tasteful
 * gradient/mesh fallback with the category label — so cover-less posts still look
 * intentional. Reserves its aspect ratio (no layout shift).
 */
export function BlogCover({
  cover,
  title,
  category,
  variant = 'card',
  scrim = false,
  className,
}: BlogCoverProps) {
  const src = coverSrc(cover);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn('relative overflow-hidden bg-elevated', ASPECT[variant], className)}>
      {src ? (
        <>
          {!loaded && <div className="skeleton absolute inset-0" aria-hidden />}
          <img
            src={src}
            alt={title ? `Cover image for ${title}` : ''}
            loading={variant === 'hero' ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-500',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0">
          <div className="grid-overlay absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent-3/15" />
          <div className="bg-grad-radial absolute inset-0 opacity-70" />
          {category && (
            <span className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80">
              {category}
            </span>
          )}
        </div>
      )}
      {scrim && (
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/30 to-transparent" />
      )}
    </div>
  );
}

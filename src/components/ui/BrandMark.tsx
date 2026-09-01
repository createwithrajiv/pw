import { cn } from '@/utils/cn';

/**
 * The monogram square, drawn as geometry rather than a text glyph.
 *
 * It used to render the brand's first letter as text, which meant the logo
 * lockup's visible text read "R" + "RKY" while its accessible name was "RKY" —
 * a WCAG 2.5.3 mismatch that `aria-hidden` cannot fix, because that rule
 * compares the *visually rendered* text. Drawing the mark removes the duplicate
 * text node entirely, and matches the favicon.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-md bg-accent text-primary-foreground',
        className,
      )}
    >
      <svg viewBox="0 0 11 15" className="h-1/2 w-auto" fill="currentColor" role="presentation">
        <rect x="0" y="0" width="2.6" height="15" />
        <rect x="0" y="0" width="8" height="2.6" />
        <rect x="0" y="5.6" width="8" height="2.6" />
        <rect x="6.4" y="0" width="2.6" height="8.2" />
        <polygon points="4.6,8.2 7.6,8.2 11,15 8,15" />
      </svg>
    </span>
  );
}

import { useLocation } from 'react-router-dom';
import { Check, Link2, Share2 } from 'lucide-react';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { useCopy } from '@/hooks/useCopy';
import { useSeo } from '@/hooks/useContent';
import { cn } from '@/utils/cn';
import type { BlogSocialSnippets } from '@/types';

interface ShareBarProps {
  title: string;
  snippets?: BlogSocialSnippets;
  className?: string;
}

const btn =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted ' +
  'transition-colors duration-200 hover:border-accent hover:text-accent ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base';

/**
 * Share controls for an article: X and LinkedIn intents (prefilled from the
 * post's social snippets when present), copy-link, native share on mobile, and
 * an optional "copy caption" for the LinkedIn hook. Absolute URL is built from
 * the site's canonical origin so shared links point at production, not localhost.
 */
export function ShareBar({ title, snippets, className }: ShareBarProps) {
  const seo = useSeo();
  const { pathname } = useLocation();
  const url = new URL(pathname, seo.url).toString();

  const link = useCopy();
  const caption = useCopy();

  const tweetText = snippets?.twitter_hook || title;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user dismissed the share sheet — nothing to do */
      }
    } else {
      link.copy(url);
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      <span className="mr-1 text-xs font-medium uppercase tracking-[0.16em] text-subtle">Share</span>

      <a href={xHref} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className={btn}>
        <IconRenderer name="x" className="h-4 w-4" />
      </a>
      <a
        href={liHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={btn}
      >
        <IconRenderer name="linkedin" className="h-4 w-4" />
      </a>

      <button
        type="button"
        onClick={() => link.copy(url)}
        aria-label={link.copied ? 'Link copied' : 'Copy link'}
        className={btn}
      >
        {link.copied ? <Check className="h-4 w-4 text-success" /> : <Link2 className="h-4 w-4" />}
      </button>

      {/* Native share sheet — mobile only; desktop already has copy + socials. */}
      <button type="button" onClick={nativeShare} aria-label="Share" className={cn(btn, 'sm:hidden')}>
        <Share2 className="h-4 w-4" />
      </button>

      {snippets?.linkedin_hook && (
        <button
          type="button"
          onClick={() => caption.copy(snippets.linkedin_hook!)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted',
            'transition-colors duration-200 hover:border-accent hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base',
          )}
        >
          {caption.copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" aria-hidden />
              Caption copied
            </>
          ) : (
            'Copy caption'
          )}
        </button>
      )}
    </div>
  );
}

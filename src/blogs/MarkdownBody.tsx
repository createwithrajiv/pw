import { useRef, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { resolveAsset } from '@/utils/asset';
import { isExternal } from '@/utils/href';
import { useCopy } from '@/hooks/useCopy';
import { cn } from '@/utils/cn';

/** A fenced code block: language label + copy button + horizontally-scrollable code. */
function CodeBlock({ language, children }: { language: string; children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const { copied, copy } = useCopy();
  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border bg-[hsl(var(--bg-base)/0.5)] shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={() => copy(ref.current?.innerText ?? '')}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:text-accent focus-visible:text-accent"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre ref={ref} className="overflow-x-auto p-4 text-[0.875rem] leading-[1.7]">
        {children}
      </pre>
    </div>
  );
}

const components: Components = {
  a({ href, children }) {
    const ext = isExternal(href);
    return (
      <a
        href={href}
        {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="link-underline font-medium text-accent"
      >
        {children}
        {ext && <ExternalLink className="ml-0.5 inline-block h-3.5 w-3.5 align-[-2px]" aria-hidden />}
      </a>
    );
  },
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className ?? '');
    const isBlock = !!match || (className?.includes('hljs') ?? false);
    if (!isBlock) {
      return (
        <code className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
          {children}
        </code>
      );
    }
    return (
      <CodeBlock language={match?.[1] ?? ''}>
        <code className={cn('hljs', className)}>{children}</code>
      </CodeBlock>
    );
  },
  // The block wrapper is built inside `code` (CodeBlock); let <pre> pass through.
  pre({ children }) {
    return <>{children}</>;
  },
  img({ src, alt, title }) {
    const ref = typeof src === 'string' ? src : '';
    const resolved = resolveAsset(ref) ?? (/^(https?:|\/)/.test(ref) ? ref : undefined);
    if (!resolved) return alt ? <span className="text-sm text-subtle">{alt}</span> : null;
    return (
      <figure className="not-prose my-8 flex flex-col gap-2">
        <img
          src={resolved}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          className="w-full rounded-lg border border-border"
        />
        {(title || alt) && (
          <figcaption className="text-center text-sm text-subtle">{title || alt}</figcaption>
        )}
      </figure>
    );
  },
  table({ children }) {
    return (
      <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm [&_td]:border-t [&_td]:border-border [&_td]:px-4 [&_td]:py-2.5 [&_th]:border-b [&_th]:border-border-strong [&_th]:bg-surface [&_th]:px-4 [&_th]:py-2.5 [&_th]:font-medium [&_th]:text-foreground">
          {children}
        </table>
      </div>
    );
  },
};

/**
 * Full GFM markdown renderer for blog bodies — code blocks (highlighted, with a
 * copy button), inline code, lists, blockquotes, tables, links (external → new
 * tab), images (resolved from the blog folder, with captions), bold/italic, hr,
 * task lists. No raw HTML / no dangerouslySetInnerHTML → XSS-safe. Wrap the output
 * in `prose prose-blog` at the call site for typography.
 */
export function MarkdownBody({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
      {text}
    </ReactMarkdown>
  );
}

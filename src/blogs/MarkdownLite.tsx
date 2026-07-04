import { Fragment, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

/** Render inline `*emphasis*` markers as <em>. React auto-escapes → XSS-safe. */
function withEmphasis(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
      <em key={i} className="text-foreground/90">
        {part.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

interface MarkdownLiteProps {
  text: string;
  /** Class applied to each rendered <p>. */
  className?: string;
}

/**
 * Minimal markdown for blog bodies: blank-line-separated paragraphs (\n\n) →
 * <p>, and single-asterisk `*emphasis*` → <em>. No dependency, no
 * dangerouslySetInnerHTML. The content shape is deliberately simple.
 */
export function MarkdownLite({ text, className }: MarkdownLiteProps) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={cn(className)}>
          {withEmphasis(p)}
        </p>
      ))}
    </>
  );
}

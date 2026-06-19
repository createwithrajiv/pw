import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { isExternal as isExternalHref } from '@/utils/href';

interface AnimatedLinkProps {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/** Inline link with an animated gradient underline. */
export function AnimatedLink({
  href,
  external,
  className,
  children,
  onClick,
  ...rest
}: AnimatedLinkProps) {
  const isExt = external ?? isExternalHref(href);
  return (
    <a
      href={href}
      onClick={onClick}
      target={isExt ? '_blank' : undefined}
      rel={isExt ? 'noopener noreferrer' : undefined}
      className={cn('link-underline inline-flex items-center gap-1 text-foreground', className)}
      {...rest}
    >
      {children}
    </a>
  );
}

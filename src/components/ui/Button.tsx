import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { isExternal as isExternalHref } from '@/utils/href';
import { interactive } from '@/animations/variants';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  id?: string;
}

interface ButtonAsButton extends CommonProps {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface ButtonAsAnchor extends CommonProps {
  href: string;
  external?: boolean;
  download?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none';

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Three variants, one accent.
 *
 * `primary` uses `text-primary-foreground` rather than a literal white:
 * white on the dark theme's accent is only 3.68:1 and fails AA, so the token
 * flips to a near-black label in dark mode (5.12:1).
 */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-primary-foreground shadow-sm hover:bg-accent-hover',
  secondary: 'border border-border-strong bg-surface text-foreground hover:border-accent hover:text-accent',
  ghost: 'text-muted hover:bg-surface hover:text-foreground',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if ('href' in props && props.href !== undefined) {
    const external = props.external ?? isExternalHref(props.href);
    return (
      <motion.a
        href={props.href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        download={props.download}
        onClick={props.onClick}
        aria-label={props['aria-label']}
        id={props.id}
        className={classes}
        {...interactive}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={props.type ?? 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props['aria-label']}
      id={props.id}
      className={classes}
      {...interactive}
    >
      {children}
    </motion.button>
  );
}

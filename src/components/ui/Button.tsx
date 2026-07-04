import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useMagnetic } from '@/hooks/useMagnetic';
import { isExternal as isExternalHref } from '@/utils/href';
import { interactive } from '@/animations/variants';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
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
  'relative inline-flex items-center justify-center gap-2 rounded-pill font-medium tracking-tight transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none';

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-[3.25rem] px-8 text-[1rem]',
};

const variants: Record<Variant, string> = {
  primary: 'bg-grad-accent text-primary-foreground shadow-glow hover:shadow-glow-lg',
  secondary:
    'bg-surface text-foreground border border-border-strong hover:border-accent/50 hover:text-accent',
  ghost: 'bg-transparent text-muted hover:text-foreground hover:bg-surface/60',
  outline: 'bg-transparent text-foreground border border-accent/40 hover:bg-accent/10',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', magnetic = false, className, children } = props;
  const magnet = useMagnetic<HTMLElement>({ strength: 0.4 });
  const classes = cn(base, sizes[size], variants[variant], className);
  const motionProps = magnetic
    ? { ref: magnet.ref as React.Ref<any>, style: { x: magnet.x, y: magnet.y } }
    : {};
  const hover = interactive;

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
        {...hover}
        {...motionProps}
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
      {...hover}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

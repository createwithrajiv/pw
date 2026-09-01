import { cn } from '@/utils/cn';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';
import { formatNumber } from '@/utils/format';

interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Extra gate ANDed with in-view (e.g. the hero intro step). Default true. */
  start?: boolean;
}

/** Number that counts up the first time it scrolls into view. */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  start = true,
}: CounterProps) {
  const { ref, inView } = useScrollReveal({ amount: 0.6 });
  const current = useCountUp(value, { start: inView && start });
  const display = `${prefix}${formatNumber(current, decimals)}${suffix}`;
  const final = `${prefix}${formatNumber(value, decimals)}${suffix}`;

  // Screen readers get the final figure once, not the count-up churn. Expressed
  // as an sr-only sibling rather than aria-label, which is prohibited on a
  // <span> with no role.
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}

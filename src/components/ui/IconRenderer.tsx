import type { LucideProps } from 'lucide-react';
import { getIcon } from '@/constants/icons';

interface IconRendererProps extends LucideProps {
  /** Icon-name string from the JSON data (e.g. "server", "shield-check"). */
  name?: string;
}

/** Render a lucide icon by its data-driven name, falling back safely. */
export function IconRenderer({ name, ...props }: IconRendererProps) {
  const Icon = getIcon(name);
  return <Icon aria-hidden {...props} />;
}

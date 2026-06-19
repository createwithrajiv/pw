import { useMemo } from 'react';
import { settings } from '@/data';
import { sectionRegistry, type SectionRegistryEntry } from '@/constants/sectionRegistry';
import type { SectionConfig } from '@/types';

export interface ResolvedSection extends SectionConfig {
  entry: SectionRegistryEntry;
}

/**
 * The single resolver for "which sections render, in what order". Filters out
 * disabled sections, unknown ids, and (when hideWhenEmpty) empty ones, then
 * sorts by `order`. Page, nav and scrollspy all derive from this.
 */
export function useSections(): ResolvedSection[] {
  return useMemo(() => {
    return settings.sections
      .map((s) => {
        const entry = sectionRegistry[s.id];
        return entry ? { ...s, entry } : null;
      })
      .filter((s): s is ResolvedSection => s !== null)
      .filter((s) => s.enabled)
      .filter((s) => !(s.hideWhenEmpty && s.entry.isEmpty()))
      .sort((a, b) => a.order - b.order);
  }, []);
}

/** Nav items derived from the same resolved list (minus the closing CTA + hero). */
export function useNavSections(): ResolvedSection[] {
  const sections = useSections();
  return useMemo(
    () => sections.filter((s) => s.id !== 'hero' && s.id !== 'cta' && s.label.trim() !== ''),
    [sections],
  );
}

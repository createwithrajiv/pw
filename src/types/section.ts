/** Eyebrow + title + subtitle for a section's heading block, keyed by section id. */
export interface SectionCopy {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/** Map of section `id` (from website-settings.json) → its heading copy. */
export type SectionCopyData = Record<string, SectionCopy>;

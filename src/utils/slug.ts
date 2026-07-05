/** URL-safe slug from arbitrary heading text (diacritics stripped, non-alnum -> "-"). */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '') // strip combining diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

/**
 * Slugify a list of heading labels, disambiguating collisions with a numeric
 * suffix ("intro", "intro-2", ...) so every anchor id on the page is unique.
 */
export function uniqueSlugs(labels: string[]): string[] {
  const seen = new Map<string, number>();
  return labels.map((label) => {
    const base = slugify(label);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  });
}

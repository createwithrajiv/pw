/**
 * Resolves image paths referenced in the JSON data (e.g.
 * "src/data/company_logos/axtria.png") to real, hashed build URLs.
 *
 * Images under src/ are NOT served by their source path — Vite only emits a
 * URL for assets that are imported. We eagerly glob every data image once and
 * key it by filename BOTH with and without extension, so references survive the
 * `.jpg` vs `.jpeg` typos in the data.
 */
const modules = import.meta.glob('/src/data/**/*.{jpg,jpeg,png,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const byKey = new Map<string, string>();
for (const [path, url] of Object.entries(modules)) {
  const file = path.split('/').pop();
  if (!file) continue;
  const lower = file.toLowerCase();
  const stem = lower.replace(/\.[^.]+$/, '');
  byKey.set(lower, url); // exact filename (lowercased)
  byKey.set(stem, url); // filename without extension (typo-tolerant)
}

/** Resolve a data-relative image path to its built URL, or `undefined` if unknown. */
export function resolveAsset(ref?: string): string | undefined {
  if (!ref) return undefined;
  const trimmed = ref.trim();
  if (!trimmed) return undefined;
  // Already an absolute URL or public/ path → use as-is.
  if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('/')) return trimmed;
  const file = trimmed.split('/').pop();
  if (!file) return undefined;
  const lower = file.toLowerCase();
  return byKey.get(lower) ?? byKey.get(lower.replace(/\.[^.]+$/, ''));
}

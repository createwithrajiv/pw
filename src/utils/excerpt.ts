/** Excerpt = a hook's first paragraph, with markdown syntax stripped to plain text. */
export function excerpt(hook: string): string {
  const first = hook.split(/\n{2,}/)[0] ?? '';
  return first
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links / images -> their text
    .replace(/[*_`>#]/g, '') // emphasis / code / quote / heading marks
    .replace(/\s+/g, ' ')
    .trim();
}

import type { Blog } from '@/types';

/**
 * Posts most related to `current`, scored by same category (×3) + shared tags
 * (×2). Positively-scored matches come first; if there aren't enough, the list
 * is topped up with the newest remaining posts so it always fills `limit`.
 */
export function relatedPosts(all: Blog[], current: Blog, limit = 2): Blog[] {
  const currentTags = new Set(current.meta.tags);
  const scored = all
    .filter((b) => b.id !== current.id)
    .map((b) => {
      let score = 0;
      if (b.meta.category === current.meta.category) score += 3;
      score += b.meta.tags.filter((t) => currentTags.has(t)).length * 2;
      return { blog: b, score };
    })
    // Stable sort keeps newest-first order among equal scores (input is newest-first).
    .sort((a, b) => b.score - a.score);

  const related = scored.filter((s) => s.score > 0).map((s) => s.blog);
  if (related.length < limit) {
    related.push(...scored.filter((s) => s.score === 0).map((s) => s.blog));
  }
  return related.slice(0, limit);
}

/** Chronological neighbours (blogs are newest-first): `prev` = older, `next` = newer. */
export function adjacentPosts(all: Blog[], current: Blog): { prev?: Blog; next?: Blog } {
  const i = all.findIndex((b) => b.id === current.id);
  if (i === -1) return {};
  return { next: all[i - 1], prev: all[i + 1] };
}

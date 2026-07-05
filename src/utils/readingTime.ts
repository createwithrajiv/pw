import type { Blog } from '@/types';

/** Total word count across a blog's hook, section/subsection bodies, and closing. */
export function wordCount(blog: Blog): number {
  const parts = [blog.content.hook, blog.content.closing];
  for (const s of blog.content.sections) {
    if (s.body) parts.push(s.body);
    s.subsections?.forEach((sub) => parts.push(sub.body));
  }
  return parts
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** ISO-8601 duration (e.g. "PT6M") from minutes. */
export function isoDuration(minutes: number): string {
  return `PT${Math.max(1, Math.round(minutes))}M`;
}

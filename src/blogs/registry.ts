import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { Blog } from '@/types';

export type BlogArticleComponent = ComponentType<{ blog: Blog }>;

/**
 * Per-blog UI folders. Each `src/blogs/<BLOG-ID>/index.tsx` default-exports a
 * `({ blog }) => JSX` component that overrides the shared BlogArticle for that
 * one blog. The folder id matches the data folder id (src/data/blogs/<id>/), so
 * data and UI join with no extra config. Glob needs a literal /src path and only
 * matches a per-folder index.tsx, so BlogArticle.tsx / registry.ts at the blogs
 * root are excluded automatically.
 */
const modules = import.meta.glob('/src/blogs/*/index.tsx') as Record<
  string,
  () => Promise<{ default: BlogArticleComponent }>
>;

// "/src/blogs/BLOG-0001/index.tsx" -> "BLOG-0001"
const customBlogComponents: Record<string, LazyExoticComponent<BlogArticleComponent>> =
  Object.fromEntries(
    Object.entries(modules).map(([path, loader]) => [path.split('/').slice(-2, -1)[0], lazy(loader)]),
  );

/** The custom component for a blog id, or null to fall back to BlogArticle. */
export function resolveBlogComponent(id?: string): LazyExoticComponent<BlogArticleComponent> | null {
  return id ? customBlogComponents[id] ?? null : null;
}

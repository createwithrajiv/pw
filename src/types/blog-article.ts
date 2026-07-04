/**
 * Long-form blog articles. Source of truth is one JSON per folder under
 * `src/data/blogs/<BLOG-ID>/`. Distinct from the legacy homepage-teaser model in
 * `blog.ts` (BlogPost/BlogData) — do not conflate.
 */

export interface BlogSeo {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  og_title?: string;
  og_description?: string;
}

export interface BlogSocialSnippets {
  twitter_hook?: string;
  linkedin_hook?: string;
  instagram_caption?: string;
}

export interface BlogMeta {
  title: string;
  slug: string;
  author: string;
  date: string; // ISO (YYYY-MM-DD)
  read_time_minutes: number;
  category: string;
  tags: string[];
  seo: BlogSeo;
  social_snippets?: BlogSocialSnippets;
  /** Optional cover image, data-relative (resolved via resolveAsset). */
  cover?: string;
}

export interface BlogArticleSubsection {
  subheading: string;
  body: string;
}

export interface BlogArticleSection {
  heading: string;
  /** Present for a plain section; markdown-lite (\n\n paragraphs, *emphasis*). */
  body?: string;
  /** Present for a section split into subsections. */
  subsections?: BlogArticleSubsection[];
}

export interface BlogContent {
  hook: string;
  sections: BlogArticleSection[];
  closing: string;
}

export interface BlogCta {
  primary: string;
  links: Record<string, string | undefined>;
}

/** Raw JSON shape of a blog file. */
export interface BlogArticleData {
  meta: BlogMeta;
  content: BlogContent;
  cta: BlogCta;
}

/** Runtime blog = raw JSON + the folder id ("BLOG-0001") derived at load time. */
export interface Blog extends BlogArticleData {
  id: string;
}

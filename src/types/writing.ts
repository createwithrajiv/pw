export interface WritingPost {
  title: string;
  excerpt: string;
  /** Canonical URL on the newsletter. */
  url: string;
  date: string; // ISO "2026-08-11"
  tags: string[];
}

export interface NewsletterMeta {
  name: string;
  tagline: string;
  url: string;
  subscribeUrl: string;
}

export interface WritingData {
  newsletter: NewsletterMeta;
  posts: WritingPost[];
}

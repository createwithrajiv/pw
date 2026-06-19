export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO "2026-06-20"
  readingTime?: string;
  tags: string[];
  coverImage?: string;
  url?: string;
  published: boolean;
}

export interface BlogData {
  heading: string;
  eyebrow?: string;
  posts: BlogPost[];
}

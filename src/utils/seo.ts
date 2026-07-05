import type { Seo } from '@/types';

/** Build schema.org JSON-LD (Person + WebSite) from the seo data.
 *  `image`/`canonical` should be absolute URLs (resolved in the Seo component). */
export function buildJsonLd(seo: Seo, opts: { image: string; canonical: string }) {
  const personId = `${seo.person.url}#person`;
  const siteId = `${seo.url}#website`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: seo.person.name,
        jobTitle: seo.person.jobTitle,
        url: seo.person.url,
        email: seo.person.email,
        image: opts.image,
        sameAs: seo.person.sameAs,
        address: {
          '@type': 'PostalAddress',
          addressLocality: seo.person.address.locality,
          addressCountry: seo.person.address.country,
        },
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: opts.canonical,
        name: seo.title,
        description: seo.description,
        publisher: { '@id': personId },
      },
    ],
  };
}

/** Build schema.org/BlogPosting JSON-LD for an article page. */
export function buildArticleJsonLd(
  seo: Seo,
  opts: {
    headline: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    author: string;
    section?: string;
    keywords: string[];
    image: string;
    canonical: string;
    wordCount?: number;
    timeRequired?: string;
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@type': 'Person', name: opts.author, url: seo.person.url },
    publisher: { '@type': 'Person', name: seo.person.name },
    keywords: opts.keywords.join(', '),
    ...(opts.section ? { articleSection: opts.section } : {}),
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(opts.timeRequired ? { timeRequired: opts.timeRequired } : {}),
    image: opts.image,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.canonical },
  };
}

export function applyTitleTemplate(template: string, title: string): string {
  return template.includes('%s') ? template.replace('%s', title) : title;
}

import type { Seo } from '@/types';

/** Build a schema.org/Person JSON-LD object from the seo data. */
export function buildPersonJsonLd(seo: Seo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: seo.person.name,
    jobTitle: seo.person.jobTitle,
    url: seo.person.url,
    email: seo.person.email,
    sameAs: seo.person.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: seo.person.address.locality,
      addressCountry: seo.person.address.country,
    },
  };
}

export function applyTitleTemplate(template: string, title: string): string {
  return template.includes('%s') ? template.replace('%s', title) : title;
}

import { Helmet } from 'react-helmet-async';
import { useSeo } from '@/hooks/useContent';
import { applyTitleTemplate, buildPersonJsonLd } from '@/utils/seo';

interface SeoProps {
  title?: string;
  description?: string;
}

/** Dynamic document head fed from seo.json (+ optional per-page overrides). */
export function Seo({ title, description }: SeoProps) {
  const seo = useSeo();
  const pageTitle = title ? applyTitleTemplate(seo.titleTemplate, title) : seo.title;
  const pageDescription = description ?? seo.description;
  const jsonLd = buildPersonJsonLd(seo);

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seo.person.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:locale" content={seo.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={seo.ogImage} />
      {seo.twitterHandle && <meta name="twitter:site" content={seo.twitterHandle} />}

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

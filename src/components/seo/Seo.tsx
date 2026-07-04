import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSeo } from '@/hooks/useContent';
import { applyTitleTemplate, buildJsonLd } from '@/utils/seo';

interface SeoProps {
  title?: string;
  description?: string;
}

/** Dynamic document head fed from seo.json (+ optional per-page overrides). */
export function Seo({ title, description }: SeoProps) {
  const seo = useSeo();
  const { pathname } = useLocation();
  const pageTitle = title ? applyTitleTemplate(seo.titleTemplate, title) : seo.title;
  const pageDescription = description ?? seo.description;

  // Absolute URLs — social scrapers and canonical tags require them.
  const canonical = new URL(pathname, seo.url).toString();
  const ogImage = new URL(seo.ogImage, seo.url).toString();
  const jsonLd = buildJsonLd(seo, { image: ogImage, canonical });

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seo.person.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      {seo.ogImageAlt && <meta property="og:image:alt" content={seo.ogImageAlt} />}
      <meta property="og:locale" content={seo.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      {seo.ogImageAlt && <meta name="twitter:image:alt" content={seo.ogImageAlt} />}
      {seo.twitterHandle && <meta name="twitter:site" content={seo.twitterHandle} />}

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

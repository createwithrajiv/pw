import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSeo } from '@/hooks/useContent';
import { applyTitleTemplate, buildJsonLd, buildArticleJsonLd } from '@/utils/seo';

interface SeoArticle {
  headline: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

interface SeoProps {
  title?: string;
  description?: string;
  /** Overrides the keywords meta (defaults to the site keywords). */
  keywords?: string[];
  ogType?: 'website' | 'article';
  /** When present, emits article OG tags + BlogPosting JSON-LD. */
  article?: SeoArticle;
}

/** Dynamic document head fed from seo.json (+ optional per-page overrides). */
export function Seo({ title, description, keywords, ogType, article }: SeoProps) {
  const seo = useSeo();
  const { pathname } = useLocation();
  const pageTitle = title ? applyTitleTemplate(seo.titleTemplate, title) : seo.title;
  const pageDescription = description ?? seo.description;
  const type = article ? 'article' : ogType ?? 'website';

  // Absolute URLs — social scrapers and canonical tags require them.
  const canonical = new URL(pathname, seo.url).toString();
  const ogImage = new URL(seo.ogImage, seo.url).toString();
  const jsonLd = article
    ? buildArticleJsonLd(seo, {
        headline: article.headline,
        description: pageDescription,
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime,
        author: article.author ?? seo.person.name,
        section: article.section,
        keywords: keywords ?? seo.keywords,
        image: ogImage,
        canonical,
      })
    : buildJsonLd(seo, { image: ogImage, canonical });

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={(keywords ?? seo.keywords).join(', ')} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={seo.person.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      {seo.ogImageAlt && <meta property="og:image:alt" content={seo.ogImageAlt} />}
      <meta property="og:locale" content={seo.locale} />

      {/* Article */}
      {article && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article && (
        <meta property="article:author" content={article.author ?? seo.person.name} />
      )}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((t) => (
        <meta key={t} property="article:tag" content={t} />
      ))}

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

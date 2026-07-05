import { Component, Suspense, type ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Seo } from '@/components/seo/Seo';
import { useBlogBySlug, useSeo } from '@/hooks/useContent';
import { resolveBlogComponent } from '@/blogs/registry';
import { ArticleSkeleton } from '@/blogs/BlogSkeleton';
import { resolveAsset } from '@/utils/asset';
import { wordCount, isoDuration } from '@/utils/readingTime';
import BlogArticle from '@/blogs/BlogArticle';

/** If a custom per-blog component throws, fall back to the default BlogArticle. */
class CustomBlogBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const blog = useBlogBySlug(slug);
  const seo = useSeo();

  if (!blog) return <Navigate to="/404" replace />;

  const Custom = resolveBlogComponent(blog.id);
  const cover = resolveAsset(blog.meta.cover);

  const articleSeo = (
    <Seo
      title={blog.meta.seo.meta_title}
      description={blog.meta.seo.meta_description}
      keywords={blog.meta.seo.keywords}
      image={cover}
      article={{
        headline: blog.meta.title,
        publishedTime: blog.meta.date,
        author: seo.person.name,
        section: blog.meta.category,
        tags: blog.meta.tags,
        wordCount: wordCount(blog),
        timeRequired: isoDuration(blog.meta.read_time_minutes),
      }}
    />
  );

  if (!Custom) {
    return (
      <>
        {articleSeo}
        <BlogArticle blog={blog} />
      </>
    );
  }

  return (
    <>
      {articleSeo}
      <CustomBlogBoundary fallback={<BlogArticle blog={blog} />}>
        <Suspense fallback={<ArticleSkeleton />}>
          <Custom blog={blog} />
        </Suspense>
      </CustomBlogBoundary>
    </>
  );
}

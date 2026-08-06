import { useLocation } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { cn } from '@/utils/cn';

/** Article-shaped placeholder shown while the lazy blog chunk / post loads. */
export function ArticleSkeleton() {
  return (
    <div className="relative pb-28 pt-24" role="status" aria-label="Loading article">
      <Container width="default">
        <div className="mx-auto max-w-[64rem]">
          <div className="skeleton h-4 w-40 rounded" />
          <div className="skeleton mt-5 aspect-[2/1] w-full rounded-2xl sm:aspect-[21/9]" />
        </div>
        <div className="mx-auto mt-10 max-w-[44rem]">
          <div className="skeleton h-6 w-24 rounded-md" />
          <div className="mt-6 flex flex-col gap-3">
            <div className="skeleton h-9 w-full rounded-lg" />
            <div className="skeleton h-9 w-3/4 rounded-lg" />
          </div>
          <div className="mt-7 flex items-center gap-3">
            <div className="skeleton h-11 w-11 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="skeleton h-3 w-28 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn('skeleton h-4 rounded', i % 3 === 2 ? 'w-2/3' : 'w-full')} />
            ))}
          </div>
        </div>
      </Container>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Listing-shaped placeholder (header + cover-card grid). */
export function ListingSkeleton() {
  return (
    <div className="pb-24 pt-32" role="status" aria-label="Loading posts">
      <Container>
        <div className="skeleton h-10 w-56 rounded-lg" />
        <div className="skeleton mt-4 h-4 w-96 max-w-full rounded" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="panel overflow-hidden rounded-2xl">
              <div className="skeleton aspect-[16/9] w-full" />
              <div className="flex flex-col gap-3 p-6">
                <div className="skeleton h-5 w-24 rounded-md" />
                <div className="skeleton h-5 w-full rounded" />
                <div className="skeleton h-4 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Container>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Picks the right skeleton for the pending blog route (article vs. listing). */
export function RouteSkeleton() {
  const { pathname } = useLocation();
  const isArticle = /^\/blogs\/[^/]+/.test(pathname);
  return isArticle ? <ArticleSkeleton /> : <ListingSkeleton />;
}

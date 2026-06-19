import { ArrowLeft } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Not found" />
      <Container className="flex min-h-[100svh] flex-col items-center justify-center gap-6 text-center">
        <div className="bg-grid-static absolute inset-0 -z-10 opacity-30" aria-hidden />
        <p className="eyebrow">Error 404</p>
        <h1 className="text-display font-display font-semibold">
          <GradientText>Lost in the vector space</GradientText>
        </h1>
        <p className="max-w-md text-lead text-muted">
          This page doesn't exist — or it scaled to zero. Let's get you back.
        </p>
        <Button href="/" magnetic>
          <ArrowLeft className="h-4 w-4" /> Back home
        </Button>
      </Container>
    </>
  );
}

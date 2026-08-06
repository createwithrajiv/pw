import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNavSections } from '@/hooks/useSections';
import { useProfile, useSocial, useNavigation } from '@/hooks/useContent';
import { scrollTo } from '@/utils/scroll';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { GradientText } from '@/components/ui/GradientText';
import { MotionToggle } from '@/components/layout/MotionToggle';
import { currentYear } from '@/utils/format';
import { settings } from '@/data';

export function Footer() {
  const profile = useProfile();
  const social = useSocial();
  const navigation = useNavigation();
  const navSections = useNavSections();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // On home, smooth-scroll to the section; elsewhere navigate home with the hash
  // (useHashScroll in RootLayout finishes the scroll once HomePage mounts).
  const go = (anchor: string) => {
    if (pathname === '/') scrollTo(anchor);
    else navigate(`/${anchor}`);
  };

  return (
    <footer className="relative border-t border-border bg-base/40">
      <div className="mx-auto grid w-full max-w-container gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.5fr_1fr_auto] lg:px-8">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => go('#hero')}
            className="flex items-center gap-2 self-start text-lg font-display font-bold"
            aria-label="Back to top"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md bg-grad-accent text-primary-foreground shadow-glow">
              {settings.brandShortName.slice(0, 1)}
            </span>
            <GradientText>{navigation.brand}</GradientText>
          </button>
          <p className="max-w-sm text-sm text-muted">{profile.tagline}.</p>
          <div className="mt-2 flex gap-3">
            {social.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="grid h-10 w-10 place-items-center rounded-pill border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <IconRenderer name={s.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <span className="eyebrow mb-2">Explore</span>
          {navSections.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.anchor)}
              className="self-start text-sm text-muted transition-colors hover:text-accent"
            >
              {s.label}
            </button>
          ))}
          <Link
            to="/blogs"
            className="self-start text-sm text-muted transition-colors hover:text-accent"
          >
            My Blogs
          </Link>
        </nav>

        <div className="flex flex-col gap-3">
          <span className="eyebrow mb-2">Preferences</span>
          <MotionToggle />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-container flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-subtle sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {currentYear()} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono">Built with React · Three.js · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}

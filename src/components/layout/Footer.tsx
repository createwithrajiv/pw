import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNavSections } from '@/hooks/useSections';
import { useProfile, useSocial, useNavigation } from '@/hooks/useContent';
import { scrollTo } from '@/utils/scroll';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { BrandMark } from '@/components/ui/BrandMark';
import { currentYear } from '@/utils/format';

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

  const linkClass =
    'self-start text-sm text-muted transition-colors duration-200 hover:text-accent';

  return (
    <footer className="relative border-t border-border bg-base">
      <div className="mx-auto grid w-full max-w-container gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => go('#hero')}
            className="flex items-center gap-2 self-start font-sans text-base font-bold"
            aria-label={`${navigation.brand} - back to top`}
          >
            <BrandMark className="h-8 w-8" />
            {navigation.brand}
          </button>
          <p className="max-w-sm text-sm text-muted">{profile.tagline}.</p>
          <div className="mt-1 flex gap-2">
            {social.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <IconRenderer name={s.icon} className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <span className="eyebrow">Explore</span>
          {/* Two columns, so a dozen links don't stretch the footer into a page
              of its own. grid-flow-col fills the first column downward first. */}
          <div className="grid grid-flow-col grid-rows-6 gap-x-12 gap-y-2">
            {navSections.map((s) => (
              <button key={s.id} onClick={() => go(s.anchor)} className={linkClass}>
                {s.label}
              </button>
            ))}
            <Link to="/blogs" className={linkClass}>
              My Blogs
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-container px-5 py-5 text-center text-xs text-muted sm:px-6 lg:px-8">
          © {currentYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

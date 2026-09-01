import { useLocation, useNavigate } from 'react-router-dom';
import { writing } from '@/data';
import { useNavSections } from '@/hooks/useSections';
import { useProfile, useSocial, useNavigation } from '@/hooks/useContent';
import { scrollTo } from '@/utils/scroll';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { BrandMark } from '@/components/ui/BrandMark';
import { currentYear } from '@/utils/format';

const NEWSLETTER_URL = writing.newsletter.url;

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

  // justify-self-start + text-left: a stretched <button> centres its label by
  // default, which left the link columns ragged against the <a> beside them.
  const linkClass =
    'justify-self-start text-left text-sm text-muted transition-colors duration-200 hover:text-accent';

  return (
    <footer className="relative border-t border-border bg-base">
      {/* Three even columns so the width is filled rather than leaving a void
          between a hard-left brand and a hard-right link list. */}
      <div className="mx-auto grid w-full max-w-container gap-10 px-5 py-12 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => go('#hero')}
            className="flex items-center gap-2 self-start font-sans text-base font-bold"
            aria-label={`${navigation.brand} - back to top`}
          >
            <BrandMark className="h-8 w-8" />
            {navigation.brand}
          </button>
          <p className="max-w-xs text-sm text-muted">{profile.tagline}.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <span className="eyebrow text-center">Explore</span>
          {/* CSS multi-column rather than grid-flow-col: it balances the items
              across the three columns on its own, so adding a link never leaves
              a stranded single entry in the last column the way a fixed
              grid-rows count does. */}
          <div className="columns-3 gap-x-6 [&>*]:mb-2 [&>*]:block [&>*]:break-inside-avoid">
            {navSections.map((s) => (
              <button key={s.id} onClick={() => go(s.anchor)} className={linkClass}>
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-3">
          <span className="eyebrow">Connect</span>
          <a
            href={NEWSLETTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            The Hot Path - newsletter
          </a>
          <a href={`mailto:${profile.email}`} className={linkClass}>
            {profile.email}
          </a>
          <p className="text-sm text-muted">{profile.location}</p>
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
      </div>

      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-container px-5 py-5 text-center text-xs text-muted sm:px-6 lg:px-8">
          © {currentYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

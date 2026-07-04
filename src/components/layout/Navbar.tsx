import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useNavSections } from '@/hooks/useSections';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';
import { useNavigation, useSocial } from '@/hooks/useContent';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GradientText } from '@/components/ui/GradientText';
import { IconRenderer } from '@/components/ui/IconRenderer';
import { settings } from '@/data';

export function Navbar() {
  const navSections = useNavSections();
  const navigation = useNavigation();
  const social = useSocial();
  const { scrollTo } = useSmoothScroll();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onBlog = pathname.startsWith('/blogs');
  const ids = navSections.map((s) => s.anchor.replace('#', ''));
  const active = useActiveSection(ids);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLockBodyScroll(menuOpen);

  // Stays fixed at the top the whole time; only its background reacts to scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (anchor: string) => {
    setMenuOpen(false);
    if (pathname === '/') {
      scrollTo(anchor);
      history.replaceState(null, '', anchor);
    } else {
      // Off the home route: navigate home with the hash; useHashScroll (RootLayout)
      // scrolls to the section once HomePage mounts.
      navigate(`/${anchor}`);
    }
  };

  return (
    <motion.header className="fixed inset-x-0 top-0 z-[95] flex justify-center px-4 pt-4">
      <nav
        aria-label="Primary"
        className={cn(
          'flex w-full max-w-container-wide items-center justify-between gap-4 rounded-pill px-4 py-2.5 transition-all duration-300',
          scrolled ? 'glass shadow-md' : 'border border-transparent',
        )}
      >
        <button
          onClick={() => go('#hero')}
          className="flex items-center gap-2 rounded-pill px-1 text-sm font-display font-bold"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-grad-accent text-primary-foreground shadow-glow">
            {settings.brandShortName.slice(0, 1)}
          </span>
          <GradientText className="hidden sm:inline">{settings.brandShortName}</GradientText>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navSections.map((s) => {
            const id = s.anchor.replace('#', '');
            const isActive = !onBlog && active === id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => go(s.anchor)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-pill bg-surface"
                      transition={{ type: 'spring', stiffness: 200, damping: 26, mass: 0.6 }}
                    />
                  )}
                  {s.label}
                </button>
              </li>
            );
          })}
          <li>
            <Link
              to="/blogs"
              aria-current={onBlog ? 'page' : undefined}
              className={cn(
                'relative rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors',
                onBlog ? 'text-foreground' : 'text-muted hover:text-foreground',
              )}
            >
              {onBlog && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-pill bg-surface"
                  transition={{ type: 'spring', stiffness: 200, damping: 26, mass: 0.6 }}
                />
              )}
              My Blogs
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {navigation.cta && (
            <div className="hidden sm:block">
              <Button href={navigation.cta.href} size="sm" magnetic>
                {navigation.cta.label}
              </Button>
            </div>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-pill border border-border bg-surface/60 text-foreground lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[-1] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-overlay/70 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="glass absolute right-0 top-0 flex h-full w-[min(80vw,320px)] flex-col gap-2 overflow-y-auto p-6 pt-24"
              role="dialog"
              aria-label="Navigation menu"
            >
              {navSections.map((s) => {
                const id = s.anchor.replace('#', '');
                return (
                  <button
                    key={s.id}
                    onClick={() => go(s.anchor)}
                    className={cn(
                      'rounded-md px-3 py-3 text-left text-h3 font-display transition-colors',
                      !onBlog && active === id ? 'text-accent' : 'text-foreground hover:text-accent',
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
              <Link
                to="/blogs"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'rounded-md px-3 py-3 text-left text-h3 font-display transition-colors',
                  onBlog ? 'text-accent' : 'text-foreground hover:text-accent',
                )}
              >
                My Blogs
              </Link>
              {navigation.cta && (
                <div className="mt-4">
                  <Button href={navigation.cta.href} className="w-full">
                    {navigation.cta.label}
                  </Button>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                {social.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="grid h-10 w-10 place-items-center rounded-pill border border-border text-muted hover:border-accent/50 hover:text-accent"
                  >
                    <IconRenderer name={s.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

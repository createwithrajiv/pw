/** Visually-hidden-until-focused skip link — first focusable element on the page. */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only z-[300] rounded-md bg-accent px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
  );
}

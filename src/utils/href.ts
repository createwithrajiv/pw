/**
 * The data often uses "#" as a placeholder link. Treat those (and empty values)
 * as "no real link" so we can hide or disable the corresponding action.
 */
export function isRealHref(href?: string): href is string {
  return !!href && href.trim() !== '' && href.trim() !== '#';
}

export function isExternal(href?: string): boolean {
  if (!href) return false;
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

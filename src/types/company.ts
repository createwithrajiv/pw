export interface Company {
  name: string;
  /** Resolved at the data boundary from a src/data path → built URL. */
  logo?: string;
  /** Company website; null when the company has no site. */
  website?: string | null;
}

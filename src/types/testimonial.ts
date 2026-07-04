export interface Testimonial {
  quote: string; // short pull-quote
  author: string;
  role: string;
  company: string;
  /** Resolved at the data boundary from a src/data path → built URL. */
  company_logo?: string;
  profile_picture?: string;
  /** Long-form recommendation; paragraphs separated by "\n". */
  detailed_quote?: string;
}

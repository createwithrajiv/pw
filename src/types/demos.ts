export interface Demo {
  /** Short title of what the recording shows. */
  title: string;
  /** Which company / client the work was for. */
  company: string;
  /** One or two lines on what the walkthrough demonstrates. */
  summary: string;
  /** Full YouTube URL. MUST point at a video set to Private, not Unlisted. */
  url: string;
  /** e.g. "6 min" — optional. */
  duration?: string;
  tags?: string[];
}

export interface DemosData {
  /** Copy shown to visitors who cannot open the recordings. */
  notice: string;
  items: Demo[];
}

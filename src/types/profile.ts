export interface Stat {
  value: string; // "20+", "99.9%", "500K+", "3+"
  label: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  email: string;
  location: string;
  availability: string;
  resumeUrl: string;
  image: string;
  stats: Stat[];
}

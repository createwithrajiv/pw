export interface Project {
  title: string;
  description: string;
  highlights?: string[]; // OPTIONAL — some projects omit it
  tags: string[];
  category: string;
  link: string; // often "#"
  github?: string; // OPTIONAL — some projects omit it
  featured: boolean;
}

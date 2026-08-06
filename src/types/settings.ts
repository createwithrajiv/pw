export type ThemeMode = 'light' | 'dark' | 'system';

export interface SectionConfig {
  id: string; // stable key — matches a section registry entry
  label: string; // nav label
  anchor: string; // hash target, e.g. "#projects"
  enabled: boolean;
  order: number;
  hideWhenEmpty: boolean;
}

export interface WebsiteSettings {
  themeDefault: ThemeMode;
  brandShortName: string;
  sections: SectionConfig[];
}

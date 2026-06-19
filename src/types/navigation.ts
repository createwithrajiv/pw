export interface NavLink {
  label: string;
  anchor: string;
  external?: boolean;
}

export interface NavigationData {
  brand: string;
  links: NavLink[];
  cta?: { label: string; href: string };
}

export interface CtaButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost';
  external?: boolean;
}

export interface Cta {
  eyebrow?: string;
  heading: string;
  subheading: string;
  buttons: CtaButton[];
}

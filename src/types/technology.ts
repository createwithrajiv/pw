export interface Technology {
  name: string;
  icon?: string;
  url?: string;
}

export interface TechnologiesData {
  heading?: string;
  items: Technology[];
}

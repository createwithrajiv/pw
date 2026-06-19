export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  heading: string;
  eyebrow?: string;
  items: FaqItem[];
}

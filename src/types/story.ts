export interface StoryParagraph {
  heading?: string;
  body: string;
}

export interface PersonalStory {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  paragraphs: StoryParagraph[];
  portraitImage?: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ValuesData {
  heading: string;
  items: ValueItem[];
}

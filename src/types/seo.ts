export interface PersonSchema {
  name: string;
  jobTitle: string;
  url: string;
  email: string;
  sameAs: string[];
  address: { locality: string; country: string };
}

export interface Seo {
  title: string;
  titleTemplate: string; // e.g. "%s · Rajiv Yadav"
  description: string;
  keywords: string[];
  url: string; // canonical site URL
  ogImage: string;
  twitterHandle: string;
  locale: string; // "en_US"
  person: PersonSchema;
}

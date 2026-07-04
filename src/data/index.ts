/**
 * The single source of truth boundary.
 *
 * Every JSON file is imported exactly ONCE here and cast to its interface.
 * Components/hooks never import a .json file directly — they read from this
 * module (via the useContent hooks). Editing any JSON updates the whole site
 * with zero code changes; a JSON that violates its interface fails to compile
 * right here, which is the intended early signal.
 */
import profileJson from './profile.json';
import skillsJson from './skills.json';
import servicesJson from './services.json';
import experienceJson from './experience.json';
import projectsJson from './projects.json';
import testimonialsJson from './testimonials.json';
import socialJson from './social.json';
import companiesJson from './companies.json';

import settingsJson from './website-settings.json';
import seoJson from './seo.json';
import navigationJson from './navigation.json';
import metricsJson from './metrics.json';
import personalStoryJson from './personal-story.json';
import valuesJson from './values.json';
import ctaJson from './cta.json';
import certificationsJson from './certifications.json';
import blogJson from './blog.json';
import faqJson from './faq.json';
import technologiesJson from './technologies.json';
import animationsJson from './animations.json';
import sectionCopyJson from './section-copy.json';

import type {
  Profile,
  SkillsData,
  Service,
  Experience,
  Project,
  Testimonial,
  Social,
  Company,
  WebsiteSettings,
  Seo,
  NavigationData,
  MetricsData,
  PersonalStory,
  ValuesData,
  Cta,
  Certification,
  BlogData,
  FaqData,
  TechnologiesData,
  AnimationTokens,
  SectionCopyData,
  Blog,
  BlogArticleData,
} from '@/types';
import { resolveAsset } from '@/utils/asset';

const rawProfile = profileJson as Profile;
export const profile: Profile = {
  ...rawProfile,
  image: resolveAsset(rawProfile.image) ?? rawProfile.image,
};
export const skills = skillsJson as SkillsData;
export const services = servicesJson as Service[];
export const experience: Experience[] = (experienceJson as Experience[]).map((e) => ({
  ...e,
  company_logo: resolveAsset(e.company_logo),
}));
export const projects = projectsJson as Project[];
export const testimonials: Testimonial[] = (testimonialsJson as Testimonial[]).map((t) => ({
  ...t,
  company_logo: resolveAsset(t.company_logo),
  profile_picture: resolveAsset(t.profile_picture),
}));
export const social = socialJson as Social[];

/** Central company metadata (logo + website), logos resolved to built URLs. */
export const companies: Company[] = (companiesJson as Company[]).map((c) => ({
  ...c,
  logo: resolveAsset(c.logo),
}));
/** Lookup a company by its exact name (matches `experience.company`). */
export const companiesByName: Record<string, Company> = Object.fromEntries(
  companies.map((c) => [c.name, c]),
);

export const settings = settingsJson as WebsiteSettings;
/** ogImage is a stable public path (e.g. /profile.jpg) — do NOT run it through
 *  resolveAsset (that hashes it and breaks social scrapers). It's resolved to an
 *  absolute URL against `seo.url` in the Seo component. */
export const seo = seoJson as Seo;
export const navigation = navigationJson as NavigationData;
export const metrics = metricsJson as MetricsData;
export const personalStory = personalStoryJson as PersonalStory;
export const values = valuesJson as ValuesData;
export const cta = ctaJson as Cta;
export const certifications = certificationsJson as Certification[];
export const blog = blogJson as BlogData;
export const faq = faqJson as FaqData;
export const technologies = technologiesJson as TechnologiesData;
export const animations = animationsJson as AnimationTokens;

/** Section heading copy (eyebrow/title/subtitle) keyed by section id. */
export const sectionCopy = sectionCopyJson as SectionCopyData;

/**
 * Long-form blog articles. Each blog is one JSON under `src/data/blogs/<id>/`,
 * glob-loaded here (literal /src path — the @ alias doesn't work in glob). The
 * folder id (e.g. "BLOG-0001") is derived from the path and also keys the
 * per-blog UI folder in src/blogs/<id>/. Adding a blog = drop a JSON file.
 */
const blogModules = import.meta.glob('/src/data/blogs/*/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, BlogArticleData>;

export const blogs: Blog[] = Object.entries(blogModules)
  .map(([path, data]) => ({ id: path.split('/').slice(-2, -1)[0], ...data }))
  .sort((a, b) => +new Date(b.meta.date) - +new Date(a.meta.date)); // newest first

export const blogBySlug: Record<string, Blog> = Object.fromEntries(
  blogs.map((b) => [b.meta.slug, b]),
);

/* Derived selectors (still no hardcoded copy). */
export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const publishedPosts = blog.posts.filter((p) => p.published);
export const projectCategories = Array.from(new Set(projects.map((p) => p.category)));

/** Companies that have a logo — the trust wall (each may carry a website link). */
export const companyLogos: Company[] = companies.filter((c) => !!c.logo);

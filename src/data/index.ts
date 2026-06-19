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

import type {
  Profile,
  SkillsData,
  Service,
  Experience,
  Project,
  Testimonial,
  Social,
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
} from '@/types';

export const profile = profileJson as Profile;
export const skills = skillsJson as SkillsData;
export const services = servicesJson as Service[];
export const experience = experienceJson as Experience[];
export const projects = projectsJson as Project[];
export const testimonials = testimonialsJson as Testimonial[];
export const social = socialJson as Social[];

export const settings = settingsJson as WebsiteSettings;
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

/* Derived selectors (still no hardcoded copy). */
export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const publishedPosts = blog.posts.filter((p) => p.published);
export const projectCategories = Array.from(new Set(projects.map((p) => p.category)));

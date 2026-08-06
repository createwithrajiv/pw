/**
 * Per-dataset accessors. Components depend on these hooks; the hooks depend on
 * the typed data module. This is the stable seam: if data ever moves to a CMS
 * or fetch, only these bodies change — not the 14 section components.
 */
import * as content from '@/data';

export const useProfile = () => content.profile;
export const useSkills = () => content.skills;
export const useServices = () => content.services;
export const useExperience = () => content.experience;
export const useProjects = () => content.projects;
export const useFeaturedProjects = () => content.featuredProjects;
export const useOtherProjects = () => content.otherProjects;
export const useProjectCategories = () => content.projectCategories;
export const useTestimonials = () => content.testimonials;
export const useCompanyLogos = () => content.companyLogos;
export const useCompanies = () => content.companiesByName;
export const useSocial = () => content.social;
export const useSettings = () => content.settings;
export const useSeo = () => content.seo;
export const useNavigation = () => content.navigation;
export const useMetrics = () => content.metrics;
export const usePersonalStory = () => content.personalStory;
export const useValues = () => content.values;
export const useCta = () => content.cta;
export const useCertifications = () => content.certifications;
export const useBlog = () => content.blog;
export const usePublishedPosts = () => content.publishedPosts;
export const useFaq = () => content.faq;
export const useTechnologies = () => content.technologies;

/** Heading copy (eyebrow/title/subtitle) for a section id — source of truth for section headings. */
export const useSectionCopy = (id: string) => content.sectionCopy[id];

/** All blog articles, newest first. */
export const useBlogs = () => content.blogs;
/** A single blog by its slug (undefined if not found). */
export const useBlogBySlug = (slug?: string) => (slug ? content.blogBySlug[slug] : undefined);

/** Aggregate accessor if a component wants several datasets at once. */
export const useContent = () => content;

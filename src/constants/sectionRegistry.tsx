import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  services,
  skills,
  experience,
  projects,
  testimonials,
  certifications,
  metrics,
  personalStory,
  values,
  faq,
  writing,
  companyLogos,
} from '@/data';

export interface SectionRegistryEntry {
  Component: LazyExoticComponent<ComponentType>;
  /** Returns true when the section has no meaningful content to show. */
  isEmpty: () => boolean;
}

/**
 * Maps a section `id` (from website-settings.json) to its component + an
 * emptiness predicate. Adding a new section = one entry here + one entry in
 * website-settings.json; HomePage, nav and scrollspy all follow automatically.
 */
export const sectionRegistry: Record<string, SectionRegistryEntry> = {
  hero: { Component: lazy(() => import('@/sections/HeroSection')), isEmpty: () => false },
  metrics: {
    Component: lazy(() => import('@/sections/MetricsSection')),
    isEmpty: () => metrics.items.length === 0,
  },
  logos: {
    Component: lazy(() => import('@/sections/LogosSection')),
    isEmpty: () => companyLogos.length === 0,
  },
  about: { Component: lazy(() => import('@/sections/AboutSection')), isEmpty: () => false },
  services: {
    Component: lazy(() => import('@/sections/ServicesSection')),
    isEmpty: () => services.length === 0,
  },
  skills: {
    Component: lazy(() => import('@/sections/SkillsSection')),
    isEmpty: () => skills.categories.length === 0,
  },
  experience: {
    Component: lazy(() => import('@/sections/ExperienceSection')),
    isEmpty: () => experience.length === 0,
  },
  projects: {
    Component: lazy(() => import('@/sections/ProjectsSection')),
    isEmpty: () => projects.length === 0,
  },
  testimonials: {
    Component: lazy(() => import('@/sections/TestimonialsSection')),
    isEmpty: () => testimonials.length === 0,
  },
  story: {
    Component: lazy(() => import('@/sections/StorySection')),
    isEmpty: () => personalStory.paragraphs.length === 0 && values.items.length === 0,
  },
  certifications: {
    Component: lazy(() => import('@/sections/CertificationsSection')),
    isEmpty: () => certifications.length === 0,
  },
  faq: {
    Component: lazy(() => import('@/sections/FaqSection')),
    isEmpty: () => faq.items.length === 0,
  },
  writing: {
    Component: lazy(() => import('@/sections/WritingSection')),
    isEmpty: () => writing.posts.length === 0,
  },
  contact: { Component: lazy(() => import('@/sections/ContactSection')), isEmpty: () => false },
  cta: { Component: lazy(() => import('@/sections/CtaSection')), isEmpty: () => false },
};

export interface Experience {
  role: string;
  employment_type: string; // snake_case to match the JSON exactly ("Full-time" | "Contract" | ...)
  company: string;
  location: string;
  period: string; // free-form, e.g. "October 2025 - Present"
  description: string;
  highlights: string[];
}

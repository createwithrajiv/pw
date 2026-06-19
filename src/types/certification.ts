export interface Certification {
  title: string;
  issuer: string;
  issuedDate: string; // "2025-03" or "March 2025"
  credentialId?: string;
  credentialUrl?: string;
  icon?: string;
}

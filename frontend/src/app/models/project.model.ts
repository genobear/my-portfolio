export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: 'web' | 'api' | 'fullstack' | 'mobile' | 'other';
  repoUrl: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  year: number;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ProfileInfo {
  name: string;
  role: string;
  bio: string;
  email: string;
  location?: string;
  availableForWork: boolean;
  socialLinks: SocialLink[];
}

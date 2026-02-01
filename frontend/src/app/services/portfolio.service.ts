import { Injectable, signal, computed } from '@angular/core';
import { Project, ProfileInfo } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly _profile = signal<ProfileInfo>({
    name: 'Scott Moore',
    role: 'Full-stack Developer',
    bio: `I craft elegant, scalable web applications with a focus on clean architecture and exceptional user experiences. With expertise spanning frontend frameworks, backend systems, and cloud infrastructure, I bring ideas to life through thoughtful engineering.`,
    email: 'scott@geno.gg',
    location: 'United Kingdom',
    availableForWork: true,
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/genobear', icon: 'github' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com/yourusername', icon: 'twitter' }
    ]
  });

  private readonly _projects = signal<Project[]>([
    {
      id: '1',
      title: 'Andrew Memoirs',
      description: 'A personal memoir website for Andrew, showcasing his life stories and experiences in a beautifully designed format.',
      technologies: ['HTML', 'GitHub Pages', 'CSS'],
      category: 'web',
      repoUrl: 'https://github.com/genobear/Andrew-memoirs',
      liveUrl: 'https://genobear.github.io/Andrew-memoirs/',
      featured: true,
      year: 2026
    },
    {
      id: '2',
      title: 'Portfolio Website',
      description: 'A sleek and modern portfolio website to showcase my projects, skills, and experience as a full-stack developer.',
      technologies: ['Angular', 'TypeScript', 'CSS'],
      category: 'web',
      repoUrl: 'https://github.com/genobear/my-portfolio',
      liveUrl: 'https://myportfolio.com',
      featured: false,
      year: 2026
    }
    {
      id: '3',
      title: 'Arrive Enforce UK',
      description: 'Robust itegration platform for Arrive UK Parking division. Integrating their systems with multiple third-party services to streamline operations and enhance user experience.',
      technologies: ['Django', 'Python', 'Celery', 'PostgreSQL', 'Docker', 'AWS', 'CSS'],
      category: 'fullstack',
      repoUrl: '',
      liveUrl: 'https://enforce.fbsc.uk/',
      featured: true,
      year: 2025
    }
    {
      id: '4',
      title: 'Geno\'s Block Party',
      description: 'A breakout-style game built with Phaser framework, with a music focused theme & engaging power-ups.',
      technologies: ['TypeScript', 'Phaser', 'HTML5', 'CSS'],
      category: 'web',
      repoUrl: 'https://github.com/genobear/Genos-Block-Party',
      liveUrl: 'https://genobear.github.io/Genos-Block-Party/',
      featured: true,
      year: 2026
    }
  ]);

  private readonly _activeFilter = signal<string | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly projects = this._projects.asReadonly();
  readonly activeFilter = this._activeFilter.asReadonly();

  readonly filteredProjects = computed(() => {
    const filter = this._activeFilter();
    const allProjects = this._projects();

    if (!filter) {
      return allProjects;
    }

    return allProjects.filter(p =>
      p.category === filter ||
      p.technologies.some(t => t.toLowerCase() === filter.toLowerCase())
    );
  });

  readonly categories = computed(() => {
    const projects = this._projects();
    const cats = new Set(projects.map(p => p.category));
    return Array.from(cats);
  });

  readonly allTechnologies = computed(() => {
    const projects = this._projects();
    const techs = new Set(projects.flatMap(p => p.technologies));
    return Array.from(techs).sort();
  });

  readonly featuredProjects = computed(() =>
    this._projects().filter(p => p.featured)
  );

  setFilter(filter: string | null): void {
    this._activeFilter.set(filter);
  }
}

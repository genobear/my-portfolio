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
      title: 'API Forge',
      description: 'A robust REST API starter kit with authentication, rate limiting, and comprehensive documentation built-in.',
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'OpenAPI'],
      category: 'api',
      repoUrl: 'https://github.com/yourusername/api-forge',
      imageUrl: '/assets/screenshots/image.png',
      featured: true,
      year: 2024
    },
    {
      id: '3',
      title: 'Minimal Portfolio',
      description: 'An elegant, performance-focused portfolio template with dark mode and smooth animations.',
      technologies: ['Angular', 'SCSS', 'TypeScript'],
      category: 'web',
      repoUrl: 'https://github.com/yourusername/minimal-portfolio',
      liveUrl: 'https://portfolio.example.com',
      featured: false,
      year: 2024
    },
    {
      id: '4',
      title: 'TaskFlow',
      description: 'A collaborative task management application with real-time updates, Kanban boards, and team analytics.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Chart.js'],
      category: 'fullstack',
      repoUrl: 'https://github.com/yourusername/taskflow',
      liveUrl: 'https://taskflow.example.com',
      featured: true,
      year: 2023
    },
    {
      id: '5',
      title: 'DevCLI',
      description: 'A powerful command-line tool for automating development workflows, scaffolding, and code generation.',
      technologies: ['Rust', 'CLI', 'TOML'],
      category: 'other',
      repoUrl: 'https://github.com/yourusername/devcli',
      featured: false,
      year: 2023
    },
    {
      id: '6',
      title: 'WeatherNow',
      description: 'A beautiful weather application with location-based forecasts, radar maps, and severe weather alerts.',
      technologies: ['Flutter', 'Dart', 'OpenWeather API'],
      category: 'mobile',
      repoUrl: 'https://github.com/yourusername/weathernow',
      featured: false,
      year: 2023
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

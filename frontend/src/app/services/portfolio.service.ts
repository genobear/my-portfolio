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
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/scott-moore-a9a443200/', icon: 'linkedin' }
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
      featured: false,
      year: 2026
    },
    {
      id: '2',
      title: 'This Portfolio Website',
      description: 'I wanted to try our Angular framework, so built this very portfolio website you are viewing right now. Built with Angular and showcasing my projects and skills as a full-stack developer.',
      technologies: ['Angular', 'TypeScript', 'CSS'],
      category: 'web',
      repoUrl: 'https://github.com/genobear/my-portfolio',
      liveUrl: 'https://geno.gg/',
      featured: false,
      year: 2026
    },
    {
      id: '3',
      title: 'Arrive Enforce UK',
      description: 'Robust itegration platform for Arrive UK Parking division. Integrating their systems with multiple third-party services to streamline operations and enhance user experience.',
      technologies: ['Django', 'REST API', 'Celery', 'PostgreSQL', 'Docker', 'AWS', 'CSS'],
      category: 'fullstack',
      liveUrl: 'https://enforce.fbsc.uk/',
      imageUrl: 'assets/screenshots/arrive.png',
      featured: true,
      year: 2025,

    },
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
    },
    {
      id: '5',
      title: 'Dune: Awakening Crafting Calculator',
      description: 'Backend-first base planning tool for Dune: Awakening. Calculates power requirements, water production, and storage capacities. Features full crafting chain breakdowns with configurable station efficiency levels. Built with Django and HTMX for server-driven interactivity.',
      technologies: ['Javascript', 'CSS', 'Python', 'Django', 'HTMX'],
      category: 'fullstack',
      liveUrl: 'https://dune.geno.gg/',
      featured: true,
      year: 2025
    },
    {
      id: '6',
      title: 'Method.gg Dune: Awakening Database',
      description: 'Built and maintain a datamining pipeline that keeps Method.gg\'s Dune: Awakening database synchronized with the latest game updates. Browse items, schematics, and game data with search and filtering.',
      technologies: ['Python', 'FModel'],
      category: 'other',
      liveUrl: 'https://www.method.gg/dune-awakening/database',
      featured: false,
      year: 2025
    },
    {
      id: '7',
      title: 'Method.gg Dune: Awakening Specialisation Calculator',
      description: 'Plan your character build with an interactive specialisation tree viewer. Calculate XP and spice costs for your goals, compare current vs target level stats, and view a summary of all affected attributes.',
      technologies: ['Javascript', 'CSS'],
      category: 'web',
      liveUrl: 'https://www.method.gg/dune-awakening/specialization-calculator',
      featured: false,
      year: 2025
    },
    {
      id: '8',
      title: 'Method.gg Dune: Awakening Testing Station Browser',
      description: 'Explore difficulty-scaled dungeons with an interactive level slider. View how enemy stats, player modifiers, item drop rates, and XP rewards change based on dungeon difficulty.',
      technologies: ['Javascript', 'CSS'],
      category: 'web',
      liveUrl: 'https://www.method.gg/dune-awakening/testing-stations',
      featured: false,
      year: 2025
    },
    {
      id: '9',
      title: 'Method.gg Dune: Awakening Augmentation Calculator',
      description: 'Theorycraft weapon builds by selecting augments and previewing their combined effect on weapon stats. Compare different augment combinations to optimize your loadout.',
      technologies: ['Javascript', 'CSS'],
      category: 'web',
      liveUrl: 'https://www.method.gg/dune-awakening/augmentations-database',
      featured: false,
      year: 2025
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

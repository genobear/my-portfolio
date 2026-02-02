import { Component, inject, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { Project } from '../../models/project.model';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCardComponent, ProjectModalComponent]
})
export class ProjectsComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly selectedProject = signal<Project | null>(null);

  readonly projects = this.portfolioService.filteredProjects;
  readonly categories = this.portfolioService.categories;
  readonly activeFilter = this.portfolioService.activeFilter;
  readonly totalProjects = computed(() => this.portfolioService.projects().length);

  readonly filterOptions = computed(() => {
    const cats = this.categories();
    return [
      { value: null, label: 'All' },
      ...cats.map(c => ({
        value: c,
        label: this.formatCategory(c)
      }))
    ];
  });

  setFilter(filter: string | null): void {
    this.portfolioService.setFilter(filter);
  }

  openProject(project: Project): void {
    this.selectedProject.set(project);
  }

  closeProject(): void {
    this.selectedProject.set(null);
  }

  private formatCategory(category: string): string {
    const labels: Record<string, string> = {
      'web': 'Web',
      'api': 'API',
      'fullstack': 'Full-stack',
      'mobile': 'Mobile',
      'other': 'Other'
    };
    return labels[category] || category;
  }
}

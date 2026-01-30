import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCardComponent]
})
export class ProjectsComponent {
  private readonly portfolioService = inject(PortfolioService);

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

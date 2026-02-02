import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  project = input.required<Project>();
  index = input(0);
  openModal = output<Project>();

  onCardClick(): void {
    this.openModal.emit(this.project());
  }

  onLinkClick(event: Event): void {
    event.stopPropagation();
  }

  /**
   * Returns the image URL for the project.
   * Priority: explicit imageUrl > auto-generated screenshot from liveUrl > null (fallback to letter)
   */
  resolvedImageUrl = computed(() => {
    const p = this.project();

    // Use explicit image if provided
    if (p.imageUrl) {
      return p.imageUrl;
    }

    // Auto-generate screenshot from live demo URL using WordPress mshots
    // This is a free, public service used by WordPress.com for link previews
    if (p.liveUrl) {
      const encodedUrl = encodeURIComponent(p.liveUrl);
      return `https://s.wordpress.com/mshots/v1/${encodedUrl}?w=800&h=500`;
    }

    return null;
  });
}

import {
  Component,
  input,
  output,
  computed,
  effect,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT, TitleCasePipe } from '@angular/common';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe],
  host: {
    '(document:keydown.escape)': 'onEscape()',
    '(click)': 'onBackdropClick($event)'
  }
})
export class ProjectModalComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  project = input<Project | null>(null);
  closed = output<void>();

  isOpen = computed(() => this.project() !== null);

  resolvedImageUrl = computed(() => {
    const p = this.project();
    if (!p) return null;

    if (p.imageUrl) {
      return p.imageUrl;
    }

    if (p.liveUrl) {
      const encodedUrl = encodeURIComponent(p.liveUrl);
      return `https://s.wordpress.com/mshots/v1/${encodedUrl}?w=1200&h=800`;
    }

    return null;
  });

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      if (this.isOpen()) {
        this.document.body.style.overflow = 'hidden';
      } else {
        this.document.body.style.overflow = '';
      }
    });
  }

  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}

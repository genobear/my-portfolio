import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GitHubService, GitHubContributions } from '../../services/github.service';

@Component({
  selector: 'app-geno-claw',
  templateUrl: './geno-claw.component.html',
  styleUrl: './geno-claw.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenoClawComponent implements OnInit {
  private readonly githubService = inject(GitHubService);

  readonly contributions = signal<GitHubContributions | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly levelColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  readonly dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit(): void {
    this.githubService.getContributions().subscribe({
      next: (data) => {
        this.contributions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}

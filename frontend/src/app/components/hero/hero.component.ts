import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly profile = this.portfolioService.profile;
}

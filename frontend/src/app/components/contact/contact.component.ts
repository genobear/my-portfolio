import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly profile = this.portfolioService.profile;
  readonly currentYear = new Date().getFullYear();
}

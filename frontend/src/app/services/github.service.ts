import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface GitHubContributions {
  totalContributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
  repositoriesContributedTo: number;
  weeks: ContributionWeek[];
  accountAge: string;
}

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly http = inject(HttpClient);

  getContributions(): Observable<GitHubContributions> {
    return this.http.get<GitHubContributions>('/api/github/contributions');
  }
}

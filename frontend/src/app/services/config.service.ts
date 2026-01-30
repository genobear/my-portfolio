import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<AppConfig> {
    if (!this.config) {
      this.config = await firstValueFrom(
        this.http.get<AppConfig>('/assets/config.json')
      );
    }
    return this.config;
  }

  get apiUrl(): string {
    return this.config?.apiUrl ?? '';
  }
}

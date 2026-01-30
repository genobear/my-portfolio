import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, shareReplay } from 'rxjs';

interface MicrolinkResponse {
  status: string;
  data: {
    image?: {
      url: string;
    };
    logo?: {
      url: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class MetaImageService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<string | null>>();

  /**
   * Fetches the og:image or logo from a URL's meta tags using Microlink API.
   * Results are cached to avoid repeated API calls.
   */
  getMetaImage(url: string): Observable<string | null> {
    if (!url) {
      return of(null);
    }

    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Microlink API - free tier extracts og:image, twitter:image, etc.
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;

    const request$ = this.http.get<MicrolinkResponse>(apiUrl).pipe(
      map(response => {
        // Prefer og:image, fall back to logo
        return response.data?.image?.url || response.data?.logo?.url || null;
      }),
      catchError(() => of(null)),
      shareReplay(1) // Cache the result
    );

    this.cache.set(url, request$);
    return request$;
  }
}

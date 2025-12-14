import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig = {
    apiUrl: 'http://192.168.49.2:30080/student'
  };

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>('/assets/config.json').pipe(
      map(config => {
        this.config = config;
        console.log('Config loaded - API URL:', this.config.apiUrl);
        return this.config;
      }),
      catchError(() => {
        // Fallback to environment config
        console.log('Config load failed - using environment API URL:', this.config.apiUrl);
        return of(this.config);
      })
    );
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }
}


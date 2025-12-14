import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../../models/enrollment.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private get apiUrl() {
    return `${this.configService.getApiUrl()}/Enrollment`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/getAllEnrollment`);
  }

  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.apiUrl}/getEnrollment/${id}`);
  }

  createEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/createEnrollment`, enrollment);
  }

  updateEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/updateEnrollment`, enrollment);
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEnrollment/${id}`);
  }
}


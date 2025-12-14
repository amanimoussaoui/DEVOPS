import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../models/student.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private get apiUrl() {
    return `${this.configService.getApiUrl()}/students`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/getAllStudents`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/getStudent/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/createStudent`, student);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/updateStudent`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteStudent/${id}`);
  }
}


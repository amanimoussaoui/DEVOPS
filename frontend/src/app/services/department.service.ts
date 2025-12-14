import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../../models/department.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private get apiUrl() {
    return `${this.configService.getApiUrl()}/Depatment`;
  }

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/getAllDepartment`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/getDepartment/${id}`);
  }

  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/createDepartment`, department);
  }

  updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/updateDepartment`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDepartment/${id}`);
  }
}


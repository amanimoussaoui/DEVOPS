import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { EnrollmentListComponent } from './components/enrollment-list/enrollment-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'students', component: StudentListComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'enrollments', component: EnrollmentListComponent }
];


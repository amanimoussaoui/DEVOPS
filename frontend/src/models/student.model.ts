import { Department } from './department.model';
import { Enrollment } from './enrollment.model';

export interface Student {
  idStudent?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  department?: Department;
  enrollments?: Enrollment[];
}


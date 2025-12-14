import { Student } from './student.model';

export interface Department {
  idDepartment?: number;
  name: string;
  location: string;
  phone: string;
  head: string;
  students?: Student[];
}


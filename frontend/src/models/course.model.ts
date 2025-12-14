import { Enrollment } from './enrollment.model';

export interface Course {
  idCourse?: number;
  name: string;
  code: string;
  credit: number;
  description: string;
  enrollments?: Enrollment[];
}


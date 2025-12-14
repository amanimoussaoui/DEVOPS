import { Student } from './student.model';
import { Course } from './course.model';
import { Status } from './status.enum';

export interface Enrollment {
  idEnrollment?: number;
  enrollmentDate: string;
  grade?: number;
  status: Status;
  student?: Student;
  course?: Course;
}


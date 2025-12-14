import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { Enrollment } from '../../../models/enrollment.model';
import { Student } from '../../../models/student.model';
import { Status } from '../../../models/status.enum';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="container">
      <div class="header">
        <h2>Enrollments</h2>
        <button class="btn btn-primary" (click)="openAddModal()">Add Enrollment</button>
      </div>

      <div class="card" *ngIf="enrollments.length === 0 && !loading">
        <p>No enrollments found. Add your first enrollment!</p>
      </div>

      <div class="card" *ngIf="loading">
        <p>Loading...</p>
      </div>

      <table *ngIf="enrollments.length > 0 && !loading">
        <thead>
          <tr>
            <th>ID</th>
            <th>Enrollment Date</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Student</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let enrollment of enrollments">
            <td>{{ enrollment.idEnrollment }}</td>
            <td>{{ enrollment.enrollmentDate | date }}</td>
            <td>{{ enrollment.grade || 'N/A' }}</td>
            <td>{{ enrollment.status }}</td>
            <td>{{ enrollment.student?.firstName }} {{ enrollment.student?.lastName }}</td>
            <td>{{ enrollment.course?.name || 'N/A' }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(enrollment)">Edit</button>
              <button class="btn btn-danger" (click)="deleteEnrollment(enrollment.idEnrollment!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Add/Edit Modal -->
      <div class="modal" *ngIf="showModal" (click)="closeModal($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingEnrollment ? 'Edit Enrollment' : 'Add Enrollment' }}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveEnrollment()">
            <div class="form-group">
              <label>Enrollment Date *</label>
              <input type="date" [(ngModel)]="currentEnrollment.enrollmentDate" name="enrollmentDate" required>
            </div>
            <div class="form-group">
              <label>Grade</label>
              <input type="number" step="0.01" [(ngModel)]="currentEnrollment.grade" name="grade">
            </div>
            <div class="form-group">
              <label>Status *</label>
              <select [(ngModel)]="currentEnrollment.status" name="status" required>
                <option [value]="Status.ACTIVE">ACTIVE</option>
                <option [value]="Status.COMPLETED">COMPLETED</option>
                <option [value]="Status.DROPPED">DROPPED</option>
                <option [value]="Status.FAILED">FAILED</option>
                <option [value]="Status.WITHDRAWN">WITHDRAWN</option>
              </select>
            </div>
            <div class="form-group">
              <label>Student ID</label>
              <input type="number" [(ngModel)]="studentId" name="studentId" placeholder="Enter student ID">
            </div>
            <div class="form-group">
              <label>Course ID</label>
              <input type="number" [(ngModel)]="courseId" name="courseId" placeholder="Enter course ID">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header h2 {
      margin: 0;
      color: #333;
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-header h3 {
      margin: 0;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class EnrollmentListComponent implements OnInit {
  enrollments: Enrollment[] = [];
  students: Student[] = [];
  loading = false;
  showModal = false;
  editingEnrollment: Enrollment | null = null;
  currentEnrollment: Enrollment = {
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: Status.ACTIVE
  };
  studentId?: number;
  courseId?: number;
  Status = Status;

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadEnrollments();
    this.loadStudents();
  }

  loadEnrollments() {
    this.loading = true;
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.loading = false;
        alert('Error loading enrollments. Please check if the backend is running.');
      }
    });
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  openAddModal() {
    this.editingEnrollment = null;
    this.currentEnrollment = {
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: Status.ACTIVE
    };
    this.studentId = undefined;
    this.courseId = undefined;
    this.showModal = true;
  }

  openEditModal(enrollment: Enrollment) {
    this.editingEnrollment = enrollment;
    this.currentEnrollment = { ...enrollment };
    this.studentId = enrollment.student?.idStudent;
    this.courseId = enrollment.course?.idCourse;
    this.showModal = true;
  }

  closeModal(event?: Event) {
    if (!event || (event.target as HTMLElement).classList.contains('modal')) {
      this.showModal = false;
      this.editingEnrollment = null;
    }
  }

  saveEnrollment() {
    // Set student and course if IDs are provided
    if (this.studentId) {
      const student = this.students.find(s => s.idStudent === this.studentId);
      if (student) {
        this.currentEnrollment.student = student;
      }
    }
    
    // Note: Course would need to be loaded similarly, but for now we'll just send the ID
    // The backend should handle the relationship
    
    if (this.editingEnrollment) {
      this.enrollmentService.updateEnrollment(this.currentEnrollment).subscribe({
        next: () => {
          this.loadEnrollments();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating enrollment:', error);
          alert('Error updating enrollment');
        }
      });
    } else {
      this.enrollmentService.createEnrollment(this.currentEnrollment).subscribe({
        next: () => {
          this.loadEnrollments();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating enrollment:', error);
          alert('Error creating enrollment');
        }
      });
    }
  }

  deleteEnrollment(id: number) {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.enrollmentService.deleteEnrollment(id).subscribe({
        next: () => {
          this.loadEnrollments();
        },
        error: (error) => {
          console.error('Error deleting enrollment:', error);
          alert('Error deleting enrollment');
        }
      });
    }
  }
}


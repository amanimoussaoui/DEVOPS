import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { DepartmentService } from '../../services/department.service';
import { Student } from '../../../models/student.model';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="container">
      <div class="header">
        <h2>Students</h2>
        <button class="btn btn-primary" (click)="openAddModal()">Add Student</button>
      </div>

      <div class="card" *ngIf="students.length === 0 && !loading">
        <p>No students found. Add your first student!</p>
      </div>

      <div class="card" *ngIf="loading">
        <p>Loading...</p>
      </div>

      <table *ngIf="students.length > 0 && !loading">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let student of students">
            <td>{{ student.idStudent }}</td>
            <td>{{ student.firstName }}</td>
            <td>{{ student.lastName }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.phone }}</td>
            <td>{{ student.dateOfBirth | date }}</td>
            <td>{{ student.address }}</td>
            <td>{{ student.department?.name || 'N/A' }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(student)">Edit</button>
              <button class="btn btn-danger" (click)="deleteStudent(student.idStudent!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Add/Edit Modal -->
      <div class="modal" *ngIf="showModal" (click)="closeModal($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingStudent ? 'Edit Student' : 'Add Student' }}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveStudent()">
            <div class="form-group">
              <label>First Name *</label>
              <input type="text" [(ngModel)]="currentStudent.firstName" name="firstName" required>
            </div>
            <div class="form-group">
              <label>Last Name *</label>
              <input type="text" [(ngModel)]="currentStudent.lastName" name="lastName" required>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="currentStudent.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Phone *</label>
              <input type="text" [(ngModel)]="currentStudent.phone" name="phone" required>
            </div>
            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" [(ngModel)]="currentStudent.dateOfBirth" name="dateOfBirth" required>
            </div>
            <div class="form-group">
              <label>Address</label>
              <input type="text" [(ngModel)]="currentStudent.address" name="address">
            </div>
            <div class="form-group">
              <label>Department</label>
              <select [(ngModel)]="currentStudent.department" name="department">
                <option [ngValue]="null">None</option>
                <option *ngFor="let dept of departments" [ngValue]="dept">{{ dept.name }}</option>
              </select>
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
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  departments: Department[] = [];
  loading = false;
  showModal = false;
  editingStudent: Student | null = null;
  currentStudent: Student = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  };

  constructor(
    private studentService: StudentService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.loadDepartments();
  }

  loadStudents() {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
        alert('Error loading students. Please check if the backend is running.');
      }
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  openAddModal() {
    this.editingStudent = null;
    this.currentStudent = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: ''
    };
    this.showModal = true;
  }

  openEditModal(student: Student) {
    this.editingStudent = student;
    this.currentStudent = { ...student };
    this.showModal = true;
  }

  closeModal(event?: Event) {
    if (!event || (event.target as HTMLElement).classList.contains('modal')) {
      this.showModal = false;
      this.editingStudent = null;
    }
  }

  saveStudent() {
    if (this.editingStudent) {
      this.studentService.updateStudent(this.currentStudent).subscribe({
        next: () => {
          this.loadStudents();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating student:', error);
          alert('Error updating student');
        }
      });
    } else {
      this.studentService.createStudent(this.currentStudent).subscribe({
        next: () => {
          this.loadStudents();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating student:', error);
          alert('Error creating student');
        }
      });
    }
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Error deleting student');
        }
      });
    }
  }
}


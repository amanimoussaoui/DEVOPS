import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Departments</h2>
        <button class="btn btn-primary" (click)="openAddModal()">Add Department</button>
      </div>

      <div class="card" *ngIf="departments.length === 0 && !loading">
        <p>No departments found. Add your first department!</p>
      </div>

      <div class="card" *ngIf="loading">
        <p>Loading...</p>
      </div>

      <table *ngIf="departments.length > 0 && !loading">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Phone</th>
            <th>Head</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let department of departments">
            <td>{{ department.idDepartment }}</td>
            <td>{{ department.name }}</td>
            <td>{{ department.location }}</td>
            <td>{{ department.phone }}</td>
            <td>{{ department.head }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(department)">Edit</button>
              <button class="btn btn-danger" (click)="deleteDepartment(department.idDepartment!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Add/Edit Modal -->
      <div class="modal" *ngIf="showModal" (click)="closeModal($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingDepartment ? 'Edit Department' : 'Add Department' }}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <form (ngSubmit)="saveDepartment()">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="currentDepartment.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Location *</label>
              <input type="text" [(ngModel)]="currentDepartment.location" name="location" required>
            </div>
            <div class="form-group">
              <label>Phone *</label>
              <input type="text" [(ngModel)]="currentDepartment.phone" name="phone" required>
            </div>
            <div class="form-group">
              <label>Head *</label>
              <input type="text" [(ngModel)]="currentDepartment.head" name="head" required>
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
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  loading = false;
  showModal = false;
  editingDepartment: Department | null = null;
  currentDepartment: Department = {
    name: '',
    location: '',
    phone: '',
    head: ''
  };

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.loading = false;
        alert('Error loading departments. Please check if the backend is running.');
      }
    });
  }

  openAddModal() {
    this.editingDepartment = null;
    this.currentDepartment = {
      name: '',
      location: '',
      phone: '',
      head: ''
    };
    this.showModal = true;
  }

  openEditModal(department: Department) {
    this.editingDepartment = department;
    this.currentDepartment = { ...department };
    this.showModal = true;
  }

  closeModal(event?: Event) {
    if (!event || (event.target as HTMLElement).classList.contains('modal')) {
      this.showModal = false;
      this.editingDepartment = null;
    }
  }

  saveDepartment() {
    if (this.editingDepartment) {
      this.departmentService.updateDepartment(this.currentDepartment).subscribe({
        next: () => {
          this.loadDepartments();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating department:', error);
          alert('Error updating department');
        }
      });
    } else {
      this.departmentService.createDepartment(this.currentDepartment).subscribe({
        next: () => {
          this.loadDepartments();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating department:', error);
          alert('Error creating department');
        }
      });
    }
  }

  deleteDepartment(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (error) => {
          console.error('Error deleting department:', error);
          alert('Error deleting department');
        }
      });
    }
  }
}


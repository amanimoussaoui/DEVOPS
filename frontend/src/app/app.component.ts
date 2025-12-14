import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-content">
          <h1 class="nav-title">Student Management System</h1>
          <div class="nav-links">
            <a routerLink="/students" routerLinkActive="active" class="nav-link">Students</a>
            <a routerLink="/departments" routerLinkActive="active" class="nav-link">Departments</a>
            <a routerLink="/enrollments" routerLinkActive="active" class="nav-link">Enrollments</a>
          </div>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .navbar {
      background-color: #3f51b5;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-title {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
    }
    .nav-links {
      display: flex;
      gap: 20px;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
    .main-content {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Student Management System';

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.loadConfig().subscribe();
  }
}


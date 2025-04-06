import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  isSidebarCollapsed = false;
  currentUser = 'Admin User';
  currentUserRole = 'ADMIN';
  
  navItems = [
    { label: 'Dashboard', icon: 'tachometer-alt', link: '/dashboard', active: true },
    { label: 'All Tasks', icon: 'tasks', link: '/all-tasks', active: true },
    { label: 'My Tasks', icon: 'tasks', link: '/my-tasks', active: false },
    { label: 'Notifications', icon: 'bell', link: '/notifications', active: false },
    { label: 'Profile', icon: 'user', link: '/profile', active: false },
    // { label: 'Reports', icon: 'chart-bar', link: '/reports', active: false }
  ];

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}

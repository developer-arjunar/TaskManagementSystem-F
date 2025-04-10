import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  public currentUserData: any = {};


  isSidebarCollapsed = false;
  public currentUser: any = "";
  currentUserRole = 'ADMIN';
  
  navItems = [
    { label: 'Dashboard', icon: 'tachometer-alt', link: '/dashboard', active: true },
    { label: 'All Tasks', icon: 'tasks', link: '/all-tasks', active: true },
    { label: 'My Tasks', icon: 'tasks', link: '/my-tasks', active: false },
    { label: 'Notifications', icon: 'bell', link: '/notifications', active: false },
    { label: 'Profile', icon: 'user', link: '/profile', active: false },
    // { label: 'Reports', icon: 'chart-bar', link: '/reports', active: false }
  ];

  constructor(
    private authService: AuthService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    // const loggedInUserData = localStorage.getItem('loggedInUser');

    this.currentUserData = this.storage.getItem<{}>('loggedInUser');

    this.currentUser = this.currentUserData.name;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.storage.clear();
    this.authService.logout();
  }
}

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
  
  navItems = [
    { label: 'Dashboard', icon: 'tachometer-alt', link: '/dashboard', active: false },
    { label: 'Users', icon: 'users', link: '/users', active: false },
    { label: 'Products', icon: 'box', link: '/products', active: false },
    { label: 'Orders', icon: 'shopping-cart', link: '/orders', active: false },
    { label: 'Settings', icon: 'cog', link: '/settings', active: false },
    { label: 'Reports', icon: 'chart-bar', link: '/reports', active: false }
  ];

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-list/task-form/task-form.component';
import { AuthGuard } from './core/auth.guard';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-list/user-form/user-form.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'all-tasks',
        component: TaskListComponent,
      },
      {
        path: 'my-tasks',
        component: TaskListComponent,
      },
      {
        path: 'tasks/create-task',
        component: TaskFormComponent
      },
      {
        path: 'tasks/update-task/:id',
        component: TaskFormComponent
      },
      {
        path: 'profile',
        component: ProfileDetailsComponent
      },
      {
        path: 'profile/update-profile/:id',
        component: ProfileDetailsComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'users/create-user',
        component: UserFormComponent
      },
      {
        path: 'users/update-user/:id',
        component: UserFormComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
}) export class AppRoutingModule { }
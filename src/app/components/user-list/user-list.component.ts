import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  public currentUserData: any = {};
  public usersList: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserData = this.storage.getItem<{}>('loggedInUser');

    this.loadUsersTable();
  }

  loadUsersTable(): void {
    this.userService.getAllUsers().subscribe(
      (res: any[]) => {
        this.usersList = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteUserById(id: any): void {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.deleteUser(id).subscribe(
            (res: any[]) => {
              
            },
            (error: any) => {
              console.log(error);
            }
          );
  
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success"
          });
  
          this.loadUsersTable();
        }
      });
    }

  navigateToUserForm() {
    this.router.navigate(['/users/create-user']);
  }

  navigateToEditForm(id: any) {
    this.router.navigate(['/users/update-user', id]);
  }

}

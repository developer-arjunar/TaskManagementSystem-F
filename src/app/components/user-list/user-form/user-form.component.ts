import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm! : FormGroup;

  public currentUserData: any = {};
  public isUpdate: boolean = false;
  public rolesList: Array<any> = [];
  public userId: any;

  constructor(
    private storage: StorageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserData = this.storage.getItem<{}>('loggedInUser');

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      
      if(this.userId) {
        this.isUpdate = true;
        this.getUserById(this.userId);
      }
    });

    this.initiateUserForm();
    this.loadUserRoleDropDown();
  }

  initiateUserForm() {
      this.userForm = this.fb.group({
        userName: ['', Validators.required],
        userEmail: ['', Validators.required],
        userPhoneNo: ['', Validators.required],
        userRole: ['', Validators.required],
        // userUsername: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9_]/)]],
        userUsername: ['', [Validators.required, Validators.minLength(6)]],
        userPassword: ['', [Validators.required, Validators.minLength(6)]],
        userConfirmPassword: ['', Validators.required],
        userStatus: [{value: 1, disabled: !this.isUpdate}, Validators.required]
    },
    { validators: [
      this.passwordMatchValidator('userPassword', 'userConfirmPassword'),
      this.usernameChecker('userUsername')
    ]},
  );
  }

  loadUserRoleDropDown(): void {
    this.roleService.getAllRoles().subscribe(
      (res: any[]) => {
      this.rolesList = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  usernameChecker(usernameController: string) {
    return (userForm: FormGroup) => {
      const username = userForm.get(usernameController);

      if (!username ) {
        return null;
      }

      if (username.errors && !username.errors['usernameTaken']) {
        return null;
      }

      return this.userService.checkUsernameIsExists(username.value).subscribe(
        (res: boolean) => {
          if (res == true) {
            username.setErrors({ usernameTaken: true});
          } else {
            username.setErrors(null);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  passwordMatchValidator(passwordController: string, confirmPasswordController: string) {
    return (userForm: FormGroup) => {
      const password = userForm.get(passwordController);
      const confirmPassword = userForm.get(confirmPasswordController);

      if (!password || !confirmPassword) {
        return null;
      }
  
      if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
        return null;
      }
  
      if (password.value !== confirmPassword.value) {
        return confirmPassword.setErrors({ passwordMismatch: true });
      } else {
        return confirmPassword.setErrors(null);
      }
    };
  }

  getUserById(id: any): void {
    this.userService.getUserById(id).subscribe(
      (res: any) => {
        this.userForm.setValue({
          userName: res.name,
          userEmail: res.email,
          userPhoneNo: res.phoneNo,
          userRole: res.role.id,
          userUsername: res.username,
          userPassword: 'password',
          userConfirmPassword: 'password',
          userStatus: res.status
        })

        this.userForm.get('userName')?.disable();
        this.userForm.get('userEmail')?.disable();
        this.userForm.get('userPhoneNo')?.disable();
        this.userForm.get('userUsername')?.disable();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
      if(this.userForm.valid) {
        if(this.isUpdate == false) {
          let userData = {
            name: this.userForm.value.userName,
            email: this.userForm.value.userEmail,
            phoneNo: this.userForm.value.userPhoneNo,
            username: this.userForm.value.userUsername,
            password: this.userForm.value.userPassword,
            roleId: this.userForm.value.userRole
          }
  
          console.log(userData);
          
  
          this.userService.saveNewUser(userData).subscribe(
            (res: any[]) => {
              Swal.fire({
                title: "Good job!",
                text: "User Created Successfully..!",
                icon: "success"
              });
    
              this.userForm.reset();
              this.initiateUserForm();
            },
            (error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"
              });
            }
          );
        } 
        // else {
        //   this.userForm.enable();
  
        //   let taskData = {
        //     name: this.taskForm.value.taskName,
        //     description: this.taskForm.value.taskDescription,
        //     dueDate: this.taskForm.value.taskDueDate,
        //     updatedDate: new Date(),
        //     status: this.taskForm.value.taskStatus,
        //     assigneeId: this.taskForm.value.taskAssignee,
        //     updatedBy: this.currentUserData.username
        //   }
  
        //   this.taskService.updateTask(this.taskId, taskData).subscribe(
        //     (res: any[]) => {
        //       Swal.fire({
        //         title: "Good job!",
        //         text: "You clicked the button!",
        //         icon: "success"
        //       });
    
        //       this.taskForm.reset();
        //       this.navigateToTaskForm();
        //     },
        //     (error) => {
        //       Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Something went wrong!"
        //       });
        //     }
        //   );
        // }
  
        
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    }

  navigateToUsersList() {
    this.router.navigate(['/users']);
  }
}

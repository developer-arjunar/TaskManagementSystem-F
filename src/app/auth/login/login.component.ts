import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;

  username = '';
  password = '';
  errorMessage = '';

  public loggedInUser: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.storage.clear();
    this.initiateLoginForm();
  }

  initiateLoginForm() {
      this.loginForm = this.fb.group({
        loginUsername: ['', Validators.required],
        loginPassword: ['', Validators.required]
      });
    }

    // onSubmit() {
    //   if (this.authService.login(this.loginForm.value.loginUsername, this.loginForm.value.loginPassword)) {
    //     this.router.navigate(['/dashboard']);
    //   } else {
    //     this.errorMessage = 'Invalid username or password';
    //   }
    // }


    onSubmit() {
      let userAuthenticationData = {
        username: this.loginForm.value.loginUsername,
        password: this.loginForm.value.loginPassword
      }

      this.httpClient.post('https://localhost:7137/api/Users/AuthenticateUser', userAuthenticationData, {
        observe: 'response'
      }).subscribe({
        next: (response) => {
          if(this.authService.login(response.status)) {
            this.storage.setItem('loggedInUser', response.body);

            this.router.navigate(['/dashboard']);

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Signed in successfully"
            });
          }
        },
        error: (error) => {
          // console.log(error);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: "Invalid Username or Password."
          });
        }
      });
    }

  // onSubmit() {
  //   let userAuthenticationData = {
  //     username: this.loginForm.value.loginUsername,
  //     password: this.loginForm.value.loginPassword
  //   }

  //   this.authService.authenticateUser(userAuthenticationData).subscribe(
  //             (res: any) => {

  //               console.log(res);
                
                
  //               this.storage.setItem('loggedInUser', res.body);

  //               this.router.navigate(['/dashboard']);
                
                

  //               const Toast = Swal.mixin({
  //                 toast: true,
  //                 position: "top-end",
  //                 showConfirmButton: false,
  //                 timer: 3000,
  //                 timerProgressBar: true,
  //                 didOpen: (toast) => {
  //                   toast.onmouseenter = Swal.stopTimer;
  //                   toast.onmouseleave = Swal.resumeTimer;
  //                 }
  //               });
  //               Toast.fire({
  //                 icon: "success",
  //                 title: "Signed in successfully"
  //               });
  //             },
  //             (error) => {
  //               const Toast = Swal.mixin({
  //                 toast: true,
  //                 position: "top-end",
  //                 showConfirmButton: false,
  //                 timer: 3000,
  //                 timerProgressBar: true,
  //                 didOpen: (toast) => {
  //                   toast.onmouseenter = Swal.stopTimer;
  //                   toast.onmouseleave = Swal.resumeTimer;
  //                 }
  //               });
  //               Toast.fire({
  //                 icon: "error",
  //                 title: "Invalid Username or Password."
  //               });
  //             }
  //           );
  // }
}

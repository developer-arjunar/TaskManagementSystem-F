import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;

  public loggedInUser: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.initiateLoginForm();
  }

  initiateLoginForm() {
      this.loginForm = this.fb.group({
        loginUsername: ['', Validators.required],
        loginPassword: ['', Validators.required]
      });
    }

  login() {
    let userAuthenticationData = {
      username: this.loginForm.value.loginUsername,
      password: this.loginForm.value.loginPassword
    }

    this.authService.authenticateUser(userAuthenticationData).subscribe(
              (res: any) => {
                // this.loggedInUser = res.body;
                // console.log(this.loggedInUser);
                // console.log(res.body);
                
                this.storage.setItem('loggedInUser', res.body);

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
              },
              (error) => {
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
            );
  }
}

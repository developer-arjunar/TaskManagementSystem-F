import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css',
  providers: [DatePipe]
})
export class ProfileDetailsComponent implements OnInit {
  profileDetailsForm! : FormGroup;
  accountDetailsForm! : FormGroup;
  passwordForm! : FormGroup;

  public currentUserData: any = {};
  public showPasswordChangeForm: boolean = false;
  public isProfileUsernameActive: boolean = false;
  public isProfileDetailsUpdated: boolean = false;
  public isAccountDetailsUpdated: boolean = false;
  public isDisabled: boolean = true;

  constructor(
    private storage: StorageService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserData = this.storage.getItem<{}>('loggedInUser');

    this.initiateProfileDetailsForm();
    this.initiateAccountDetailsForm();
    this.initiatePasswordForm();

    this.setDataToProfileForms();
  }

  initiateProfileDetailsForm() {
    this.profileDetailsForm = this.fb.group({
      profileName: ['', Validators.required],
      profileEmail: ['', Validators.required],
      profilePhoneNo: ['', Validators.required]
    });
  }

  initiateAccountDetailsForm() {
    this.accountDetailsForm = this.fb.group({
      profileUsername: ['', Validators.required],
      profileJoinedDate: ['']
    }, { validators: this.usernameChecker('profileUsername')});
  }

  initiatePasswordForm() {
    this.passwordForm = this.fb.group({
      profileOldPassword: ['', Validators.required],
      profileNewPassword: ['', [Validators.required, Validators.minLength(6)]],
      profileConfirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator('profileNewPassword', 'profileConfirmNewPassword')});
  }

  setDataToProfileForms(): void {
    this.profileDetailsForm.setValue({
      profileName: this.currentUserData.name,
      profileEmail: this.currentUserData.email,
      profilePhoneNo: this.currentUserData.phoneNo
    });

    this.accountDetailsForm.setValue({
      profileUsername: this.currentUserData.username,
      profileJoinedDate: this.datePipe.transform(this.currentUserData.joinedDate, "yyyy'-'MM'-'dd HH:mm:ss")
    });

    this.accountDetailsForm.get('profileUsername')?.disable();
    this.accountDetailsForm.get('profileJoinedDate')?.disable();
  }

  viewPasswordChangeForm() {
    this.showPasswordChangeForm = !this.showPasswordChangeForm;
  }

  toggleProfileUsername() {
    this.isProfileUsernameActive = !this.isProfileUsernameActive;

    if(this.isProfileUsernameActive == true) {
      this.accountDetailsForm.get('profileUsername')?.enable();
      this.isDisabled = false;
    } else {
      this.accountDetailsForm.get('profileUsername')?.disable();
      this.isDisabled = true;
    }
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

  updateProfileDetails() {
    if(this.profileDetailsForm.valid) {
        let profileDetailsUpdateData = {
          name: this.profileDetailsForm.value.profileName,
          email: this.profileDetailsForm.value.profileEmail,
          phoneNo: this.profileDetailsForm.value.profilePhoneNo
        }
      

    this.userService.updateProfileDetails(this.currentUserData.id, profileDetailsUpdateData).subscribe(
                (res: any[]) => {
                  Swal.fire({
                    title: "Good job!",
                    text: "Profile Details Updated Successfully..!",
                    icon: "success"
                  });

                  this.isProfileDetailsUpdated = true;
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
          }

          updateAccountDetails() {
            if(this.accountDetailsForm.valid) {
                let accountDetailsUpdateData = {
                  username: this.accountDetailsForm.value.profileUsername
                }
              
        
            this.userService.updateAccountDetails(this.currentUserData.id, accountDetailsUpdateData).subscribe(
                        (res: any[]) => {
                          Swal.fire({
                            title: "Good job!",
                            text: "Username Updated Successfully..!",
                            icon: "success"
                          });

                          this.isAccountDetailsUpdated = true;
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
                  }

                  updatePassword() {
                    if(this.passwordForm.valid) {
                        let passwordUpdateData = {
                          oldPassword: this.passwordForm.value.profileOldPassword,
                          newPassword: this.passwordForm.value.profileNewPassword
                        }
                      
                
                    this.userService.updatePassword(this.currentUserData.id, passwordUpdateData).subscribe(
                                (res: any[]) => {
                                  Swal.fire({
                                    title: "Good job!",
                                    text: "Password Updated Successfully..!",
                                    icon: "success"
                                  });

                                  this.showPasswordChangeForm = !this.showPasswordChangeForm;
                                  this.passwordForm.reset();
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
                          }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log("Input Change : " + value);
  }

}

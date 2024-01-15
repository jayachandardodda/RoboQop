import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  signUpForm: FormGroup;                    // {1}/ {2}
  public signUpError: string;
  public isLoginPage: boolean;
  user = new UserDetails();
  @Output() signUpEvent = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,         // {3}
    private authService: AuthService, // {4},
    private router: Router
  ) { }

  ngOnInit() {

    this.signUpForm = this.fb.group({
      user_name: ['', [Validators.required]],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (!this.signUpForm.invalid) {
      const parameters = {
        "username": this.signUpForm.get("user_name").value,
        "first_name": this.signUpForm.get("full_name").value,
        "email": this.signUpForm.get("email").value,
        "password": this.signUpForm.get("password").value
      }
      this.authService.saveUserDetails(parameters).subscribe({
        next: (result: any) => {
          this.signUpEvent.emit(true);
        },
        error: (error) => {
          console.log(error)
        }
      });
    }
  }

  get Email() {
    return this.signUpForm.get("email");
  }
}
export class UserDetails {
  username: string;
  first_name: string;
  password: string;
  email: string;
}
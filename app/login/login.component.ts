import { AutoPopulateService } from './../../../shared/services/auto-populate.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;                    // {1}
  public signInError: string;
  public isLoginPage: boolean;
  constructor(
    private fb: FormBuilder,         // {3}
    private authService: AuthService, // {4},
    private router: Router,
    private route: ActivatedRoute,
    private autoPopulate: AutoPopulateService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.isLoginPage=true;
  }

  onRegisterClick(){
    this.isLoginPage=false;
  }
  addItem(isLoginClicked: boolean) {
    this.isLoginPage= isLoginClicked;
  }

  onSubmit() {

    if (this.form.valid) {
      const parameters = {
        "username": this.form.get("email").value,
        "password": this.form.get("password").value
      }
      this.router.navigate(['/home'])
      console.log(parameters);
    //   this.authService.login(parameters).subscribe({
    //     next:(result: boolean) => {
    //       if (result) {
    //         // let returnUrl=this.route.snapshot.queryParamMap.get('returnUrl');
    //         this.router.navigate(['/home']) //[returnUrl || '/home']
    //       }
    //   },
    //   error:(error:any)=>{
    //     this.signInError="Invalid username or password";
    //   }
    // });
    }
  }


}

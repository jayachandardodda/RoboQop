import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-custom-portfolio',
  templateUrl: './custom-portfolio.component.html',
  styleUrls: ['./custom-portfolio.component.scss']
})

export class CustomPortfolioComponent implements OnInit {

  form: FormGroup;
  user: string;
 

  ngOnInit() {
    this.form = this.fb.group({
      portfolioName: ['', Validators.required],
      fullName: ['', Validators.pattern('[a-zA-Z0-9 ]*')],
      familyName: ['',  Validators.pattern('[a-zA-Z0-9 ]*')],
      emailId: ['', Validators.email],
      city: ['', Validators.pattern('[a-zA-Z ]*')],
      state: ['', Validators.pattern('[a-zA-Z ]*')],
      pincode: ['', Validators.pattern('[0-9]{0,10}')],
      address: ['']
    });
   
  }

  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router, private userdata: UserDataService) { }

  async onSubmit(): Promise<void> {
    try {
      const portfolioData = this.form.value;
      portfolioData.user = sessionStorage.getItem('user_id');
      // const result: any = await this.userdata.saveportfolio(portfolioData).toPromise();
      // console.log(result)
      // sessionStorage.setItem('portfolio_id', result.id);
      // this.toastr.success('Portfolio saved successfully!');
      // this.router.navigate(['/holdings']);
    } catch (error) {
      this.toastr.error('An error occurred while saving the portfolio. Please try again.');
      console.error('Error saving portfolio:', error);
    }
  }



  getForm(): FormGroup {
    return this.form;
  }
}


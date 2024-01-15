import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { HoldingDataService } from 'src/app/shared/services/holdingdata.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-model-portfolio',
  templateUrl: './model-portfolio.component.html',
  styleUrls: ['./model-portfolio.component.css']
})

export class ModelPortfolioComponent implements OnInit {

  invalidInvestment: boolean = false;
  form: any;
  constructor(private fb: FormBuilder, private userdata: UserDataService, private router: Router, private holdingService: HoldingDataService, private toastr: ToastrService) { }
  model_type: number;
  ngOnInit(): void {
    this.form = this.fb.group({
      portfolioName: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      familyName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
      emailId: ['', [Validators.required, Validators.email]],
      investment_amount: ['', Validators.required],
      tenure: ['12'],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{0,10}')]],
      address: ['', Validators.required],
      model_type: ['1']
    });
  }

  investment_amount() {
    if (this.form.controls["investment_amount"].value < 10000) {
      this.invalidInvestment = true
    }
    if (this.form.controls["investment_amount"].value >= 10000) {
      this.invalidInvestment = false
    }
  }

  async onSubmit(model_type: number) {
    try {
      this.model_type = model_type
      this.form.value['model_type'] = model_type;
      const portfolioData = {
        ...this.form.value,
        user: sessionStorage.getItem('user_id'),
        id: sessionStorage.getItem('model_id')
      };

      const result: any = await lastValueFrom(this.userdata.saveUser(portfolioData));
      const req1 = {
        model_name: sessionStorage.getItem('portfolioName'),
        model_id: sessionStorage.getItem('model_id'),
        portfolio_id: result.id
      };
      const stocks: any = await lastValueFrom(this.userdata.saveStocks(req1));
      sessionStorage.setItem('portfolio_id', stocks.portfolio_id);

      const req2 = {
        portfolio_id: stocks.portfolio_id,
        start_date: '2015-01-02',
        end_date: '2020-06-01',
      };

      const graphData = await lastValueFrom(this.holdingService.graphDetails(req2));
      this.holdingService.setGraphData(graphData);
      console.log(this.holdingService.getGraphData());

      this.holdingService.setChart('model');
      //this.router.navigate(['/chart']);
    } catch (error) {
      this.toastr.error('An error occurred: ' + error.error.message, 'Error', {
        closeButton: false,
        tapToDismiss: true,
        disableTimeOut: true,
        positionClass: 'toast-test-top-center'
      });
    }
  }
  getForm(): FormGroup {
    return this.form;
  }

}



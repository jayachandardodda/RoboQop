import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelPortfolioComponent } from '../model-portfolio/model-portfolio.component';
import { ModelPortfolioListComponent } from '../model-portfolio-list/model-portfolio-list.component';
import { MatStepper } from '@angular/material/stepper';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from 'src/app/shared/services/listing.service';
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, AfterViewInit {
  @ViewChild(ModelPortfolioComponent) modelPortfolioComponent?: ModelPortfolioComponent;
  @ViewChild(ModelPortfolioListComponent) modelPortfolioListComponent?: ModelPortfolioListComponent;
  @ViewChild(MatStepper) stepper?: MatStepper;
  firstFormGroup = this._formBuilder.group({
    checkboxControl1: [''],
    checkboxControl2: ['']
  });
  model_type: number;
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  isAtLeastOneChecked: boolean = false;
  apiDataLoaded: boolean = false;
  getFormFromModelPortfolio(): FormGroup {
    return this.modelPortfolioComponent.getForm();
  }
  constructor(private _formBuilder: FormBuilder, public loaderService: LoaderService, private route: ActivatedRoute, private router: Router, private listingService: ListingService) { }
  ngAfterViewInit(): void {
    if (this.listingService.isRedirected) {
      this.isAtLeastOneChecked = true;
      this.modelPortfolioListComponent?.firstFormGroup.controls['checkboxControl1'].setValue(true);
      setTimeout(() => {
        this.stepper.next();
      }, 0);
      const product = this.listingService.portfolio;
      this.modelPortfolioComponent?.form.patchValue({
        portfolioName: product.portfolioName,
        fullName: product.fullName,
        familyName: product.familyName,
        emailId: product.emailId,
        investment_amount: product.investment_amount,
        city: product.city,
        state: product.state,
        pincode: product.pincode,
        address: product.address
      });
      this.listingService.isRedirected = false;
    } else {
      this.resetStepper();
    }
  }
  ngOnInit(): void {

  }
  callOnSubmit(): void {
    this.apiDataLoaded = false;
    this.loaderService.showLoader();
    this.modelPortfolioComponent.onSubmit(this.model_type).then(() => {
      this.apiDataLoaded = true;
      if (this.apiDataLoaded && this.stepper) {
        setTimeout(() => {
          this.stepper.next();
        }, 100);
      }
      this.loaderService.hideLoader(); // Move it inside the 'then' block
    });
  }
  onNextClick() {
    if (this.modelPortfolioListComponent?.firstFormGroup.controls['checkboxControl0'].value) {
      this.model_type = 1;
    }
    else if (this.modelPortfolioListComponent?.firstFormGroup.controls['checkboxControl1'].value) {
      this.model_type = 2
    }
    else {
      this.model_type = 3;
    }

  }
  updateNextButtonState(): void {
    this.isAtLeastOneChecked = false;
    const checkboxControls = Object.keys(this.modelPortfolioListComponent?.firstFormGroup.controls)
      .filter(controlName => controlName.startsWith('checkboxControl'));
    let count = 0;
    for (const controlName of checkboxControls) {
      if (this.modelPortfolioListComponent?.firstFormGroup.controls[controlName].value) {
        this.isAtLeastOneChecked = true;
        count++;
      }
    }
    if (count == 2) {
      this.isAtLeastOneChecked = false;
    }
  }
  resetStepper(): void {
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    if (this.modelPortfolioComponent) {
      const formControls = this.modelPortfolioComponent.form.controls;
      Object.keys(formControls).forEach((controlName) => {
        formControls[controlName].reset();
      });
    }
    if (this.modelPortfolioListComponent) {
      const formGroupControls = this.modelPortfolioListComponent.firstFormGroup.controls;
      Object.keys(formGroupControls).forEach((controlName) => {
        formGroupControls[controlName].reset();
      });
    }
    this.apiDataLoaded = false;
    this.isAtLeastOneChecked = false;
  }
  selectedIndex: number = 0;

  setIndex(event) {
    this.selectedIndex = event.selectedIndex;
  }

  triggerClick(event) {
    if (this.selectedIndex == 0 || this.selectedIndex == 1) {
      this.apiDataLoaded = false;
    }

  }

}

import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomPortfolioComponent } from '../custom-portfolio/custom-portfolio.component';
import { HoldingsComponent } from '../holdings/holdings.component';
import { MatStepper } from '@angular/material/stepper';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ListingService } from 'src/app/shared/services/listing.service';

@Component({
  selector: 'app-stepper-scratch',
  templateUrl: './stepper-scratch.component.html',
  styleUrls: ['./stepper-scratch.component.scss']
})
export class StepperScratchComponent {
  @ViewChild(CustomPortfolioComponent) customPortfolioComponent?: CustomPortfolioComponent;
  @ViewChild(HoldingsComponent) holdingsComponent?: HoldingsComponent;
  @ViewChild(MatStepper) stepper?: MatStepper;
  firstFormGroup = this._formBuilder.group({
    checkboxControl1: [''],
    checkboxControl2: ['']
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  isDetailsFormComplete: boolean = false;
  apiDataLoaded: boolean = false;
  getFormFromCustomPortfolio(): FormGroup {
    return this.customPortfolioComponent.getForm();
  }
  constructor(private _formBuilder: FormBuilder, public loaderService: LoaderService, private listingService: ListingService) { }
  ngAfterViewInit(): void {
    if (this.listingService.isRedirected) {



      const product = this.listingService.portfolio;
      this.customPortfolioComponent?.form.patchValue({
        portfolioName: product.portfolioName,
        fullName: product.fullName,
        familyName: product.familyName,
        emailId: product.emailId,
        city: product.city,
        state: product.state,
        pincode: product.pincode,
        address: product.address
      });
      this.holdingsComponent?.form.patchValue({
        investment_amount: product.investment_amount,
        stockHoldings: product.stock_data
      })
      this.isDetailsFormComplete = true;
      setTimeout(() => {

        this.stepper.next();
      }, 200);
      this.listingService.isRedirected = false;
    } else {
      this.resetStepper();
    }
  }
  callOnSubmit(): void {
    // this.apiDataLoaded = false;
    // this.loaderService.showLoader();
    this.isDetailsFormComplete = true;
    this.customPortfolioComponent.onSubmit().then(() => {

      // this.apiDataLoaded = true;

      setTimeout(() => {
        this.stepper.next();
        this.isDetailsFormComplete = true;
      }, 100);

      // this.loaderService.hideLoader(); // Move it inside the 'then' block
    });
  }
  submitHoldings(form) {
    this.apiDataLoaded = false;
    this.loaderService.showLoader();
    this.holdingsComponent.submitHolding(form).then(() => {
      this.apiDataLoaded = true;
      if (this.apiDataLoaded && this.stepper) {
        setTimeout(() => {
          this.stepper.next();
        }, 100);
      }
      this.loaderService.hideLoader(); // Move it inside the 'then' block
    });

  }


  setIndex(event) {
    this.selectedIndex = event.selectedIndex;
  }

  selectedIndex: number = 0;
  triggerClick(event) {
    if (this.selectedIndex == 0 || this.selectedIndex == 1) {
      this.apiDataLoaded = false;
    }

  }
  resetStepper(): void {
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    if (this.customPortfolioComponent) {
      const formControls = this.customPortfolioComponent.form.controls;
      Object.keys(formControls).forEach((controlName) => {
        formControls[controlName].reset();
      });
    }
    if (this.holdingsComponent) {
      const formGroupControls = this.holdingsComponent.form.controls;
      Object.keys(formGroupControls).forEach((controlName) => {
        formGroupControls[controlName].reset();
      });
    }
    this.apiDataLoaded = false;
  }

}

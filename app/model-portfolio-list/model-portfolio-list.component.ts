import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HoldingDataService } from 'src/app/shared/services/holdingdata.service';
import { DescriptionComponent } from '../description/description.component';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-model-portfolio-list',
  templateUrl: './model-portfolio-list.component.html',
  styleUrls: ['./model-portfolio-list.component.scss']
})
export class ModelPortfolioListComponent {
  @Output() checkboxChange: EventEmitter<void> = new EventEmitter<void>();
  firstFormGroup: FormGroup;
  isAtLeastOneChecked: boolean = false;

  showDialog: boolean = true;
  products: any = []
  description: any = "portfolio"
  cols: any = [
    { field: 'portfolioName', header: 'Name' },
    { field: 'avg_risk', header: 'Avg. Risk' },
    { field: 'avg_returns', header: 'Avg. Return' },
    { field: 'sharpe_ratio', header: 'Sharpe Ratio' },
    { field: 'min_aum', header: 'MIN.AUM' },
    { field: 'price', header: 'price(Coins)' }
  ];
  constructor(private modalService: NgbModal, private service: HoldingDataService, private _formBuilder: FormBuilder) { }
  ngOnInit(): void {

    this.firstFormGroup = this._formBuilder.group({
      checkboxControl0: [''],
      checkboxControl1: ['']
    });
    //sessionStorage.clear();
    this.service.getModelPortfolioList().subscribe((result: any) => {
      this.description = result.description;
      this.products = result;
      console.log(this.products)
    })


  }
  onCheckboxChange(): void {
    this.checkboxChange.emit();
  }
  viewModelPortfolio(i) {
    this.showDialog = true;
    console.log(i);
    sessionStorage.setItem('portfolioName', this.products[i].portfolioName);
    sessionStorage.setItem('avg_risk', this.products[i].avg_risk);
    sessionStorage.setItem('avg_returns', this.products[i].avg_returns)
    sessionStorage.setItem('sharpe_ratio', this.products[i].sharpe_ratio)
    sessionStorage.setItem('min_aum', this.products[i].min_aum)
    sessionStorage.setItem('description', this.products[i].description)
    sessionStorage.setItem('price', this.products[i].price);
    sessionStorage.setItem('model_id', this.products[i].id)
    const modalRef = this.modalService.open(DescriptionComponent);
  }
}

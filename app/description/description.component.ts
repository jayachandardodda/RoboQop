import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit, OnDestroy {
  content = {
    'sharpe_ratio': sessionStorage.getItem('sharpe_ratio'),
    'min_aum': sessionStorage.getItem('min_aum'),
    'avg_returns': sessionStorage.getItem('avg_returns'),
    'description': sessionStorage.getItem('description'),
    'price': sessionStorage.getItem('price'),
    'portfolioName': sessionStorage.getItem('portfolioName'),
    'avg_risk': sessionStorage.getItem('avg_risk')
  }
  @Input() data: any;
  constructor(private modalService: NgbModal, private router: Router) { }
  ngOnDestroy(): void {
    sessionStorage.removeItem('sharpe_ratio');
    sessionStorage.removeItem('min_aum')
    sessionStorage.removeItem('avg_returns')
    sessionStorage.removeItem('description')
    sessionStorage.removeItem('price')
    //sessionStorage.removeItem('portfolioName')
    sessionStorage.removeItem('avg_risk')
  }

  ngOnInit(): void {
  }
  buyNow() {
    this.router.navigate(['/model-portfolio'])
    this.modalService.dismissAll()
  }
  closeForm() {
    this.modalService.dismissAll()
  }
}

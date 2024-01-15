import { AfterViewInit, Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListingService } from 'src/app/shared/services/listing.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
import { Subscription, Observable, of } from 'rxjs';
declare var google: any;
import { GoogleChartComponent } from 'angular-google-charts';
import { MatDialog } from '@angular/material/dialog'
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ConfirmComponent } from '../confirm/confirm.component';

export interface List {
  id?: string;
  username?: string;
  pname?: string;
  fname?: string;
  date?: number;
  status?: number;
  view?: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  mergeList = [];
  // products: any[] = [];
  go = this.listingService.go
  subscription: Subscription = new Subscription;
  portfolio_detials: any;
  isInputFocused = false;
  cols: any[] = [];
  filteredProducts: any[] = []; // Array to hold the filtered data
  searchKeyword: string = ''; // Search keyword entered by the user
  totalRecords: number = 0;

  getFilteredProducts(): any[] {
    if (this.searchKeyword) {
      this.filteredProducts = this.autoPopulate.products.filter((product) => {
        // Modify the conditions based on your actual data structure
        return Object.values(product).some((value) =>
          value && value.toString().toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      });
      this.totalRecords = this.filteredProducts.length; // Update total records
    } else {
      this.filteredProducts = this.autoPopulate.products;
      this.totalRecords = this.autoPopulate.products.length; // Update total records
    }
    return this.filteredProducts;
  }


  title = 'Browser market shares at a specific website, 2014';
  type = 'PieChart';
  data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7]
  ];
  columnNames = ['Browser', 'Percentage'];
  options = {
    colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
    animation: {
      duration: 1000,
      easing: 'linear',
      startup: true
    }
  };
  width = 550;
  height = 400;
  // @ViewChild('chart') pieChart: ElementRef

    ngAfterViewInit(): void {
    // google.charts.load('current', { 'packages': ['corechart'] });
    // google.charts.setOnLoadCallback(this.drawChart);
  }

  openDialog() {
    this.data = [
      ['Firefox', 51.0],
      ['IE', 20.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7]
    ];
    // this.height = 600
    this.dialog.open(PopUpComponent)
  }
  deactivate() {
    this.modalService.open(ConfirmComponent)
    this.subscription = this.listingService.go.subscribe((result: any) => {
      console.log(result);
      let portfolio_id = []
      for (var i = 0; i < this.mergeList.length; i++) {
        portfolio_id.push(this.mergeList[i].id)
      }
      let request = {
        'portfolio_id': portfolio_id
      }
      if (result === true) {
        this.listingService.deactivate(request).subscribe((result) => {
          console.log(result);
          this.ngOnInit();
          this.mergeList = [];
        });
      }
    })
  }

  ngOnInit(): void {
    this.mergeList = []
    this.cols = [
      // { field: 'fullName', header: 'Full Name' },
      // { field: 'familyName', header: 'Family Name' },
      { field: 'portfolioName', header: 'Portfolio Name' },
      { field: 'created_at', header: 'Open Date' },
      { field: 'is_active', header: 'Status' },
      // { field: 'backTesting', header: 'backTesting'},
      // { field: 'optimization', header: 'optimization'}
    ];

    this.listingService.getProductsSmall().subscribe((data) => {
      this.autoPopulate.products = data;
      this.autoPopulate.portfolioNameList = ['Default']
      for (var i = 0; i < this.autoPopulate.products.length; i++) {
        this.autoPopulate.products[i].is_active = "Active";
        this.autoPopulate.products[i].created_at = this.autoPopulate.products[i].created_at.substring(0, 10);
        // to autopopulate the portfolio name in optimization service
        this.autoPopulate.portfolioNameList.push(this.autoPopulate.products[i]['portfolioName'])
      }
      console.log(this.autoPopulate.products);
    },
      (error) => {
        console.log("Error occured" + error);
        // this.router.navigate(['/'])
      }
    );
    this.filteredProducts = this.autoPopulate.products;
    // for (var i = 0; i < this.products.length; i++) {
    //   console.log(this.products[i]['fullName'])
    //   this.autoPopulate.portfolioNameList.push(this.products[i]['fullName'])
    // }
    // this.filterTable();
    // if (this.autoPopulate.portfolioNameList.length==1){
    //   for (var i = 0; i < this.autoPopulate.products.length; i++) {
    //     this.autoPopulate.portfolioNameList.push(this.autoPopulate.products[i]['portfolioName'])
    //     }
    //   }

  }

  constructor(private listingService: ListingService, private dialog: MatDialog, private router: Router, private http: HttpClient, private modalService: NgbModal, private service: UserDataService, public autoPopulate : AutoPopulateService) { }
  ngDoCheck(): void {
    // console.log('home component do check')
    // if(this.autoPopulate.detectTitleChange==true){
    //   console.log(this.autoPopulate.products)
    //   for(let index=0; this.autoPopulate.products.length; index++){
    //     if (this.autoPopulate.products[index]['portfolioName']==this.autoPopulate.optimizationTitle){
    //       this.autoPopulate.optimizationTitle = this.autoPopulate.products[index]['portfolioName']
    //       this.autoPopulate.stockTableData = this.autoPopulate.products[index]['stock_data']
    //     }
    //   }
    //   this.autoPopulate.detectTitleChange = false

    // }
  }



  selectedList(index: number, event: any) {
    const id = this.autoPopulate.products[index].id;
    console.log(id)
    this.listingService.go.subscribe((result) => console.log(result));
    if (event.target.checked) {
      this.mergeList.push(this.autoPopulate.products[index])
      console.log(this.mergeList)
    }
    else {
      for (var i = 0; i < this.mergeList.length; i++) {
        if (this.mergeList[i].id == id) {
          this.mergeList.splice(i, 1);
          console.log(this.mergeList)

        }
      }
    }
  }
  checked(index: any) {
    return false;
  }
  goTo(index: any) {
    sessionStorage.setItem('portfolio_id', this.autoPopulate.products[index].id);
    this.router.navigate(['/details'])
  }
  editPortfolio(index: any) {
    sessionStorage.setItem('portfolio_details', this.autoPopulate.products[index]);
    this.portfolio_detials = this.autoPopulate.products[index];
    let isModelPortfolio = !this.portfolio_detials.is_scratch;
    this.listingService.portfolio = this.autoPopulate.products[index];
    this.listingService.isRedirected = true;
    if (isModelPortfolio) {
      this.router.navigate(['/stepper']);
    }
    else {
      this.router.navigate(['/stepper-scratch']);
    }


  }
  ngOnDestroy(): void {
    this.listingService.go.subscribe((response: any) => {
      console.log(response);
    })
    this.dialog.closeAll();
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  };
  merge() {
    this.modalService.open(ConfirmComponent)

    this.subscription = this.listingService.go.subscribe((result: any) => {
      console.log(result)
      let primaryportfolioId = this.mergeList[0].id
      console.log(primaryportfolioId)
      let secondaryportfolioId = []
      for (var i = 1; i < this.mergeList.length; i++) {
        secondaryportfolioId.push(this.mergeList[i].id)
      }
      console.log(secondaryportfolioId);
      let request = {
        'user': this.service.user_id,
        'primary_portfolio_id': primaryportfolioId,
        'secondary_portfolio_id': secondaryportfolioId
      }
      if (result === true) {
        this.listingService.mergePortfolios(request).subscribe((result) => {
          console.log(result);
          this.mergeList = []
          this.ngOnInit();
        })
      }
    })

  }

  changeOptimizationTitle(index:number){
    this.autoPopulate.optimizationTitle = this.autoPopulate.products[index]['portfolioName']
    this.autoPopulate.stockTableData = this.autoPopulate.products[index]['stock_data']
    // console.log('from change op title')
    // console.log(this.autoPopulate.products)
    // console.log(this.autoPopulate.stockTableData)
    this.autoPopulate.detectTitleChange = true

  }

  changeBacktestingTitle(index:number){
    this.autoPopulate.detectBacktestChange = true
    this.autoPopulate.backtestTitle = this.autoPopulate.products[index]['portfolioName']
    console.log('printing va from home page',this.autoPopulate.stockTableData)
  }
}

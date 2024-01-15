import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { HoldingDataService } from 'src/app/shared/services/holdingdata.service';
import { ToastrService } from 'ngx-toastr';
import { TabViewModule } from 'primeng/tabview';
import { MenuItem } from 'primeng/api';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
@Component({
  selector: 'app-index-tracking',
  templateUrl: './index-tracking.component.html',
  styleUrls: ['./index-tracking.component.scss']
})


export class IndexTrackingComponent implements OnInit {

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  items: MenuItem[] = [
    { label: 'Tracking Input', icon: 'pi pi-fw pi-pencil' },
    { label: 'Tracking Error', icon: 'pi pi-fw pi-calendar' },
    { label: 'Portfolio Allocation', icon: 'pi pi-fw pi-file' },

  ];
  isTabSlideEnabled = false;

  isFormSubmitting = true;
  selectedTabIndex = 0;
  tabIndexChanged(index: number) {
    if (!this.isTabSlideEnabled && index !== this.selectedTabIndex) {
      this.selectedTabIndex = this.selectedTabIndex;
    }
  }

  onTabChange(event: any) {
    console.log(event)
  }
  start_weekend: boolean = false;
  end_weekend: boolean = false;
  backend = ['Quantum', 'Classical']
  pieChartData: any;
  lineChartData: any;
  trackingError: any;
  showLineChart: boolean = false;
  activeTab: string;

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  form: any = this.fb.group({
    backends: new FormControl(['classical'], Validators.required),
    benchmark: new FormControl('nasdaq100', Validators.required),
    lb: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    ub: new FormControl(30, [Validators.required, Validators.min(1), Validators.max(100)]),
    total_stocks: new FormControl(25, [Validators.required, Validators.min(1)]),
    start_date: new FormControl('2015-01-02', Validators.required),
    end_date: new FormControl('2020-06-01', Validators.required),
    lam: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(1)]),
    assets: this.fb.array([]),
    token: new FormControl('', Validators.required),

  });
  get assets() {
    return this.form.controls["assets"] as FormArray;
  }
  backEnd(event: any) {
    console.log(event.target.value)
    this.form.get('backend').patchValue(event.target.value);
  }



  @ViewChild('NgbdDatepicker') model: NgbDateStruct;
  stocks: any;
  spinner: boolean = false
  resultPage: boolean = false

  constructor(private toastr: ToastrService, private fb: FormBuilder, private userdataService: UserDataService, private calendar: NgbCalendar, private holdingService: HoldingDataService, public loader: LoaderService, private autoPopulate: AutoPopulateService) {
  }

  ngOnInit(): void {
    this.stockList = this.autoPopulate.companyNames;
    this.transactionLimitForm = this.fb.group({
      TransactionLimit: this.fb.array([])
    });
    this.addHolding();
    this.addHoldingTL();
  }

  date(data: string) {
    switch (data) {
      case 'start':
        this.start_weekend = this.userdataService.isWeekend(this.form.get('start_date')?.value);
        break;
      case 'end':
        this.end_weekend = this.userdataService.isWeekend(this.form.get('end_date')?.value)
    }
  }

  setPieChart(data) {  //Pie Chart
    this.pieChartData = {
      title: 'Pie Chart',
      type: 'PieChart',
      columnNames: ['Stock', 'Values'],
      data: data,
      height: 550,
      width: 550,
      chartArea: { left: 0, top: 0, 'width': '100%', 'height': '100%' },
    }
  }

  setLineChart(data: any) { //Line Chart
    this.lineChartData = {
      title: 'Line Chart',
      type: 'LineChart',
      data: data,
      columnNames: ["Date", "Portfolio", "Index"],
      options: {
        legend: {
          position: 'top'
        },
        hAxis: {
          format: 'MMM-yyyy'
        },
        vAxis: {
          format: '#,#####.##'
        },
      },
      width: 1000,
      height: 500
    };
  }
  formatData(tableData: any, keyString: string, flag: boolean = false) {
    const data = {}
    if (flag) {
      for (let i of tableData) {
        var k = Object.entries(i).slice(1,)
        var otherData = Object.fromEntries(k)
        data[this.autoPopulate.nameObject[i[keyString]]] = otherData
      }
    }
    else {
      for (let i of tableData) {
        var k = Object.entries(i).slice(1,)
        var otherData = Object.fromEntries(k)
        data[i[keyString]] = otherData
      }
    }
    return data
  }
  index_track() {
    const assetData = this.formatData(this.form.controls.assets.value, "stockTicker", true)
    const transactionLimitValue = this.transactionLimitForm.controls.TransactionLimit.value;
    const transactionLimitDataObject = this.formatData(transactionLimitValue, "Stocks", true);
    const transactionLimitDataKeys = Object.keys(transactionLimitDataObject);

    const backends = this.form.value.backends;
    const benchmark = this.form.value.benchmark;
    const lb = this.form.value.lb;
    const ub = this.form.value.ub;
    const total_stocks = this.form.value.total_stocks;
    const start_date = this.form.value.start_date;
    const end_date = this.form.value.end_date;
    const lam = this.form.value.lam;
    const assets = transactionLimitDataObject;
    const token = this.form.value.token;

    // Create the payload object
    const payload = {
      backends: backends,
      benchmark: benchmark,
      lb: lb,
      ub: ub,
      total_stocks: total_stocks,
      start_date: start_date,
      end_date: end_date,
      lam: lam,
      assets: transactionLimitDataKeys,
      token: token,
      strategy: "L2"
    };

    this.isFormSubmitting = true;
    this.resultPage = false
    // this.spinner = true
    this.loader.showLoader();
    this.userdataService.index_tracking(payload).subscribe({
      next: (response: any) => {
        console.log(response)
        var temp_data = Object.entries(response.weights_classical)
        const piedata = temp_data.map(([stock, data]) => [stock, data['2020-06-01']]);
        this.setPieChart(piedata)

        // var graphData = response.graph.data;

        // for (var i = 0; i < graphData.length; i++) {
        //   graphData[i].splice(0, 1, new Date(graphData[i][0]));
        //   graphData[i][1] = Number(parseFloat(graphData[i][1]).toFixed(2));
        //   graphData[i][2] = Number(parseFloat(graphData[i][2]).toFixed(2))
        // }

        // this.setLineChart(graphData)
        // this.trackingError = Number(parseFloat(response.tracking_error).toFixed(2))
      },
      error: (error) => {
        this.toastr.error('Solution not found ', 'Error', {
          closeButton: false,
          tapToDismiss: true,
          disableTimeOut: true,
          positionClass: 'toast-test-top-center'
        });
        console.error(error);
        this.loader.hideLoader();
      },
      complete: () => {
        this.resultPage = true;
        this.loader.hideLoader();
        this.isTabSlideEnabled = true;
        this.tabGroup.selectedIndex = this.tabGroup.selectedIndex + 1;

      }
    })
  }

  temp(event) {
    if (this.resultPage == true) {
      console.log(this.showLineChart);
      this.showLineChart = true;
      console.log(this.showLineChart)
    }
  }
  clicked: boolean = false;
  clickedTL: boolean = false;
  stockList: any;
  autoComplete(i, $event) {
    this.clicked = true;
    let stock = this.assets.value[i].stockTicker;
    if (stock) {
      this.stockList = this.searchFromTickers(this.autoPopulate.companyNames, stock);
    }
  }
  autoCompleteTL(i, $event) {
    this.clicked = true;
    let stock = this.assets.value[i].Stocks;
    if (stock) {
      this.stockList = this.searchFromTickers(this.autoPopulate.companyNames, stock);
    }
  }
  clickedArray($event) {
    this.clicked = true;
  }
  clickedArrayTL($event) {
    this.clickedTL = true;
  }
  addHolding() {
    const holdingForm = this.fb.group({
      stockTicker: [''],
      allocation: [''],
      expectedReturn: [''],
      expectedVolatility: [''],
      lb: [''],
      ub: [''],
      group: ['']
    })
    this.assets.push(holdingForm);
  }
  deleteHolding(holdingIndex: number) {
    this.assets.removeAt(holdingIndex);
  }
  searchFromTickers(arr, regex) {
    let matches = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].toLowerCase().match(regex.toLowerCase())) {
        matches.push(arr[i]);
      }
    }
    return matches
  }
  takeTransactionLimit: boolean = false;

  transactionLimitForm: any;
  // groupTableForm: any;
  transactionLimitValue: null;


  // toggle for transaction limit
  toggleTL() {
    this.takeTransactionLimit = !this.takeTransactionLimit
    // this.addHoldingTL();
  }

  updateTransactionLimit(event) {
    this.transactionLimitValue = event.target.value
  }

  get TransactionLimit() {
    return this.transactionLimitForm.controls["TransactionLimit"] as FormArray;
  }

  // For Transaction Limit Table
  addHoldingTL() {
    console.log("addd")
    const transactionLimit = this.fb.group({
      Stocks: [''],
    })
    console.log(transactionLimit)
    this.TransactionLimit.push(transactionLimit);
    console.log(this.transactionLimitForm)
  }
  deleteHoldingTL(holdingIndex: number) {
    this.TransactionLimit.removeAt(holdingIndex);
  }



}

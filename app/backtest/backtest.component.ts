import { BacktestBackendService } from 'src/app/shared/services/backtest-backend.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { FormsModule,FormBuilder, FormControl, Validators,FormGroup,FormArray} from '@angular/forms';
import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/services/loader.service';
@Component({
  selector: 'app-backtest',
  templateUrl: './backtest.component.html',
  styleUrls: ['./backtest.component.scss']
})


export class BacktestComponent implements OnInit, DoCheck {


  tperiod = ['Month-to-Month', 'Year-to-Year'];
  cashflows =['None','Contribute fixed amount','Withdraw fixed amount'];
  rebalancing = ['No rebalancing','Rebalance annually','Rebalance semi-annually','Rebalance quarterly','Rebalance monthly'];
  benchmark = ['NASDAQ-100','S&P 500','DOW 30'];
  frequency = ['Monthly','Quarterly','Annually', 'Semi-Annually'];
  cashflowflag:boolean = false;
  cashflowlabel = 'contribute';
  rebalancingObject = {
    'No rebalancing':null,
    'Rebalance annually':'Annually',
    'Rebalance semi-annually':'Semi-Annually',
    'Rebalance quarterly':'Quarterly',
    'Rebalance monthly':'Monthly'
  }

  form :any;
  clicked: boolean = false;
  stockList: any; //stockList for auto suggesting
  holdingdata:any;
  tickers = ['A', 'AAL', 'AAP', 'AAPL', 'ABC', 'ABMD', 'ABT', 'ACN', 'ADBE', 'ADI', 'ADM', 'ADP', 'ADSK', 'AEE', 'AEP', 'AES', 'AFL', 'AIG', 'AIZ', 'AJG', 'AKAM', 'ALB', 'ALGN', 'ALK', 'ALL', 'AMAT', 'AMD', 'AME', 'AMGN', 'AMP', 'AMT', 'AMZN', 'ANSS', 'ANTM', 'AON', 'AOS', 'APA', 'APD', 'APH', 'ARE', 'ATO', 'ATVI', 'AVB', 'AVGO', 'AVY', 'AWK', 'AXP', 'AZO', 'BA', 'BAC', 'BAX', 'BBWI', 'BBY', 'BDX', 'BEN', 'BF-B', 'BIIB', 'BIO', 'BK', 'BKNG', 'BKR', 'BLK', 'BMY', 'BR', 'BRK-B', 'BRO', 'BSX', 'BWA', 'BXP', 'C', 'CAG', 'CAH', 'CAT', 'CB', 'CBRE', 'CCI', 'CCL', 'CDNS', 'CE', 'CF', 'CHD', 'CHRW', 'CI', 'CINF', 'CL', 'CLX', 'CMA', 'CMCSA', 'CME', 'CMG', 'CMI', 'CMS', 'CNC', 'CNP', 'COF', 'COO', 'COP', 'COST', 'CPB', 'CPRT', 'CPT', 'CRL', 'CRM', 'CSCO', 'CSX', 'CTAS', 'CTRA', 'CTSH', 'CTXS', 'CVS', 'CVX', 'D', 'DAL', 'DD', 'DE', 'DFS', 'DG', 'DGX', 'DHI', 'DHR', 'DIS', 'DISH', 'DLR', 'DLTR', 'DOV', 'DPZ', 'DRE', 'DRI', 'DTE', 'DUK', 'DVA', 'DVN', 'DXC', 'DXCM', 'EA', 'EBAY', 'ECL', 'ED', 'EFX', 'EIX', 'EL', 'EMN', 'EMR', 'EOG', 'EQIX', 'EQR', 'ES', 'ESS', 'ETN', 'ETR', 'EVRG', 'EW', 'EXC', 'EXPD', 'EXPE', 'EXR', 'F', 'FAST', 'FCX', 'FDS', 'FDX', 'FE', 'FFIV', 'FIS', 'FISV', 'FITB', 'FMC', 'FRT', 'FTNT', 'GD', 'GE', 'GILD', 'GIS', 'GL', 'GLW', 'GOOG', 'GOOGL', 'GPC', 'GPN', 'GRMN', 'GS', 'GWW', 'HAL', 'HAS', 'HBAN', 'HD', 'HES', 'HIG', 'HOLX', 'HON', 'HPQ', 'HRL', 'HSIC', 'HST', 'HSY', 'HUM', 'IBM', 'ICE', 'IDXX', 'IEX', 'IFF', 'ILMN', 'INCY', 'INTC', 'INTU', 'IP', 'IPG', 'IPGP', 'IRM', 'ISRG', 'IT', 'ITW', 'IVZ', 'J', 'JBHT', 'JCI', 'JKHY', 'JNJ', 'JNPR', 'JPM', 'K', 'KEY', 'KIM', 'KLAC', 'KMB', 'KMX', 'KO', 'KR', 'L', 'LDOS', 'LEN', 'LH', 'LHX', 'LIN', 'LKQ', 'LLY', 'LMT', 'LNC', 'LNT', 'LOW', 'LRCX', 'LUMN', 'LUV', 'LVS', 'LYV', 'MA', 'MAA', 'MAR', 'MAS', 'MCD', 'MCHP', 'MCK', 'MCO', 'MDLZ', 'MDT', 'MET', 'MGM', 'MHK', 'MKC', 'MKTX', 'MLM', 'MMC', 'MMM', 'MNST', 'MO', 'MOH', 'MOS', 'MPWR', 'MRK', 'MRO', 'MS', 'MSCI', 'MSFT', 'MSI', 'MTB', 'MTCH', 'MTD', 'MU', 'NDAQ', 'NDSN', 'NEE', 'NEM', 'NFLX', 'NI', 'NKE', 'NLOK', 'NOC', 'NRG', 'NSC', 'NTAP', 'NTRS', 'NUE', 'NVDA', 'NVR', 'NWL', 'O', 'ODFL', 'OKE', 'OMC', 'ORCL', 'ORLY', 'OXY', 'PARA', 'PAYX', 'PCAR', 'PEAK', 'PEG', 'PENN', 'PEP', 'PFE', 'PFG', 'PG', 'PGR', 'PH', 'PHM', 'PKG', 'PKI', 'PLD', 'PM', 'PNC', 'PNR', 'PNW', 'POOL', 'PPG', 'PPL', 'PRU', 'PSA', 'PTC', 'PVH', 'PWR', 'PXD', 'QCOM', 'RCL', 'RE', 'REG', 'REGN', 'RF', 'RHI', 'RJF', 'RL', 'RMD', 'ROK', 'ROL', 'ROP', 'ROST', 'RSG', 'RTX', 'SBAC', 'SBNY', 'SBUX', 'SCHW', 'SEE', 'SHW', 'SIVB', 'SJM', 'SLB', 'SNA', 'SNPS', 'SO', 'SPG', 'SPGI', 'SRE', 'STE', 'STT', 'STX', 'STZ', 'SWK', 'SWKS', 'SYK', 'SYY', 'T', 'TAP', 'TDG', 'TDY', 'TECH', 'TEL', 'TER', 'TFC', 'TFX', 'TGT', 'TJX', 'TMO', 'TMUS', 'TPR', 'TRMB', 'TROW', 'TRV', 'TSCO', 'TSN', 'TT', 'TTWO', 'TXN', 'TXT', 'TYL', 'UAA', 'UAL', 'UDR', 'UHS', 'ULTA', 'UNH', 'UNP', 'UPS', 'URI', 'USB', 'V', 'VFC', 'VLO', 'VMC', 'VNO', 'VRSK', 'VRSN', 'VRTX', 'VTR', 'VTRS', 'VZ', 'WAB', 'WAT', 'WBA', 'WBD', 'WDC', 'WEC', 'WELL', 'WFC', 'WHR', 'WM', 'WMB', 'WMT', 'WRB', 'WST', 'WTW', 'WY', 'WYNN', 'XEL', 'XOM', 'XRAY', 'YUM', 'ZBH', 'ZBRA', 'ZION'];
  tabIndex = 0
  benchmarkObject = {
    'S&P 500': ['gspc','^GSPC'],
    'NASDAQ-100': ['nasdaq100','Nasdaq'],
  }
  columns:any
  ngOnInit() {

    this.form=this.fb.group({
      backtestHoldings: this.fb.array([])
    });

    this.stockList = this.autoPopulate.companyNames;
  }


  get backtestHoldings() {
    return this.form.controls["backtestHoldings"] as FormArray;
  }

  addHolding() {
    const holdingForm = this.fb.group({
      StockTicker: [''],
      Portfolio1:[''],
      Portfolio2:['']

    })
    this.backtestHoldings.push(holdingForm);
  }

  deleteHolding(holdingIndex: number) {
    this.backtestHoldings.removeAt(holdingIndex);

  }

  clickedArray($event) {
    this.clicked = true;
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

  autoComplete(i, $event) {
    this.clicked = true;
    let stock = this.backtestHoldings.value[i].stockTicker;
    if (stock) {
      this.stockList = this.searchFromTickers(this.autoPopulate.companyNames , stock);
    }
  }


  // title='RactiveForms';

  constructor(private fb: FormBuilder,
              public autoPopulate: AutoPopulateService,
              public backtestBackend:BacktestBackendService,
              public loader:LoaderService,
              private toastr: ToastrService) {
  }

  BacktestForm: any = this.fb.group({

    tperiod: new FormControl('Year-to-Year', Validators.required),
    start_date: new FormControl('2015-01-02', Validators.required),
    end_date: new FormControl('2020-06-01', Validators.required),

    Iamount: new FormControl(10000, Validators.required),
    Cashflows : new FormControl('None', Validators.required),
    CashflowsAmount:new FormControl(1000, Validators.required),
    CashflowsFrequency:new FormControl('Monthly', Validators.required),

    Rebalancing: new FormControl('No rebalancing', Validators.required),
    Benchmark: new FormControl('NASDAQ-100', Validators.required)

  });

  Tperiod(event: any) {
    this.BacktestForm.get('tperiod').patchValue(event.target.value);
  }

  StartDate(event: any) {
    this.BacktestForm.get('start_date').patchValue(event.target.value);
  }

  EndDate(event: any) {
    this.BacktestForm.get('end_date').patchValue(event.target.value);
  }

  CashFlows(event: any) {
    this.BacktestForm.get('Cashflows').patchValue(event.target.value);
    if (event.target.value!="None"){
      this.cashflowflag=true
      // console.log(event.target.value)
      if (event.target.value=='Contribute fixed amount'){
        this.cashflowlabel='contribute'
      }
      else {
        this.cashflowlabel='withdraw'
      }
    }
    else {
      this.cashflowflag=false

    }
  }
  CashFlowsAmount(event: any) {
    this.BacktestForm.get('CashflowsAmount').patchValue(event.target.value);
  }
  CashFlowsFrequency(event: any) {

    this.BacktestForm.get('CashflowsFrequency').patchValue(event.target.value);
  }
  Rebalancing(event: any) {
    this.BacktestForm.get('Rebalancing').patchValue(event.target.value);
  }

  Benchmark(event: any) {
    this.BacktestForm.get('Benchmark').patchValue(event.target.value);
  }

onSubmit(){
  console.log(this.BacktestForm.value)
  console.log(this.form.value)
}
savedData = null;

formatData(tableData:any, keyString:string, flag:boolean = false) {
  const data = {}
  if (flag) {
    for (let i of tableData) {
    var k = Object.entries(i).slice(1,)
    var otherData = Object.fromEntries(k)
    data[this.autoPopulate.nameObject[i[keyString]]] = otherData}
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
  tabIndexChanged(index:number){
    this.tabIndex = index
  }
  updateMetricsTable (res:any, portfolioList:any){
    // update columns for metrics table
    let columns = ['index_health'].concat(portfolioList)

    // update table values
    let table = {'index_health':res.health_metrics[portfolioList[0]].index_health}
    for (let portfolio of portfolioList){
      table[portfolio] = res.health_metrics[portfolio].weights_provided_health
    }
    return [table, columns]
}


save() {
  this.loader.showLoader()
   this.savedData = this.BacktestForm.values
   console.log('this is backtest asset data',this.form.controls.backtestHoldings.value)

   // format sip amount value (positive or negative)
   let cashflowType = this.BacktestForm.get('Cashflows').value
   let cashflowObject = {
    'Contribute fixed amount' : 1,
    'Withdraw fixed amount' : -1,
    'None' : 0,
   }
   let sipAmount = cashflowObject[cashflowType] * this.BacktestForm.get('CashflowsAmount').value
   let assetData = this.formatData(this.form.controls.backtestHoldings.value, "StockTicker", true)
   this.backtestBackend.becnchmarkValue.next(this.benchmarkObject[this.BacktestForm.get('Benchmark').value][1])
   this.backtestBackend.metricsTableColumnsDisplay['index_health'] = this.backtestBackend.becnchmarkValue.value
   const payload = {
    start_date : this.BacktestForm.get('start_date').value,
    end_date : this.BacktestForm.get('end_date').value,
    benchmark : this.benchmarkObject[this.BacktestForm.get('Benchmark').value][0],//this.BacktestForm.get('Benchmark').value,
    asset_data : assetData,
    money : this.BacktestForm.get('Iamount').value,
    sip_amount: sipAmount,
    sip_frequency : this.BacktestForm.get('CashflowsFrequency').value,
    rebalance_frequency : this.rebalancingObject[this.BacktestForm.get('Rebalancing').value]  }
    this.columns = []
    this.backtestBackend.backtestAPI(payload).subscribe({
    next: (res) => {
      console.log('this is backtest response')
      console.log(res)


      let portfolio1Weights = []
      let portfolio2Weights = []

      console.log('this is bool ')
      console.log(res.health_metrics.hasOwnProperty('portfolio2')==true)
      console.log(res.health_metrics.hasOwnProperty('portfolio1')===true)
      console.log((res.health_metrics.hasOwnProperty('portfolio1')===true) && (res.health_metrics.hasOwnProperty('portfolio2')==true))
      if((res.health_metrics.hasOwnProperty('portfolio1')===true) && (res.health_metrics.hasOwnProperty('portfolio2')==true)) {
        // update metrics table data
        const [newTable, newColumns]  = this.updateMetricsTable(res,['portfolio1','portfolio2'])
        this.backtestBackend.metricsTable.next(newTable)
        this.columns = newColumns

        // update weights
        for (let key in res.weights.portfolio1) {
            const newKey = this.autoPopulate.tickerObject[key]
            portfolio1Weights.push([newKey,res.weights.portfolio1[key]])
            portfolio2Weights.push([newKey,res.weights.portfolio2[key]])
        }
        this.backtestBackend.portfolio1.next(portfolio1Weights)
        this.backtestBackend.portfolio2.next(portfolio2Weights)

        // update portfolio growth chart
        this.backtestBackend.formatPgOutput(res.chart,['portfolio1','portfolio2'])

        // update drawdown chart
        this.backtestBackend.formatDdOutput(res.chart,['portfolio1','portfolio2'])
    }
      // If there is no portfolio 2
      else if (res.health_metrics.hasOwnProperty('portfolio1')===true){
          // update metrics table data
          const [newTable, newColumns]  = this.updateMetricsTable(res,['portfolio1'])
          this.backtestBackend.metricsTable.next(newTable)
          this.columns = newColumns
          // update weights
          for (let key in res.weights.portfolio1) {
            const newKey = this.autoPopulate.tickerObject[key]
            portfolio1Weights.push([newKey,res.weights.portfolio1[key]])
        }
          this.backtestBackend.portfolio1.next(portfolio1Weights)
          this.backtestBackend.portfolio2.next([['None',100]])

          // update portfolio growth chart
          this.backtestBackend.formatPgOutput(res.chart,['portfolio1'])

          // update drawdown chart
          this.backtestBackend.formatDdOutput(res.chart,['portfolio1'])
      }


      else if(res.health_metrics.hasOwnProperty('portfolio2')===true){
          // update metrics table data
          const [newTable, newColumns]  = this.updateMetricsTable(res,['portfolio2'])
          this.backtestBackend.metricsTable.next(newTable)
          this.columns = newColumns
          // update weights
          for (let key in res.weights.portfolio2) {
            const newKey = this.autoPopulate.tickerObject[key]
            portfolio2Weights.push([newKey,res.weights.portfolio2[key]])
        }
          this.backtestBackend.portfolio2.next(portfolio2Weights)
          this.backtestBackend.portfolio1.next([['None',100]])

          // update portfolio growth chart
          this.backtestBackend.formatPgOutput(res.chart,['portfolio2'])

          // update drawdown chart
          this.backtestBackend.formatDdOutput(res.chart,['portfolio2'])
      }

      this.backtestBackend.metricsTableColumns.next(this.columns)


      this.loader.hideLoader()

      // shift to results tab
      this.tabIndex = 1
    },
    error: (error) => {
      this.loader.hideLoader()
      this.toastr.error('Solution not found ', 'Error', {
        closeButton: false,
        tapToDismiss: true,
        disableTimeOut: true,
        positionClass: 'toast-test-top-center'
      });
    },
    complete() {

    },
  })

}

ngDoCheck() {
  // if (this.scroll==true && this.showTable==true) {
  //   console.log('scrolling')
  //   window.scrollTo(0,window.outerHeight);
  //   this.scroll = false
  // }
  // if (this.autoPopulate.detectBacktestChange==true){
  //   console.log('Inside optimization do check')
  //   this.form=this.fb.group({
  //     investment_amount: ['',Validators.required],
  //     // tenure: ['',Validators.required],
  //     stockHoldings: this.fb.array([])
  //   });
  //   if (this.autoPopulate.stockTableData.length>0){
  //   for (let i = 0; i < this.autoPopulate.stockTableData.length; i++) {
  //     console.log('This is the length of the stock table data')
  //     console.log(this.autoPopulate.stockTableData.length)
  //     const holdingForm = this.fb.group({
  //       StockTicker: this.autoPopulate.stockTableData[i]['StockTicker'],
  //       Portfolio1: this.autoPopulate.stockTableData[i]['Amount'],
  //       Portfolio2: [''],
  //     })
  //     this.backtestHoldings.push(holdingForm);
  //   }
  //   }
  //   this.autoPopulate.detectBacktestChange = false
  // }
}

}

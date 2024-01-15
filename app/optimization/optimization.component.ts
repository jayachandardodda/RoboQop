import { Router } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';


import { Component, DoCheck, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormControl, Validators, FormGroup, FormArray, FormArrayName } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { ToastrService } from 'ngx-toastr';
import { HoldingDataService } from 'src/app/shared/services/holdingdata.service';
import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
import { OptimizationBackendService } from 'src/app/shared/services/optimization-backend.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

// Investor's View
interface Stock {
  name?: string;
  code?: string;
}
interface InvestorsView {
  by?: string;
  confidence?: string;
  outperforming_asset?: string[];
  underperforming_asset?: string[];
}

@Component({
  selector: 'app-optimization',
  templateUrl: './optimization.component.html',
  styleUrls: ['./optimization.component.scss']
})


export class OptimizationComponent implements OnInit, DoCheck {
  selected_stocks: Stock[] = [];
  public isChecked: boolean = false;
  public showFile: boolean = false;
  excludeVolatility: boolean = false;
  excludeCorrelations: boolean = false;
  takeTransactionLimit: boolean = false;
  form: any;
  investorsViewForm:any
  transactionLimitForm: any;
  // groupTableForm: any;
  transactionLimitValue: null;
  formArray: any;
  backtesting: any;
  clicked: boolean = false;
  stockList: any;
  holdingdata: any;
  leftAmount: any;
  start_weekend: boolean = false;
  end_weekend: boolean = false;
  portfoliotype = ['Asset Classes', 'Tiker'];
  tperiod = ['Month-to-Month', 'Year-to-Year'];
  Ytd = ['Yes', 'No'];
  stimes = ['1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2015', '2016', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
  etimes = ['1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2015', '2016', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
  OptimizationStartegy = ['MPT', 'HRP', 'CVAR', 'CDAR', 'Index Tracking (Tracking Error)', 'Index Tracking (L2 Norm)', "Investor`s View"]
  defaultOptimizationGoal = ['Minimize Risk', 'Target Risk', 'Target Returns', 'Max Returns', 'Risk Return']
  optimizationGoal = {
    'MPT': ['Minimize Risk', 'Target Risk', 'Target Returns', 'Max Returns', 'Risk Return'],
    'HRP': ['HRP'], 'CVAR': ['Minimize CVaR', 'Target Returns'], 'CDAR': ['Minimize CDaR', 'Target Returns'], 'Index Tracking (Tracking Error)': ['Min Tracking Error', 'Target Mean Active Return'], 'Index Tracking (L2 Norm)': ['Min L2 Norm', 'Target Mean Active Return'], "Investor`s View": ["Investor`s View"]
  }
  benchmarks = ['NASDAQ-100','SP500','DOW-JONES30']
  ComparedAllocation = ['None', 'Equal Weighted', 'Risk Parity weighted', 'Maximum Sharpe Ratio Weighted']
  UseHistoricalReturns = ['Yes', 'No']
  // volatility = ['Yes','No']
  // correlations = ['Yes','No']
  AssetConstraints = ['No', 'Yes']
  excludeInvestorsView = ['Yes', 'No']
  arr = 0
  minAssets = null
  maxAssets = null
  totalAssets = 1
  Benchmark = ["None", "Specific Ticker...", 'import Benchmark...']
  // tickers = ['A', 'AAL', 'AAP', 'AAPL', 'ABC', 'ABMD', 'ABT', 'ACN', 'ADBE', 'ADI', 'ADM', 'ADP', 'ADSK', 'AEE', 'AEP', 'AES', 'AFL', 'AIG', 'AIZ', 'AJG', 'AKAM', 'ALB', 'ALGN', 'ALK', 'ALL', 'AMAT', 'AMD', 'AME', 'AMGN', 'AMP', 'AMT', 'AMZN', 'ANSS', 'ANTM', 'AON', 'AOS', 'APA', 'APD', 'APH', 'ARE', 'ATO', 'ATVI', 'AVB', 'AVGO', 'AVY', 'AWK', 'AXP', 'AZO', 'BA', 'BAC', 'BAX', 'BBWI', 'BBY', 'BDX', 'BEN', 'BF-B', 'BIIB', 'BIO', 'BK', 'BKNG', 'BKR', 'BLK', 'BMY', 'BR', 'BRK-B', 'BRO', 'BSX', 'BWA', 'BXP', 'C', 'CAG', 'CAH', 'CAT', 'CB', 'CBRE', 'CCI', 'CCL', 'CDNS', 'CE', 'CF', 'CHD', 'CHRW', 'CI', 'CINF', 'CL', 'CLX', 'CMA', 'CMCSA', 'CME', 'CMG', 'CMI', 'CMS', 'CNC', 'CNP', 'COF', 'COO', 'COP', 'COST', 'CPB', 'CPRT', 'CPT', 'CRL', 'CRM', 'CSCO', 'CSX', 'CTAS', 'CTRA', 'CTSH', 'CTXS', 'CVS', 'CVX', 'D', 'DAL', 'DD', 'DE', 'DFS', 'DG', 'DGX', 'DHI', 'DHR', 'DIS', 'DISH', 'DLR', 'DLTR', 'DOV', 'DPZ', 'DRE', 'DRI', 'DTE', 'DUK', 'DVA', 'DVN', 'DXC', 'DXCM', 'EA', 'EBAY', 'ECL', 'ED', 'EFX', 'EIX', 'EL', 'EMN', 'EMR', 'EOG', 'EQIX', 'EQR', 'ES', 'ESS', 'ETN', 'ETR', 'EVRG', 'EW', 'EXC', 'EXPD', 'EXPE', 'EXR', 'F', 'FAST', 'FCX', 'FDS', 'FDX', 'FE', 'FFIV', 'FIS', 'FISV', 'FITB', 'FMC', 'FRT', 'FTNT', 'GD', 'GE', 'GILD', 'GIS', 'GL', 'GLW', 'GOOG', 'GOOGL', 'GPC', 'GPN', 'GRMN', 'GS', 'GWW', 'HAL', 'HAS', 'HBAN', 'HD', 'HES', 'HIG', 'HOLX', 'HON', 'HPQ', 'HRL', 'HSIC', 'HST', 'HSY', 'HUM', 'IBM', 'ICE', 'IDXX', 'IEX', 'IFF', 'ILMN', 'INCY', 'INTC', 'INTU', 'IP', 'IPG', 'IPGP', 'IRM', 'ISRG', 'IT', 'ITW', 'IVZ', 'J', 'JBHT', 'JCI', 'JKHY', 'JNJ', 'JNPR', 'JPM', 'K', 'KEY', 'KIM', 'KLAC', 'KMB', 'KMX', 'KO', 'KR', 'L', 'LDOS', 'LEN', 'LH', 'LHX', 'LIN', 'LKQ', 'LLY', 'LMT', 'LNC', 'LNT', 'LOW', 'LRCX', 'LUMN', 'LUV', 'LVS', 'LYV', 'MA', 'MAA', 'MAR', 'MAS', 'MCD', 'MCHP', 'MCK', 'MCO', 'MDLZ', 'MDT', 'MET', 'MGM', 'MHK', 'MKC', 'MKTX', 'MLM', 'MMC', 'MMM', 'MNST', 'MO', 'MOH', 'MOS', 'MPWR', 'MRK', 'MRO', 'MS', 'MSCI', 'MSFT', 'MSI', 'MTB', 'MTCH', 'MTD', 'MU', 'NDAQ', 'NDSN', 'NEE', 'NEM', 'NFLX', 'NI', 'NKE', 'NLOK', 'NOC', 'NRG', 'NSC', 'NTAP', 'NTRS', 'NUE', 'NVDA', 'NVR', 'NWL', 'O', 'ODFL', 'OKE', 'OMC', 'ORCL', 'ORLY', 'OXY', 'PARA', 'PAYX', 'PCAR', 'PEAK', 'PEG', 'PENN', 'PEP', 'PFE', 'PFG', 'PG', 'PGR', 'PH', 'PHM', 'PKG', 'PKI', 'PLD', 'PM', 'PNC', 'PNR', 'PNW', 'POOL', 'PPG', 'PPL', 'PRU', 'PSA', 'PTC', 'PVH', 'PWR', 'PXD', 'QCOM', 'RCL', 'RE', 'REG', 'REGN', 'RF', 'RHI', 'RJF', 'RL', 'RMD', 'ROK', 'ROL', 'ROP', 'ROST', 'RSG', 'RTX', 'SBAC', 'SBNY', 'SBUX', 'SCHW', 'SEE', 'SHW', 'SIVB', 'SJM', 'SLB', 'SNA', 'SNPS', 'SO', 'SPG', 'SPGI', 'SRE', 'STE', 'STT', 'STX', 'STZ', 'SWK', 'SWKS', 'SYK', 'SYY', 'T', 'TAP', 'TDG', 'TDY', 'TECH', 'TEL', 'TER', 'TFC', 'TFX', 'TGT', 'TJX', 'TMO', 'TMUS', 'TPR', 'TRMB', 'TROW', 'TRV', 'TSCO', 'TSN', 'TT', 'TTWO', 'TXN', 'TXT', 'TYL', 'UAA', 'UAL', 'UDR', 'UHS', 'ULTA', 'UNH', 'UNP', 'UPS', 'URI', 'USB', 'V', 'VFC', 'VLO', 'VMC', 'VNO', 'VRSK', 'VRSN', 'VRTX', 'VTR', 'VTRS', 'VZ', 'WAB', 'WAT', 'WBA', 'WBD', 'WDC', 'WEC', 'WELL', 'WFC', 'WHR', 'WM', 'WMB', 'WMT', 'WRB', 'WST', 'WTW', 'WY', 'WYNN', 'XEL', 'XOM', 'XRAY', 'YUM', 'ZBH', 'ZBRA', 'ZION']
  groupConstraints = ['No', 'Yes']
  groupArray = ['A', 'B', 'C', 'D', 'E', 'F']
  trackGroupArray = []
  groupTableData: any[] = [
    // { name: 'A', lb: '0', ub: '100' },
    // { name: 'B', lb: '0', ub: '100' },
    // { name: 'C', lb: '0', ub: '100' },
    // { name: 'D', lb: '0', ub: '100' },
    // { name: 'E', lb: '0', ub: '100' },
    // { name: 'F', lb: '0', ub: '100' },
    // ...
  ];
  solverType = ['classical', 'quantum', 'both']
  specialGoalsArray = ['Target Risk', 'Target Returns', 'Risk Return']
  specialGoal = ''
  scroll = false
  showTable = false
  clickedTL: boolean = false;
  tabIndex = 0
  selectedTickers = []
  targetRisk: any
  targetReturn: any
  indexTrackingArray = ['Index Tracking (Tracking Error)', 'Index Tracking (L2 Norm)']
  indexTrackingObject = {
    'Index Tracking (Tracking Error)': 'TE',
    'Index Tracking (L2 Norm)': 'L2'
  }
  benchmarkObject = {
    'SP500': ['gspc','^GSPC'],
    'NASDAQ-100': ['nasdaq100','Nasdaq'],
  }
  betaValue:any = null
  lambdaValue:any = null
  investorsView:any = null

  // for resetting
  resetPg = {
    'classical': [['Date', 'Given Portfolio', 'Classically Optimized Portfolio',this.optimizeBackend.becnchmarkValue.value],[[0,0,0,0]]],
    'quantum' : [['Date', 'Given Portfolio', 'Quantum Optimized Portfolio',this.optimizeBackend.becnchmarkValue.value],[[0,0,0,0]]],
    'both': [['Date', 'Given Portfolio', 'Classically Optimized Portfolio', 'Quantum Optimized Portfolio',this.optimizeBackend.becnchmarkValue.value],[[0,0,0,0,0]]]
  }

  resetDd = {
    'classical': [['Date', 'Given Portfolio DD', 'Classically Optimized Portfolio DD', this.optimizeBackend.becnchmarkValue.value+' DD'],[[0,0,0,0]]],
    'quantum' : [['Date', 'Given Portfolio DD', 'Quantum Optimized Portfolio DD', this.optimizeBackend.becnchmarkValue.value+' DD'],[[0,0,0,0]]],
    'both':[['Date', 'Given Portfolio DD', 'Classically Optimized Portfolio DD','Quantum Optimized Portfolio DD', this.optimizeBackend.becnchmarkValue.value+' DD'],[[0,0,0,0,0]]]}


  // variables for validations
  startDateError:boolean = false
  endDateError:boolean = false
  minAssetsError:boolean = false
  maxAssetsError:boolean = false
  fractionValidator: any;
  selectedOption: string = 'option1';
  showOptions: boolean;
  http: any;
  // savedData: any;


  onSelectOption(option: string): void {

    this.selectedOption = option;

    this.showOptions = false;

  }

  constructor(private toastr: ToastrService,
    private fb: FormBuilder,
    private userdataService: UserDataService,
    private calendar: NgbCalendar,
    private holdingService: HoldingDataService,
    public autoPopulate: AutoPopulateService,
    private optimizationResults: OptimizationBackendService,
    public optimizeBackend: OptimizationBackendService,
    public loader: LoaderService,
    private userdata: UserDataService,
    private formBuilder: FormBuilder,
    private userDataService: UserDataService) {
     }

  ngOnInit() {
    this.form = this.fb.group({
      investment_amount: ['', Validators.required],
      // tenure: ['',Validators.required],
      stockHoldings: this.fb.array([])
    });
    this.transactionLimitForm = this.fb.group({
      TransactionLimit: this.fb.array([])
    })
    this.investorsViewForm = this.fb.group({
      investors_view: this.fb.array([])
    });
    this.addHolding();


    this.holdingdata.setChart('scratch');
    this.holdingdata.getStockPrice();//fetches twelve_year.json from assets using http(TODO:use direct import)

    this.stockList = this.autoPopulate.companyNames;
    this.backtesting = this.fb.group({
      start_time: new FormControl('2015-01-02', Validators.required),
      end_time: new FormControl('2020-06-01', Validators.required)
    })
    // if (this.autoPopulate.portfolioNameList.length==1){
    // for (var i = 0; i < this.autoPopulate.products.length; i++) {
    //   this.autoPopulate.portfolioNameList.push(this.autoPopulate.products[i]['portfolioName'])
    //   }
    // }

    // this.addHoldingTL();
  }
  // title='RactiveForms';


  async callonSubmit(): Promise<void> {
    console.log("Inside save button")
    this.loader.showLoader()
    try {
      const stockHoldingsData = []; // Array to hold all stock holdings

      for (const holdingForm of this.stockHoldings.controls) {
        const stockTicker = holdingForm.get('stockTicker').value;
        const allocation = holdingForm.get('allocation').value;

        stockHoldingsData.push({ stockTicker, allocation });
      }

      const savedOptimizedData = {
        portfolioName: this.OptimizationForm.get('portfolioNameList').value,
        stock_data: stockHoldingsData,
        user: sessionStorage.getItem('user_id')
      };

      console.log("savedOptimizedData: ",savedOptimizedData)
      this.userdata.saveportfolio(savedOptimizedData).subscribe({next: (res)=>{
        console.log(res)
        this.loader.hideLoader()
      },
    error:()=>{},
    complete:()=>{}});
    } 
    catch (error) {
      console.log("Error  in callonsubmit(): ", error);
    }
  };
  //   try {
  //     const portfolioData = {
  //       portfolioName: this.OptimizationForm.get('portfolioNameList').value,
  //       Allocation: this.OptimizationForm.get('ComparedAllocation').value,
  //       user: sessionStorage.getItem('user_id')
  //     };

  //     const result: any = await this.userdata.saveOptimisation(portfolioData).toPromise();
  //     console.log("Saved results: ",result);
  //     sessionStorage.setItem('portfolio_id', result.id);
  //     // Additional logic for success handling, e.g., showing toastr message or navigating
  //   } catch (error) {
  //     // Error handling, showing toastr message or logging the error
  //     console.log("Error in callonsubmit(): ", error)
  //   }
  // }


  ngDoCheck() {
    // if (this.scroll==true && this.showTable==true) {
    //   console.log('scrolling')
    //   window.scrollTo(0,window.outerHeight);
    //   this.scroll = false
    // }
    if (this.autoPopulate.detectTitleChange == true) {
      console.log('Inside optimization do check')
      this.form = this.fb.group({
        investment_amount: ['', Validators.required],
        // tenure: ['',Validators.required],
        stockHoldings: this.fb.array([])
      });

      if (this.autoPopulate.stockTableData.length > 0) {
        for (let i = 0; i < this.autoPopulate.stockTableData.length; i++) {
          console.log('This is the length of the stock table data')
          console.log(this.autoPopulate.stockTableData.length)
          const holdingForm = this.fb.group({
            portfolioName: this.autoPopulate.products[i]['portfolioName'],
            stockTicker: this.autoPopulate.stockTableData[i]['stockTicker'],
            allocation: this.autoPopulate.stockTableData[i]['allocation'],
            expectedReturn: [''],
            expectedVolatility: [''],
            lb: [''],
            ub: [''],
            group: ['']
          })
          let inputString = this.autoPopulate.stockTableData[i]['StockTicker']
          const current_asset: Stock = {};
          current_asset.name = inputString;
          current_asset.code = inputString;
          this.selected_stocks.push(current_asset)
          this.stockHoldings.push(holdingForm);
        }
      }
      this.autoPopulate.detectTitleChange = false
    }
    if (this.OptimizationForm.get('minAssets').value === null && this.OptimizationForm.get('maxAssets').value === null) {
      this.solverType = ['classical']
    }
    else if (this.OptimizationForm.get('defaultOptimizationGoal').value === 'Max Sharpe Ratio') {
      this.solverType = ['classical']
    }
    else if (this.OptimizationForm.get('defaultOptimizationGoal').value === 'Information Gain') {
      this.solverType = ['classical']
    }
    else {
      this.solverType = ['classical', 'quantum', 'both']
    }
  }

  public OptimizationForm: any = this.fb.group({
    portfoliotype: new FormControl('Asset Classes', Validators.required),
    portfolioNameList: new FormControl('Default', Validators.required),
    tperiod: new FormControl('Year-to-Year', Validators.required),
    stimes: new FormControl('2015-02-02', Validators.required),
    etimes: new FormControl('2019-06-03', Validators.required),
    OptimizationStartegy: new FormControl('MPT', Validators.required),
    defaultOptimizationGoal: new FormControl('Minimize Risk', Validators.required),
    volatility: new FormControl('', Validators.required),
    correlations: new FormControl('', Validators.required),
    stockHoldings: new FormArray([], Validators.required),
    ComparedAllocation: new FormControl('', Validators.required),
    UseHistoricalReturns: new FormControl('', Validators.required),
    AssetConstraints: new FormControl('No', Validators.required),
    groupConstraints: new FormControl('No', Validators.required),
    excludeInvestorsView: new FormControl('Yes', Validators.required),
    minAssets: new FormControl(null, Validators.required),
    maxAssets: new FormControl(null,Validators.required),
    totalAssets: new FormControl('',Validators.required),
    Benchmark: new FormControl('NASDAQ-100', Validators.required),
    solverType: new FormControl('', Validators.required),
    benchmarks: new FormControl('', Validators.required),
    confidence: new FormControl(0.95, Validators.required), // dont delete this
    riskAversionFactor: new FormControl(null, Validators.required), // dont delete this
    stable_lb_dict : new FormControl(null, Validators.required),
    stable_ub_dict : new FormControl(null, Validators.required),
    group_dict : new FormControl(null, Validators.required),
    group_lb_dict : new FormControl(null, Validators.required),
    group_ub_dict : new FormControl(null, Validators.required),
    mu : new FormControl(null, Validators.required),
    volatilities: new FormControl(null, Validators.required),
  });

  // initializeDefault(){
  //   this.OptimizationForm.get('OptimizationStartegy').patchValue('MPT')
  //   this.OptimizationForm.get('AssetConstraints').patchValue('No')
  //   this.OptimizationForm.get('groupConstraints').patchValue('No')
  // }


  get stockHoldings() {
    return this.form.controls["stockHoldings"] as FormArray;
    return this.form.controls["allocation"] as FormArray;

  }

  // get groupData() {
  //   return this.groupTableData.controls["groupData"] as FormArray;
  // }

  // to provide target values when a special optimization goal is selected
  specialGoals(event: any) {
    this.specialGoal = event.target.value
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
    this.stockHoldings.push(holdingForm);
  }
  deleteHolding(holdingIndex: number) {
    this.stockHoldings.removeAt(holdingIndex);
  }
  clickedArray($event) {
    this.clicked = true;
  }

  titleChanged() {
    this.autoPopulate.detectTitleChange = true;
  }

  updateStocksTable(event: any) {
    this.autoPopulate.optimizationTitle = event.target.value
    // this.autoPopulate.detectTitleChange = true

    for (let index = 0; index < this.autoPopulate.products.length; index++) {
      if (this.autoPopulate.products[index].portfolioName == this.autoPopulate.optimizationTitle) {
        this.autoPopulate.optimizationTitle = this.autoPopulate.products[index].portfolioName
        this.autoPopulate.stockTableData = this.autoPopulate.products[index]['stock_data']

      }
    }

    this.form=this.fb.group({
      investment_amount: ['',Validators.required],
      // tenure: ['',Validators.required],
      stockHoldings: this.fb.array([])
    });
    if (this.autoPopulate.stockTableData.length>0){
    for (let i = 0; i < this.autoPopulate.stockTableData.length; i++) {
      // console.log('This is the length of the stock table data')
      // console.log(this.autoPopulate.stockTableData.length)
      const holdingForm = this.fb.group({
        stockTicker: this.autoPopulate.stockTableData[i]['stockTicker'],
        allocation: this.autoPopulate.stockTableData[i]['allocation'],
        expectedReturn: [''],
        expectedVolatility: [''],
        lb: [''],
        ub: [''],
        group: ['']
      })
      this.stockHoldings.push(holdingForm);
    }
  }
  }
  tabIndexChanged(index: number) {
    this.tabIndex = index
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
    let stock = this.stockHoldings.value[i].stockTicker;
    let allocation = this.stockHoldings.value[i].allocation;
    if (stock) {
      this.stockList = this.searchFromTickers(this.autoPopulate.companyNames, stock);
    }
  }



  investorsViewFunction(event) {
    this.OptimizationForm.get('excludeInvestorsView').patchValue(event.target.value);
  }

  // calculatePrice(i) {
  //   const a = this.stockHoldings.value[i].CurrentPrice * this.stockHoldings.value[i].Volume;
  //   this.stockHoldings.at(i).get('Amount').patchValue(a);
  // }

  addStock(index: number, event: any) {
    // var data = this.holdingdata.getStockPrice()

    console.log(event);
    const inputString = event.target.value;
    const reducedString = inputString.slice(0, 3);
    const current_asset: Stock = {};
    current_asset.name = inputString;
    current_asset.code = inputString;
    this.selected_stocks.push(current_asset)
    console.log(this.selectedTickers.length);
    // let i = data.Date.indexOf('2020-06-01');
    // this.stockHoldings.at(index).get('CurrentPrice').patchValue(Number(data[selectedTicker][i]).toFixed(2))
  }

  /*CalculateLeftAmount(investment_amount) {
    var amount = 0
    for (var i = 0; i < this.stockHoldings?.value.length; i++) {
      amount = amount + this.stockHoldings?.value[i].Amount;
      this.leftAmount = investment_amount - amount
    }
  }*/

  Tperiod(event: any) {
    console.log(event.target.value)
    this.OptimizationForm.get('tperiod').patchValue(event.target.value);
  }
  Portfoliotype(event: any) {
    console.log(event.target.value)
    this.OptimizationForm.get('portfoliotype').patchValue(event.target.value);
  }

  datesValidation(dateType:string) {
    const startDate = new Date(this.OptimizationForm.get('stimes').value)
    const endDate = new Date(this.OptimizationForm.get('etimes').value)
    const logic = {
      'start' : [true, false],
      'end' : [false,true]
    }
    if (endDate < startDate){
      const errorLogic = logic[dateType]
      this.startDateError = errorLogic[0]
      this.endDateError = errorLogic[1]
    }
    else {
      this.startDateError = false
      this.endDateError = false
    }

  }

  Stimes(event: any) {
    console.log(event.target.value)
    this.OptimizationForm.get('stimes').patchValue(event.target.value);
    this.datesValidation('start')
  }

  Etimes(event: any) {
    console.log(event.target.value)
    this.OptimizationForm.get('etimes').patchValue(event.target.value);
    this.datesValidation('end')
  }

  OPtimizationStrategy(event: any) {
    console.log('OP',event.target.value)
    this.isChecked = false
    let value = event.target.value
    this.defaultOptimizationGoal = this.optimizationGoal[value]
    // change name for index tracking strategies
    if (this.indexTrackingArray.includes(value)) {
      value = this.indexTrackingObject[event.target.value]
    }
    // no asset constraints or group constraints for HRP & Investor's Views
    if (value=='HRP' || value=='Investor`s View'){
      this.OptimizationForm.get('groupConstraints').patchValue('No');
      this.OptimizationForm.get('AssetConstraints').patchValue('No');
      for (var i = 0; i < this.form.controls.stockHoldings.value.length; i++) {
        this.form.controls.stockHoldings.value[i]['group'] = ''
        this.form.controls.stockHoldings.value[i]['lb'] = ''
        this.form.controls.stockHoldings.value[i]['ub'] = ''
      }
      this.groupTableData = []
    }
    // changing Efficiet Frontier Graph Labels for Index Traxcking Strategy
    if (value==='TE' || value==='L2'){
      this.optimizeBackend.efHAxis.next('Tracking Error')
      this.optimizeBackend.efVAxis.next('Mean Active Return')
    }
    // Keeping default Efficient Frontier Graph Labels otherwise
    else {
      console.log('else is working')
      this.optimizeBackend.efHAxis.next('Risk')
      this.optimizeBackend.efVAxis.next('Returns')
    }
    this.OptimizationForm.get('OptimizationStartegy').patchValue(value);
  }

  OPtimizationGoal(event: any) {
    console.log(event.target.value)
    let value = event.target.value
    if (value == 'Target Mean Active Return') {
      value = 'Target Returns'
    }
    this.OptimizationForm.get('defaultOptimizationGoal').patchValue(value);
    this.targetReturn = null
    this.targetRisk = null
  }

  benchmarkFunction(event:any){
    console.log(event.target.value)
    this.OptimizationForm.get('Benchmark').patchValue(event.target.value.split(' ')[1]);
  }

  useVolatility(event: any) {

    this.excludeVolatility = !this.excludeVolatility
  }

  useCorrelations(event: any) {
    this.excludeCorrelations = !this.excludeCorrelations
  }

  Compared_Allocation(event: any) {
    console.log(event.target.value)
    this.OptimizationForm.get('ComparedAllocation').patchValue(event.target.value);
  }
  Use_HistoricalReturns(event: any) {
    console.log(event.target.value)
    this.OptimizationForm.get('UseHistoricalReturns').patchValue(event.target.value);
  }
  Asset_Constraints(event: any) {
    console.log(event.target.value)
    this.OptimizationForm.get('AssetConstraints').patchValue(event.target.value);
  }
  Group_Constraints(event: any) {
    let eventValue = event.target.value
    if (eventValue == 'Yes') {
      this.scroll = true
      this.showTable = true
      this.OptimizationForm.get('groupConstraints').patchValue(eventValue);
      // if the selection was done previously, auto populate groups table data
      if (this.form.controls.stockHoldings.value[0]['group']!==''){
        let groupNames = []
        for (var i = 0; i < this.form.controls.stockHoldings.value.length; i++) {
          groupNames.push(this.form.controls.stockHoldings.value[i]['group'])
        }
        let groupNamesSet = new Set(groupNames)
        groupNamesSet.forEach(groupName => {
          if (groupName!==''){
            this.groupTableData.push({ name: groupName, lb: '0', ub: '100' })
          }})
      }
    }
    else if (eventValue == 'No') {
      this.groupTableData = []
      this.trackGroupArray = []
      this.OptimizationForm.get('groupConstraints').patchValue(eventValue);
    }
    else {
      console.log(this.form.controls.stockHoldings.value)
      this.groupTableData = []
      let groupNames = []
      // get selected group names
      for (var i = 0; i < this.form.controls.stockHoldings.value.length; i++) {
        groupNames.push(this.form.controls.stockHoldings.value[i]['group'])
      }
      let groupNamesSet = new Set(groupNames)
      // push data into the group constraints table
      groupNamesSet.forEach(groupName => {
        if (groupName!==''){
          this.groupTableData.push({ name: groupName, lb: '0', ub: '100' })
        }
      })
    }

  }
  assetsValidation(assetType:string, assetValue:any){
    const logic = {
      'min' : [true, false],
      'max' : [false,true]
    }
    if (assetValue > this.selected_stocks.length){
      const errorLogic = logic[assetType]
      this.minAssetsError = errorLogic[0]
      this.maxAssetsError = errorLogic[1]
    }
    else {
      this.minAssetsError = false
      this.maxAssetsError = false
    }
  }
  MinAssets(event: any) {
    let value = event.target.value
    this.OptimizationForm.get('minAssets').patchValue(value);
    this.assetsValidation('min', value);
  }
  MaxAssets(event: any) {
    let value = event.target.value
    this.OptimizationForm.get('maxAssets').patchValue(value);
    this.assetsValidation('max',value)
  }

  TotalAssets(event: any) {
    console.log(event.target.value)
    if (event.target.value > 100 || event.target.value < 1) {
      alert('Please select total assets in the range 1 to 100')
    }
    this.OptimizationForm.get('minAssets').patchValue(null);
    this.OptimizationForm.get('maxAssets').patchValue(event.target.value);
  }

  chooseSolver(event: any) {
    this.OptimizationForm.get('solverType').patchValue(event.target.value)
    this.autoPopulate.backend.next(event.target.value)
    if (event.target.value == 'both') {
      this.autoPopulate.addMargin.next(true)
    }
    else {
      this.autoPopulate.addMargin.next(false)
    }
  }

  BEnchmark(event: any) {
    this.OptimizationForm.get('Benchmark').patchValue(event.target.value);
  }
  onSubmit() {
    console.log(this.OptimizationForm.value)
  }
  savedData = null;

  changeName(event: any, i: any) {
    //this.selectedRow = row;
    this.groupTableData[i].name = event.target.value

  }

  changeUB(event: any, i: any) {
    //this.selectedRow = row;
    this.groupTableData[i].ub = event.target.value
  }

  changeLB(event: any, i: any) {
    //this.selectedRow = row;
    this.groupTableData[i].lb = event.target.value

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

  FormatData(tableData: any, keyString: string, flag: boolean = false) {
    const data = {}; // Create an empty object to store the reformatted data

    for (let i of tableData) {
      // Assuming "stockTicker" is a property in the object
      const stockTicker = i[keyString];


      // Create the nested object structure for each stockTicker
      data[stockTicker] = {
          allocation: i.allocation,
          lb: i.lb || null,
          ub: i.ub || null,
          group: i.group || null,
          expectedReturn: i.expectedReturn || null,
          expectedVolatility: i.expectedVolatility || null
      };
    }

    // Return the reformatted data
    return { "asset_data": data };
  }


  handleDynamicInput(numValue) {
    if (this.OptimizationForm.get('defaultOptimizationGoal').value == 'Risk Return'){
        this.lambdaValue = numValue
    }
    else if (this.OptimizationForm.get('defaultOptimizationGoal').value == 'Target Risk') {
      this.targetRisk = numValue
      this.targetReturn = null
    }
    else if (this.OptimizationForm.get('defaultOptimizationGoal').value == 'Target Returns') {
      this.targetRisk = null
      this.targetReturn = numValue
    }
  }

  setConfidence(event:any){
    this.betaValue = event.target.value
  }

  formatInvestorsView(oldInvestorsView){
    if (oldInvestorsView.length===0){
      return null
    }
    let investorsView = {}
    for (let i = 0; i < oldInvestorsView.length; i++){
        let outPerformingAssets = []
        let underPerformingAssets = []
        try {
          // convert tickers to company names to outperforming names
          for (let asset of oldInvestorsView[i]["outperforming_asset"]){
          outPerformingAssets.push(this.autoPopulate.nameObject[asset["name"]])
          }
        }
        catch(error) {
          // keep the outperforming asset list empty
        }
        try {
          for (let asset of oldInvestorsView[i]["underperforming_asset"]){
            underPerformingAssets.push(this.autoPopulate.nameObject[asset["name"]])
        }
        }
        catch(error) {
          // keep the underperforming asset list empty
        }
        investorsView[i] = {
            "outperforming_asset": outPerformingAssets,
            "underperforming_asset": underPerformingAssets,
            "by" : oldInvestorsView[i]["by"],
            "confidence" : oldInvestorsView[i]["confidence"]
      }
    }

    return investorsView
  }

  save() {
    this.loader.showLoader()
    this.savedData = this.OptimizationForm.values
    let backend = [this.autoPopulate.backend.value]
    if (this.OptimizationForm.get('minAssets').value == "") {
      this.OptimizationForm.get('minAssets').patchValue(null)
    }
    if (this.OptimizationForm.get('maxAssets').value == "") {
      this.OptimizationForm.get('maxAssets').patchValue(null)
    }
    if (this.autoPopulate.backend.value == "both") {
      backend = ["classical", "quantum"]

    }

    const assetData = this.FormatData(this.form.controls.stockHoldings.value,"stockTicker",true)
    // const groupData = this.formatData(this.groupTableData,"name")
    // const transactionLimitData = this.formatData(this.transactionLimitForm.controls.TransactionLimit.value,"Stocks",true)
    this.optimizeBackend.becnchmarkValue.next(this.benchmarkObject[this.OptimizationForm.get('Benchmark').value][1])
    this.optimizeBackend.metricsTableColumnsDisplay['index_health'] = this.optimizeBackend.becnchmarkValue.value
    this.handleDynamicInput(this.OptimizationForm.get('riskAversionFactor').value)
    // console.log('this is investors view')
    // console.log(this.optimize.controls.investors_views.value)
    // this.investorsView = this.formatInvestorsView(this.optimize.controls.investors_views.value)
    const payload = {
      "strategy" : this.OptimizationForm.get('OptimizationStartegy').value,
      "backends" : backend,
      "benchmark" : this.benchmarkObject[this.OptimizationForm.get('Benchmark').value][0],
      "asset_data" : assetData.asset_data,
      //"group_data" : groupData,
      "modelportfolio" :1,
      // "asset_data" : {

      //   "AAPL":{

      //   "allocation":0.1,

      //   "lb":null,

      //   "ub":null,

      //   "group":null
      //   }
      // },
      // "goal": this.OptimizationForm.get('defaultOptimizationGoal').value,
      //"lam" : this.lambdaValue,
      //"beta": this.OptimizationForm.get('confidence').value,
      // "mu": null,
      // "sigma": null,
      // "volatilities":null,
      "target_risk": this.targetRisk,
      "target_returns": this.targetReturn,
      //"min_assets": this.OptimizationForm.get('minAssets').value,
      //"max_assets": this.OptimizationForm.get('maxAssets').value,
      "stable_lb_dict": this.OptimizationForm.get('maxAssets').value,
      "stable_ub_dict": this.OptimizationForm.get('maxAssets').value,
      "group_dict" : this.OptimizationForm.get('maxAssets').value,
      "group_lb_dict" : this.OptimizationForm.get('maxAssets').value,
      "group_ub_dict": this.OptimizationForm.get('maxAssets').value,
      "mu": this.OptimizationForm.get('maxAssets').value,
      "volatilities": this.OptimizationForm.get('maxAssets').value,
      "start_date": this.OptimizationForm.get('stimes').value,
      "end_date": this.OptimizationForm.get('etimes').value,
      //"investors_views": this.investorsView,
      //"transaction_limit": this.transactionLimitValue,
      //"transactional_weights": transactionLimitData
    }

    // hit backend
    /// this.loader.showLoader();
    this.optimizationResults.optimiseAPI(payload).subscribe({
      next: (res) => {
        console.log('These are weights', res)

        let optimizedWeights = []
        let givenWeights = []
        let quantumOptimizedWeights = []

        // obtain given weights
        for (const [key, value] of Object.entries(res.weights.given)) {
          givenWeights.push([this.autoPopulate.tickerObject[key], value])
        }
        this.autoPopulate.givenWeightsData.next(givenWeights)

        if (this.excludeCorrelations===false && this.excludeVolatility===false && this.isChecked === false) {
        // update metrics table data
        this.optimizeBackend.metricsTable = res.health_metrics
        }

        else {
          this.resetMetricsTable()
        }


        // update selected assets
        this.optimizeBackend.givenAssets = Object.keys(Object.keys(res.efficient_frontier.random_weights)[0])

        // update the selected random weights for efficient frontier (table)
        this.optimizeBackend.randomWeights = res.efficient_frontier.random_weights

        // When Classical Backend is selected
        if (res.efficient_frontier.quantum.length == 0) {

          // obtain classiscal optimized weights
          for (let i of Object.keys(res.weights.classical_optimised)) {
            optimizedWeights.push([this.autoPopulate.tickerObject[i], Object.values(res.weights.classical_optimised[i])[0]])
          }
          this.autoPopulate.optimizedWeightsData.next(optimizedWeights)

          // delete quantum column
          this.optimizeBackend.metricsTableColumns = ['index_health', 'weights_provided_health', 'weights_classical_health']

          // update efficient frontier
          this.optimizeBackend.efOutput = res.efficient_frontier.random
          this.optimizeBackend.efOptimizedOutput = res.efficient_frontier.classical[0]
          let [a, b, c] = this.optimizeBackend.formatEfOutput(this.optimizeBackend.efOutput, this.optimizeBackend.efOptimizedOutput, this.optimizeBackend.efQuantumOptimizedOutput, 'classical')
          this.optimizeBackend.efOutput = a
          this.optimizeBackend.efOptimizedOutput = b

          if (this.excludeCorrelations===false && this.excludeVolatility===false && this.isChecked === false) {
              // update portfolio growth
              this.optimizeBackend.formatPgOutput(res.chart, 'classical')

              // update drawdown
              this.optimizeBackend.formatDdOutput(res.chart, 'classical')
          }
          else {

            this.resetPG('classical')
            this.resetDD('classical')
          }

        }
        // When Quantum backend is selected
        else if (res.efficient_frontier.classical.length == 0) {
          // populate quantum solution response
          for (let i of Object.keys(res.weights.quantum_optimised)) {
            quantumOptimizedWeights.push([this.autoPopulate.tickerObject[i], Object.values(res.weights.quantum_optimised[i])[0]])
          }
          this.autoPopulate.quantumOptimizedWeightsData.next(quantumOptimizedWeights)

          // delete classical column if chosen backend is quantum
          this.optimizeBackend.metricsTableColumns = ['index_health', 'weights_provided_health', 'weights_quantum_health']

          // update efficient frontier
          this.optimizeBackend.efOutput = res.efficient_frontier.random
          this.optimizeBackend.efOptimizedOutput = [0, 0]
          this.optimizeBackend.efQuantumOptimizedOutput = res.efficient_frontier.quantum[0]
          let [a, b, c] = this.optimizeBackend.formatEfOutput(this.optimizeBackend.efOutput, this.optimizeBackend.efOptimizedOutput, this.optimizeBackend.efQuantumOptimizedOutput, 'quantum')
          this.optimizeBackend.efOutput = a
          this.optimizeBackend.efOptimizedOutput = b
          this.optimizeBackend.efQuantumOptimizedOutput = c
          // delete classical optimized output
          //this.optimizeBackend.efOutput.splice(-2,1)

          if (this.excludeCorrelations===false && this.excludeVolatility===false && this.isChecked === false) {

          // update portfolio growth
          this.optimizeBackend.formatPgOutput(res.chart, 'quantum')

          // update drawdown
          this.optimizeBackend.formatDdOutput(res.chart, 'quantum')
          }
          else {

            this.resetPG('quantum')
            this.resetDD('quantum')
          }
        }

        // When both backends are selected
        else {
          this.optimizeBackend.metricsTableColumns = ['index_health', 'weights_provided_health', 'weights_classical_health', 'weights_quantum_health']
          // obtain classiscal optimized weights
          for (let i of Object.keys(res.weights.classical_optimised)) {
            optimizedWeights.push([this.autoPopulate.tickerObject[i], Object.values(res.weights.classical_optimised[i])[0]])
          }
          this.autoPopulate.optimizedWeightsData.next(optimizedWeights)

          // populate quantum solution response
          for (let i of Object.keys(res.weights.quantum_optimised)) {
            quantumOptimizedWeights.push([this.autoPopulate.tickerObject[i], Object.values(res.weights.quantum_optimised[i])[0]])
          }
          this.autoPopulate.quantumOptimizedWeightsData.next(quantumOptimizedWeights)


          // update efficient frontier
          this.optimizeBackend.efOutput = res.efficient_frontier.random
          this.optimizeBackend.efOptimizedOutput = res.efficient_frontier.classical[0]
          this.optimizeBackend.efQuantumOptimizedOutput = res.efficient_frontier.quantum[0]
          let [a, b, c] = this.optimizeBackend.formatEfOutput(this.optimizeBackend.efOutput, this.optimizeBackend.efOptimizedOutput, this.optimizeBackend.efQuantumOptimizedOutput, 'both')
          this.optimizeBackend.efOutput = a
          this.optimizeBackend.efOptimizedOutput = b
          this.optimizeBackend.efQuantumOptimizedOutput = c

          if (this.excludeCorrelations===false && this.excludeVolatility===false && this.isChecked === false) {

          // update portfolio growth
          this.optimizeBackend.formatPgOutput(res.chart, 'both', true)

          // update drawdown
          this.optimizeBackend.formatDdOutput(res.chart, 'both', true)
          }
          else {

            this.resetPG('both')
            this.resetDD('both')
          }
        }

        // update efficient frontier
        // update efficient frontier when chosen backend is quantum
        // this.optimizeBackend.efOutput = res.efficient_frontier.random
        // this.optimizeBackend.efOptimizedOutput = res.efficient_frontier.classical[0]
        // let [a, b, c] = this.optimizeBackend.formatEfOutput(this.optimizeBackend.efOutput,this.optimizeBackend.efOptimizedOutput,this.optimizeBackend.efQuantumOptimizedOutput,false)
        // this.optimizeBackend.efOutput = a
        // this.optimizeBackend.efOptimizedOutput = b
        // this.optimizeBackend.efQuantumOptimizedOutput = c
        // console.log('EF')
        // console.log(this.optimizeBackend.efOutput)
        // console.log(this.optimizeBackend.efOptimizedOutput)
        // slide the tab to results
        console.log('thease are classical and quantum opt weights ')
        console.log(this.autoPopulate.optimizedWeightsData.value)
        console.log(this.autoPopulate.quantumOptimizedWeightsData.value)
        this.loader.hideLoader()
        this.autoPopulate.weightsFlag.next(true);
        this.autoPopulate.efFlag.next(false);
        this.autoPopulate.pgFlag.next(false);
        this.autoPopulate.mtFlag.next(false);
        this.autoPopulate.ddFlag.next(false);
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

  resetMetricsTable(){
    this.optimizeBackend.metricsTable = {'index_health': {'Active Return %': 'undefined',
    'Tracking Error %': 'undefined',
    'Information Ratio': 'undefined',
    'Annualized Return %': 'undefined',
    'CAGR %': 'undefined',
    'Cvar %': 'undefined',
    'Sortino Ratio %': 'undefined',
    'Beta': 'undefined',
    'Treynor Ratio %': 'undefined',
    'Jensons Ratio %': 'undefined',
    'Var %': 'undefined',
    'max_drawdown': 'undefined'},
    'weights_provided_health': {'Active Return %': 'undefined',
    'Tracking Error %': 'undefined',
    'Information Ratio': 'undefined',
    'Annualized Return %': 'undefined',
    'CAGR %': 'undefined',
    'Cvar %' : 'undefined',
    'Sortino Ratio %': 'undefined',
    'Beta': 'undefined',
    'Treynor Ratio %': 'undefined',
    'Jensons Ratio %':  'undefined',
    'Var %': 'undefined',
    'max_drawdown':'undefined'},
   'weights_classical_health': {'Active Return %': 'undefined',
    'Tracking Error %': 'undefined',
    'Information Ratio':'undefined',
    'Annualized Return %': 'undefined',
    'CAGR %': 'undefined',
    'Cvar %': 'undefined',
    'Sortino Ratio %': 'undefined',
    'Beta': 'undefined',
    'Treynor Ratio %': 'undefined',
    'Jensons Ratio %': 'undefined',
    'Var %': 'undefined',
    'max_drawdown':'undefined'},
    'weights_quantum_health': {'Active Return %': 'undefined',
    'Tracking Error %': 'undefined',
    'Information Ratio':'undefined',
    'Annualized Return %': 'undefined',
    'CAGR %': 'undefined',
    'Cvar %': 'undefined',
    'Sortino Ratio %': 'undefined',
    'Beta': 'undefined',
    'Treynor Ratio %': 'undefined',
    'Jensons Ratio %': 'undefined',
    'Var %':'undefined',
    'max_drawdown':'undefined'}}
  }

  resetPG(backend:string){
    this.optimizeBackend.pgChartColumns = this.resetPg[backend][0]
    this.optimizeBackend.portfolioGrowthChartData = this.resetPg[backend][1]
  }

  resetDD(backend:string){
    this.optimizeBackend.ddChartColumns = this.resetDd[backend][0]
    this.optimizeBackend.ddChartData = this.resetDd[backend][1]
  }

  toggle() {
    this.excludeCorrelations = false
    this.excludeVolatility = false
    this.isChecked = !this.isChecked
  }


  // For Investor's View
  optimize: any = this.fb.group({
    'backend': new FormControl('classical', Validators.required),
    'targetSolution': new FormControl('Risk Returns', Validators.required),
    'lambdaInput': new FormControl(0, Validators.required),
    'targetRiskInput': new FormControl(0, Validators.required),
    'targetReturnsInput': new FormControl(0, Validators.required),
    'strategy': new FormControl('MPT', Validators.required),
    'cardinality': new FormControl(1, Validators.required),
    'investors_views': this.fb.array([]),
    'backTesting': this.fb.group({
      'start_time': ['2015-01-02', Validators.required],
      'end_time': ['2020-06-01', Validators.required]
    }),
  })

  addHoldingIV() {
    const holdingForm = this.fb.group({
      'outperforming_asset': new FormControl<Stock | null>(null),
      'underperforming_asset': new FormControl<Stock | null>(null),
      'by': new FormControl(0, Validators.required),
      'confidence': new FormControl(0, Validators.required)
    })
    this.optimize.controls["investors_views"].push(holdingForm)
  }
  get investorsViews() {
    return this.optimize.controls["investors_views"] as FormArray;
  }
  deleteHoldingIV(holdingIndex: number) {
    this.investorsViews.removeAt(holdingIndex);
  }


  // toggle for transaction limit
  toggleTL() {
    this.takeTransactionLimit = !this.takeTransactionLimit
    // this.addHoldingTL();
  }

  updateTransactionLimit(event) {
    this.transactionLimitValue = event.target.value
  }

  clickedArrayTL($event) {
    this.clickedTL = true;
  }

  get TransactionLimit() {
    return this.transactionLimitForm.controls["TransactionLimit"] as FormArray;
  }

  // For Transaction Limit Table
  addHoldingTL() {
    console.log("addd")
    const transactionLimit = this.fb.group({
      Stocks: [''],
      Weights: [''],
    })
    console.log(transactionLimit)
    this.TransactionLimit.push(transactionLimit);
    console.log(this.transactionLimitForm)
  }
  deleteHoldingTL(holdingIndex: number) {
    this.TransactionLimit.removeAt(holdingIndex);
  }

  autoCompleteTL(i, $event) {
    this.clicked = true;
    let stock = this.stockHoldings.value[i].Stocks;
    if (stock) {
      this.stockList = this.searchFromTickers(this.autoPopulate.companyNames, stock);
    }
  }
}

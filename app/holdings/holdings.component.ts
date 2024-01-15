import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HoldingDataService } from 'src/app/shared/services/holdingdata.service';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],

})

export class HoldingsComponent implements OnInit {

  form: any;
  clicked: boolean = false;
  stockList: any; //stockList for auto suggesting
  backtesting: any;
  leftAmount: Number;
  invalidInvestment: boolean;
  saveHoldingData = new SaveHoldingData();
  tickers = ['A', 'AAL', 'AAP', 'AAPL', 'ABC', 'ABMD', 'ABT', 'ACN', 'ADBE', 'ADI', 'ADM', 'ADP', 'ADSK', 'AEE', 'AEP', 'AES', 'AFL', 'AIG', 'AIZ', 'AJG', 'AKAM', 'ALB', 'ALGN', 'ALK', 'ALL', 'AMAT', 'AMD', 'AME', 'AMGN', 'AMP', 'AMT', 'AMZN', 'ANSS', 'ANTM', 'AON', 'AOS', 'APA', 'APD', 'APH', 'ARE', 'ATO', 'ATVI', 'AVB', 'AVGO', 'AVY', 'AWK', 'AXP', 'AZO', 'BA', 'BAC', 'BAX', 'BBWI', 'BBY', 'BDX', 'BEN', 'BF-B', 'BIIB', 'BIO', 'BK', 'BKNG', 'BKR', 'BLK', 'BMY', 'BR', 'BRK-B', 'BRO', 'BSX', 'BWA', 'BXP', 'C', 'CAG', 'CAH', 'CAT', 'CB', 'CBRE', 'CCI', 'CCL', 'CDNS', 'CE', 'CF', 'CHD', 'CHRW', 'CI', 'CINF', 'CL', 'CLX', 'CMA', 'CMCSA', 'CME', 'CMG', 'CMI', 'CMS', 'CNC', 'CNP', 'COF', 'COO', 'COP', 'COST', 'CPB', 'CPRT', 'CPT', 'CRL', 'CRM', 'CSCO', 'CSX', 'CTAS', 'CTRA', 'CTSH', 'CTXS', 'CVS', 'CVX', 'D', 'DAL', 'DD', 'DE', 'DFS', 'DG', 'DGX', 'DHI', 'DHR', 'DIS', 'DISH', 'DLR', 'DLTR', 'DOV', 'DPZ', 'DRE', 'DRI', 'DTE', 'DUK', 'DVA', 'DVN', 'DXC', 'DXCM', 'EA', 'EBAY', 'ECL', 'ED', 'EFX', 'EIX', 'EL', 'EMN', 'EMR', 'EOG', 'EQIX', 'EQR', 'ES', 'ESS', 'ETN', 'ETR', 'EVRG', 'EW', 'EXC', 'EXPD', 'EXPE', 'EXR', 'F', 'FAST', 'FCX', 'FDS', 'FDX', 'FE', 'FFIV', 'FIS', 'FISV', 'FITB', 'FMC', 'FRT', 'FTNT', 'GD', 'GE', 'GILD', 'GIS', 'GL', 'GLW', 'GOOG', 'GOOGL', 'GPC', 'GPN', 'GRMN', 'GS', 'GWW', 'HAL', 'HAS', 'HBAN', 'HD', 'HES', 'HIG', 'HOLX', 'HON', 'HPQ', 'HRL', 'HSIC', 'HST', 'HSY', 'HUM', 'IBM', 'ICE', 'IDXX', 'IEX', 'IFF', 'ILMN', 'INCY', 'INTC', 'INTU', 'IP', 'IPG', 'IPGP', 'IRM', 'ISRG', 'IT', 'ITW', 'IVZ', 'J', 'JBHT', 'JCI', 'JKHY', 'JNJ', 'JNPR', 'JPM', 'K', 'KEY', 'KIM', 'KLAC', 'KMB', 'KMX', 'KO', 'KR', 'L', 'LDOS', 'LEN', 'LH', 'LHX', 'LIN', 'LKQ', 'LLY', 'LMT', 'LNC', 'LNT', 'LOW', 'LRCX', 'LUMN', 'LUV', 'LVS', 'LYV', 'MA', 'MAA', 'MAR', 'MAS', 'MCD', 'MCHP', 'MCK', 'MCO', 'MDLZ', 'MDT', 'MET', 'MGM', 'MHK', 'MKC', 'MKTX', 'MLM', 'MMC', 'MMM', 'MNST', 'MO', 'MOH', 'MOS', 'MPWR', 'MRK', 'MRO', 'MS', 'MSCI', 'MSFT', 'MSI', 'MTB', 'MTCH', 'MTD', 'MU', 'NDAQ', 'NDSN', 'NEE', 'NEM', 'NFLX', 'NI', 'NKE', 'NLOK', 'NOC', 'NRG', 'NSC', 'NTAP', 'NTRS', 'NUE', 'NVDA', 'NVR', 'NWL', 'O', 'ODFL', 'OKE', 'OMC', 'ORCL', 'ORLY', 'OXY', 'PARA', 'PAYX', 'PCAR', 'PEAK', 'PEG', 'PENN', 'PEP', 'PFE', 'PFG', 'PG', 'PGR', 'PH', 'PHM', 'PKG', 'PKI', 'PLD', 'PM', 'PNC', 'PNR', 'PNW', 'POOL', 'PPG', 'PPL', 'PRU', 'PSA', 'PTC', 'PVH', 'PWR', 'PXD', 'QCOM', 'RCL', 'RE', 'REG', 'REGN', 'RF', 'RHI', 'RJF', 'RL', 'RMD', 'ROK', 'ROL', 'ROP', 'ROST', 'RSG', 'RTX', 'SBAC', 'SBNY', 'SBUX', 'SCHW', 'SEE', 'SHW', 'SIVB', 'SJM', 'SLB', 'SNA', 'SNPS', 'SO', 'SPG', 'SPGI', 'SRE', 'STE', 'STT', 'STX', 'STZ', 'SWK', 'SWKS', 'SYK', 'SYY', 'T', 'TAP', 'TDG', 'TDY', 'TECH', 'TEL', 'TER', 'TFC', 'TFX', 'TGT', 'TJX', 'TMO', 'TMUS', 'TPR', 'TRMB', 'TROW', 'TRV', 'TSCO', 'TSN', 'TT', 'TTWO', 'TXN', 'TXT', 'TYL', 'UAA', 'UAL', 'UDR', 'UHS', 'ULTA', 'UNH', 'UNP', 'UPS', 'URI', 'USB', 'V', 'VFC', 'VLO', 'VMC', 'VNO', 'VRSK', 'VRSN', 'VRTX', 'VTR', 'VTRS', 'VZ', 'WAB', 'WAT', 'WBA', 'WBD', 'WDC', 'WEC', 'WELL', 'WFC', 'WHR', 'WM', 'WMB', 'WMT', 'WRB', 'WST', 'WTW', 'WY', 'WYNN', 'XEL', 'XOM', 'XRAY', 'YUM', 'ZBH', 'ZBRA', 'ZION'];

  ngOnInit() {
    this.form = this.fb.group({
      investment_amount: ['', Validators.required],
      tenure: [''],
      start_date: new FormControl('2015-01-02'),
      end_date: new FormControl('2020-06-01'),
      stockHoldings: this.fb.array([])
    });
    this.holdingdata.setChart('scratch');
    this.holdingdata.getStockPrice();//fetches twelve_year.json from assets using http(TODO:use direct import)
    this.addHolding();
    this.stockList = this.tickers;
    this.backtesting = this.fb.group({
      start_time: new FormControl('2015-01-02', Validators.required),
      end_time: new FormControl('2020-06-01', Validators.required)
    })
  
  }

  constructor(private fb: FormBuilder, private toastr: ToastrService, private holdingdata: HoldingDataService, private router: Router) { }

  get stockHoldings() {
    return this.form.controls["stockHoldings"] as FormArray;
  }

  addHolding() {
    const holdingForm = this.fb.group({
      StockTicker: [''],
      CurrentPrice: [''],
      Volume: [''],
      Amount: ['']
    })
    this.stockHoldings.push(holdingForm);
  }

  deleteHolding(holdingIndex: number) {
    this.stockHoldings.removeAt(holdingIndex);

  }

  investment_amount() {
    if (this.form.controls["investment_amount"].value < 0) {
      this.invalidInvestment = true
    }
    if (this.form.controls["investment_amount"].value >= 0) {
      this.invalidInvestment = false
    }
  }

  clickedArray($event) {
    this.clicked = true;
  }

  searchFromTickers(arr, regex) {
    let matches = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
      }
    }
    return matches
  }

  autoComplete(i, $event) {
    this.clicked = true;
    let stock = this.stockHoldings.value[i].StockTicker;
    if (stock) {
      this.stockList = this.searchFromTickers(this.tickers, stock);
    }
  }

  calculatePrice(i) {
    const a = this.stockHoldings.value[i].CurrentPrice * this.stockHoldings.value[i].Volume;
    this.stockHoldings.at(i).get('Amount').patchValue(a);
  }

  addStock(index, e) {
    var data = this.holdingdata.getStockPrice()
    let selectedTicker = e.target.value
    let i = data.Date.indexOf('2020-06-01');
    this.stockHoldings.at(index).get('CurrentPrice').patchValue(Number(data[selectedTicker][i]).toFixed(2))
  }

  CalculateLeftAmount(investment_amount) {
    var amount = 0
    for (var i = 0; i < this.stockHoldings?.value.length; i++) {
      amount = amount + this.stockHoldings?.value[i].Amount;
      this.leftAmount = investment_amount - amount
    }
  }

  async submitHolding(form): Promise<void> {
    
    try {
      this.saveHoldingData.stock_data = this.stockHoldings?.value;
      // this.saveHoldingData.tenure = form.controls["tenure"].value;
      this.saveHoldingData.tenure = 12;
      this.saveHoldingData.investment_amount = form.controls["investment_amount"].value;

      const user = sessionStorage.getItem('user_id');

      const result: any = await lastValueFrom(this.holdingdata.saveHolding(this.saveHoldingData));
      sessionStorage.setItem('portfolio_id', result.portfolio_id);
      this.holdingdata.setPortfolioId(result.portfolio_id);

      const portfolio_id = sessionStorage.getItem('portfolio_id');
      const req = {
        portfolio_id: portfolio_id,
        start_date: this.backtesting.get('start_time')?.value,
        end_date: this.backtesting.get('end_time')?.value,
      };

      const graphData: any = await lastValueFrom(this.holdingdata.graphDetails(req));
      this.holdingdata.setGraphData(graphData);
      console.log(this.holdingdata.getGraphData());

      this.holdingdata.setChart('scratch');
      //this.router.navigate(['/chart']);
    } catch (error) {
      console.log(error);
      // this.toastr.error('An error occurred: ' + error.error.message, 'Error', {
      //   closeButton: false,
      //   tapToDismiss:true,
      //   disableTimeOut:true,
      //   positionClass: 'toast-test-top-center'
      // });
    }
  }



}
class SaveHoldingData {
  investment_amount: Number;
  tenure: Number;
  stock_data: any;
  portfolio: Number;

}


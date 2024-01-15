import { Component } from '@angular/core';
import { BacktestBackendService } from 'src/app/shared/services/backtest-backend.service';

@Component({
  selector: 'app-backtest-portfolio',
  templateUrl: './backtest-portfolio.component.html',
  styleUrls: ['./backtest-portfolio.component.scss']
})
export class BacktestPortfolioComponent {
  options: any;
  width = 800
  height = 300
  columnNames = ['Date','Portfolio 1','Portfolio 2', 'NASDAQ']


  constructor(public backtestBackend: BacktestBackendService){
    this.options = {
      // titleTextStyle: {
      //   fontSize: 16,
      //   bold: true,
      //   textAlign: 'center'
      // },
      // titlePosition: 'center',
      hAxis: {
        title: 'Dates',
        titleTextStyle: {
          italic: false,
          fontSize: 12,
          fontName: 'Verdana'
        },
      },
      vAxis: {
        title: 'Portfolio Value',
        titleTextStyle: {
          fontSize: 12,
          italic: false,
          fontName: 'Verdana'
        },
            },
      legend: { position: 'top'},
    };
  }

}

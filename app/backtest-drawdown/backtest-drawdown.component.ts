import { Component } from '@angular/core';
import { BacktestBackendService } from 'src/app/shared/services/backtest-backend.service';

@Component({
  selector: 'app-backtest-drawdown',
  templateUrl: './backtest-drawdown.component.html',
  styleUrls: ['./backtest-drawdown.component.scss']
})
export class BacktestDrawdownComponent {

  options: any;
  width = 800
  height = 300
  columnNames = ['Date','Portfolio 1','Portfolio 2', 'NASDAQ']

  constructor(public backtestBackend:BacktestBackendService){}

}

import { Component } from '@angular/core';
import { BacktestBackendService } from 'src/app/shared/services/backtest-backend.service';

@Component({
  selector: 'app-backtest-metrics',
  templateUrl: './backtest-metrics.component.html',
  styleUrls: ['./backtest-metrics.component.scss']
})
export class BacktestMetricsComponent {

  constructor(public backtestBackend: BacktestBackendService){}

}

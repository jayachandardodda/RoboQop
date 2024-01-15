import { Component } from '@angular/core';
import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
import { BacktestBackendService } from 'src/app/shared/services/backtest-backend.service';
@Component({
  selector: 'app-backtest-weights',
  templateUrl: './backtest-weights.component.html',
  styleUrls: ['./backtest-weights.component.scss']
})
export class BacktestWeightsComponent {

  optimizedWeightsTitle = 'Classical Weights'
  givenWeightsTitle = 'Given Weights'
  myType = 'PieChart';
  width = 450;
  height = 400;
  columnNames = ['Asset', 'Weight'];
  options = {
    is3D: true
 };

 constructor(public backtestBackend: BacktestBackendService, public autoPopulate: AutoPopulateService){}

}

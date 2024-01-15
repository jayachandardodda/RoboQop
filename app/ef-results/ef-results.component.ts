import { Component } from '@angular/core';
import { OptimizationBackendService } from 'src/app/shared/services/optimization-backend.service';
import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
@Component({
  selector: 'app-ef-results',
  templateUrl: './ef-results.component.html',
  styleUrls: ['./ef-results.component.scss']
})
export class EfResultsComponent {

  constructor(public optimizeBackend:OptimizationBackendService, public autoPopulate:AutoPopulateService)
  {console.log('this is ef data',this.optimizeBackend.efOutput)}


  // chartData = [
  //   [1, 7, null],
  //   [2, 12, null],
  //   [3, 14, null],
  //   [4, 9, null],
  //   [2, null, 12]
  // ];

  chartOptions = {
    seriesType: 'line',
    series: { 1: { type: 'scatter' }, 2: { type: 'scatter' } },
    height: 400,
    width: 800,
    hAxis:{
      title: this.optimizeBackend.efHAxis.value,
      titleTextStyle: {
        italic: false,
        fontSize: 12,
        fontName: 'Verdana'
      },
    },
    vAxis: {
      title: this.optimizeBackend.efVAxis.value,
      titleTextStyle: {
        fontSize: 12,
        italic: false,
        fontName: 'Verdana'
      },
          },
    legend: { position: 'top' },
  };


}

import { Component } from '@angular/core';
import { OptimizationBackendService } from 'src/app/shared/services/optimization-backend.service';

@Component({
  selector: 'app-portfolio-growth-results',
  templateUrl: './portfolio-growth-results.component.html',
  styleUrls: ['./portfolio-growth-results.component.scss']
})
export class PortfolioGrowthResultsComponent {


  options: any;
  width = 800
  height = 300
  columnNames = ['X','Portfolio Value','Classical Optimized Portfolio Value', 'Quantum Optimized Portfolio Value']
  constructor(public optimizeBackend:OptimizationBackendService) {


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

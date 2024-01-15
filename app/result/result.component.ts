import { AutoPopulateService } from './../../../shared/services/auto-populate.service';
import { Component} from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  menuItems: MenuItem[];

  // Chart Configurations
  optimizedWeightsTitle = 'Classical Weights'
  givenWeightsTitle = 'Given Weights'
  myType = 'PieChart';
  width = 450;
  height = 400;
  columnNames = ['Asset', 'Weight'];
  options = {
    is3D: true
 };

  constructor(public autoPopulate:AutoPopulateService) {
    // this.menuItems = [
    //   {
    //     label: 'Weights',
    //     icon: 'pi pi-fw pi-bars',
    //     routerLink: ['optimization/weights']
    //   },
    //   {
    //     label: 'Efficient Frontier',
    //     icon: 'pi pi-fw pi-chart-bar',
    //     routerLink: ['/efficient-frontier']
    //   },
    //   {
    //     label: 'Portfolio Growth',
    //     icon: 'pi pi-fw pi-chart-line',
    //     routerLink: ['/portfolio-growth']
    //   },
    //   {
    //     label: 'Metric Tables',
    //     icon: 'pi pi-fw pi-table',
    //     routerLink: ['/metric-tables']
    //   }
    // ];
  }
}


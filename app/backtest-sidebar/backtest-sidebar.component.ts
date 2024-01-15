import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EfResultsComponent } from '../ef-results/ef-results.component';

@Component({
  selector: 'app-backtest-sidebar',
  templateUrl: './backtest-sidebar.component.html',
  styleUrls: ['./backtest-sidebar.component.scss']
})
export class BacktestSidebarComponent {
  items: MenuItem[];
  constructor(public autoPopulate:AutoPopulateService){

  this.items = [
    {
      label: 'Weights',
      icon: 'pi pi-fw pi-bars',
      // routerLink: ['results'],
    },
    {
      label: 'Portfolio Growth',
      icon: 'pi pi-fw pi-chart-line',
      // routerLink: ['pgresults']
    },
    {
      label: 'Draw Down',
      icon: 'pi pi-fw pi-chart-line',
      // routerLink: ['dd']
    },
    {
      label: 'Metric Tables',
      icon: 'pi pi-fw pi-table',
      // routerLink: ['metricstable']
    }
  ];
  }
  navigateToBtResults(event:any) {
    if (event.target.innerText=="Portfolio Growth"){
      this.autoPopulate.btPgFlag.next(true);
      this.autoPopulate.btMtFlag.next(false);
      this.autoPopulate.btDdFlag.next(false);
      this.autoPopulate.btweightsFlag.next(false)
    }
    else if (event.target.innerText=="Metric Tables"){
      this.autoPopulate.btPgFlag.next(false);
      this.autoPopulate.btMtFlag.next(true);
      this.autoPopulate.btDdFlag.next(false);
      this.autoPopulate.btweightsFlag.next(false)
    }
    else if (event.target.innerText=="Draw Down"){
      this.autoPopulate.btPgFlag.next(false);
      this.autoPopulate.btMtFlag.next(false);
      this.autoPopulate.btDdFlag.next(true);
      this.autoPopulate.btweightsFlag.next(false)
    }
    else if (event.target.innerText=="Weights"){
      this.autoPopulate.btPgFlag.next(false);
      this.autoPopulate.btMtFlag.next(false);
      this.autoPopulate.btDdFlag.next(false);
      this.autoPopulate.btweightsFlag.next(true)
    }
  //this.router.navigate([{ outlets: { EfResultsComponent: 'efresults' } }]);
}

}

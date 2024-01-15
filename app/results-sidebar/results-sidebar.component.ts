import { AutoPopulateService } from 'src/app/shared/services/auto-populate.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EfResultsComponent } from '../ef-results/ef-results.component';

@Component({
  selector: 'app-results-sidebar',
  templateUrl: './results-sidebar.component.html',
  styleUrls: ['./results-sidebar.component.scss']
})
export class ResultsSidebarComponent {
  weightsFlag:boolean = true
  items: MenuItem[];
  constructor(private router:Router, private autoPopulate:AutoPopulateService){

    this.items = [
      {
        label: 'Weights',
        icon: 'pi pi-fw pi-bars',
        // routerLink: ['results'],
      },
      {
        label: 'Efficient Frontier',
        icon: 'pi pi-fw pi-chart-bar',
        // routerLink: ["efresults"],
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
  navigateToEfResults(event:any) {
    if (event.target.innerText=="Weights"){
      this.autoPopulate.weightsFlag.next(true);
      this.autoPopulate.efFlag.next(false);
      this.autoPopulate.pgFlag.next(false);
      this.autoPopulate.mtFlag.next(false);
      this.autoPopulate.ddFlag.next(false);
    }
    else if (event.target.innerText=="Efficient Frontier"){
      this.autoPopulate.weightsFlag.next(false);
      this.autoPopulate.efFlag.next(true);
      this.autoPopulate.pgFlag.next(false);
      this.autoPopulate.mtFlag.next(false);
      this.autoPopulate.ddFlag.next(false);
    }
    else if (event.target.innerText=="Portfolio Growth"){
      this.autoPopulate.weightsFlag.next(false);
      this.autoPopulate.efFlag.next(false);
      this.autoPopulate.pgFlag.next(true);
      this.autoPopulate.mtFlag.next(false);
      this.autoPopulate.ddFlag.next(false);
    }
    else if (event.target.innerText=="Metric Tables"){
      this.autoPopulate.weightsFlag.next(false);
      this.autoPopulate.efFlag.next(false);
      this.autoPopulate.pgFlag.next(false);
      this.autoPopulate.mtFlag.next(true);
      this.autoPopulate.ddFlag.next(false);
    }
    else if (event.target.innerText=="Draw Down"){
      this.autoPopulate.weightsFlag.next(false);
      this.autoPopulate.efFlag.next(false);
      this.autoPopulate.pgFlag.next(false);
      this.autoPopulate.mtFlag.next(false);
      this.autoPopulate.ddFlag.next(true);
    }
    //this.router.navigate([{ outlets: { EfResultsComponent: 'efresults' } }]);
  }
}

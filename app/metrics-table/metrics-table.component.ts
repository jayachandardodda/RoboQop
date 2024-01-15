import { OptimizationBackendService } from 'src/app/shared/services/optimization-backend.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-metrics-table',
  templateUrl: './metrics-table.component.html',
  styleUrls: ['./metrics-table.component.scss']
})
export class MetricsTableComponent {
constructor(public optimizeBackend:OptimizationBackendService){}
}

import { Component, OnInit } from '@angular/core';
import { HoldingDataService } from 'src/app/shared/services/holdingdata.service';
@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit{
  
  ngOnInit(): void {
    
  }
  constructor(private holdingService: HoldingDataService) { }
  clicked(data: string) {
    this.holdingService.setOptimize(data);
    console.log(data);
  }
}

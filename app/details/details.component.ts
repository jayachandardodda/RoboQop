import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DetailsService } from 'src/app/shared/services/details.service';
import { HoldingDataService } from 'src/app/shared/services/holdingdata.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent {

  selectedButton = 'details'
  signal: any;
  chartData: any
  signalTableFields = [
    { field: 'date', header: 'Date' },
    { field: 'stock', header: 'Stock' },
    { field: 'current_price', header: 'Current Price($)' },
    { field: 'signal', header: 'Signal' },
    { field: 'volume', header: 'Volume' },
    { field: 'order_price', header: 'Order Price($)' }
  ];

  holding: any;
  holdingsData: any[] = [];
  holdingDetailsFields: any[] = [];
  indexData: any;
  index: any;
  indexClick: any;
  indexList = ['gspc'];
  selectedOptions: any[] = [];


  constructor(private http: HttpClient, private detail: DetailsService, private holdingService: HoldingDataService) { }

  details() {
    this.selectedButton = 'details'
  }
  signals() {
    this.selectedButton = 'signals'
  }

  onOptionSelected(option) {
    if (!this.selectedOptions.includes(option)) {
      this.applyIndex(option)

    }
  }


  applyIndex(index: string) {

    console.log(index)
    var portfolio_id = sessionStorage.getItem('portfolio_id')
    var req = {
      index: index,
      start_date: "2015-01-02",
      end_date: "2020-06-01",
      portfolio_id: portfolio_id
    }
    this.holdingService.indexGraphDetails(req).subscribe({
      next: (response: any) => {
        this.indexData = response;
        for (var i = 0; i < this.indexData.length; i++) {
          this.indexData[i].splice(0, 1, new Date(this.indexData[i][0]))
          this.indexData[i][1] = Number(parseFloat(this.indexData[i][1]).toFixed(2));
        }

      },
      error: (error) => {
        console.log(error)
      },

      complete: () => {
        var graphData = this.holdingService.getGraphData().graph;

        for (var i = 0; i < graphData.length; i++) {
          graphData[i].splice(0, 1, new Date(graphData[i][0]));
          graphData[i][1] = Number(parseFloat(graphData[i][1]).toFixed(2));
        }

        console.log("indexData", this.indexData);
        console.log("graphData", graphData)
        const map = new Map(this.indexData.map(([a, b]) => [a.getTime(), b]));
        const result = graphData.map(([a, x]) => [a, x, map.get(a.getTime())])
        console.log(result)

        this.chartData = {
          title: 'Line Chart',
          type: 'LineChart',
          data: result,
          columnNames: ["Date", "Amount", index],
          options: {
            hAxis: {
              format: 'MMM-yyyy'
              // title: 'Amount'
            },
            vAxis: {
              format: '#,#####.##'
            },

          },
          width: 1100,
          height: 500,

        };
        console.log(this.selectedOptions)
        this.selectedOptions.push(index);
      }
    })
  }


  removeIndex(index) {

    var graphData = this.holdingService.getGraphData().graph;

    // Date Format
    for (var i = 0; i < graphData.length; i++) {
      graphData[i].splice(0, 1, new Date(graphData[i][0]));
      graphData[i][1] = Number(parseFloat(graphData[i][1]).toFixed(2));
    }

    //LineChart
    this.chartData = {
      title: 'Line Chart',
      type: 'LineChart',
      data: graphData,
      columnNames: ["Date", "Amount"],
      options: {
        hAxis: {
          format: 'MMM-yyyy'
          // title: 'Amount'
        },
        vAxis: {
          format: '#,#####.##'
        },

      },
    };
    var temp = this.selectedOptions.indexOf(index)
    console.log(temp)
    this.selectedOptions.splice(temp, 1)
  }

  ngOnInit() {

    // TODO: what graph to show ..?
    var graphData = this.holdingService.getGraphData().graph;

    // Date Format
    for (var i = 0; i < graphData.length; i++) {
      graphData[i].splice(0, 1, new Date(graphData[i][0]));
      graphData[i][1] = Number(parseFloat(graphData[i][1]).toFixed(2));

    }

    //LineChart
    this.chartData = {
      title: 'Line Chart',
      type: 'LineChart',
      data: graphData,
      columnNames: ["Date", "Amount"],
      options: {
        hAxis: {
          format: 'MMM-yyyy'
          // title: 'Amount'
        },
        vAxis: {
          format: '#,#####.##'
        },
      },
      width: 1100,
      height: 500,
    };

    this.detail.getHolding().subscribe({
      next: (data) => {
        this.holdingsData = data.data_list;
        this.holding = data;
        for (var i = 0; i < this.holdingsData.length; i++) {
          this.holdingsData[i].investment_amount = this.holdingsData[i].investment_amount.toString().slice(0, 8)
        }
      },
      error: (error) => {
        //console.log(error)
      },
      complete: () => {
        this.holdingDetailsFields = [
          { field: 'StockTicker', header: 'Tickers' },
          { field: 'CurrentPrice', header: ' Current Price($)' },
          { field: 'holding', header: 'Curent Holdings($)' },
          { field: 'investment_amount', header: 'Investment Amount($)' },
          { field: 'annual_returns', header: 'Annual Return(%)' },
          { field: 'annual_volatility', header: 'Annual Volatility(%)' }
        ];
      }
    });

    this.detail.getSignals().subscribe(data => {
      this.signal = data
    })
  }
}


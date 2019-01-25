import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartsService } from '../service/charts/charts.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(private _service: ChartsService) {}

    selected = 'custom';
    // data: {
    //     transactions: any,
    //     averageCarbPerUnit: any,
    //     minReading: any,
    //     maxReading: any,
    //     minTime: any,
    //     maxTime: any,
    //     minInsulinUnitsShort: any,
    //     maxInsulinUnitsShort: any,
    //     readingData: any,
    //     readingDataPointColors: any,
    //     hourlyIntervals: any,
    //     unitsData: any,
    //     carbPerUnitCount: any,
    //     carbPerUnitTotal: any
    // };

    chart: any;
    chart2: any;

    ngOnInit() {
      // this.data = this._service.getChartData('chart-1');
      let ctx = document.getElementById("canvas");
      let ctx2 = document.getElementById("canvas2");

      this.chart = new Chart(ctx, {
          type: 'line',
          options: {
              responsive: true,
              maintainAspectRatio: false,
              onResize: (instance, newSize) => console.log(newSize)
          },
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        }
    });
    this.chart.canvas.parentNode.style.height = '256px';
    this.chart.resize();

    this.chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onResize: (instance, newSize) => console.log(newSize),
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
        });
    }

}

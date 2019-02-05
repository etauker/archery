import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartsService } from '../service/charts/charts.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    readingData = [];
    readingDataPointColors = [];

    constructor(private charts: ChartsService) {

        let today = new Date();
        today.setDate(today.getDate() - 7);
        today.setHours(0);
        today.setMinutes(0);
        today.setMilliseconds(0);
        let start = today.valueOf();
        today.setDate(today.getDate() + 8);
        let end = today.valueOf();
        // console.log(start);
        // console.log(end);


        let subscription = charts.getChartData('chart-1', start, end).subscribe(
            (value: any) => {
                // console.log(value);
                this.readingData = value.readingData;
                this.readingDataPointColors = value.readingDataPointColors;
            },
            (error) => console.log(error),
            () => this.showCharts()
        )
    }

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

    ngOnInit() { }

    private showCharts() {
      // this.data = this.charts.getChartData('chart-1');
      let ctx = document.getElementById("canvas");
      let ctx2 = document.getElementById("canvas2");

      this.chart = new Chart(ctx, {
          type: 'line',
          options: {
              responsive: true,
              maintainAspectRatio: false,
              onResize: (instance, newSize) => console.log(newSize),
              scales: {
                  yAxes: [{
                      id: 'readings',
                      type: 'linear',
                      position: 'left',
                      scaleLabel: {
                          labelString: 'Readings',
                          display: true
                      },
                      ticks: {
                          suggestedMax: 20,
                          suggestedMin: 0,
                          stepSize: 4
                      }
                  }],
                  xAxes: [{
                      id: 'time',
                      type: 'time',
                      distribution: 'linear',
                      scaleLabel: {
                          labelString: 'Time',
                          display: true
                      },
                      time: {
                          unit: 'day',
                          stepSize: 1

                      }
                  }]
              },
              tooltips: {
                  callbacks: {
                      label: function(tooltipItem, data) {
                          var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                          let dataset = data.datasets[tooltipItem.datasetIndex];
                          let datapoint = dataset.data[tooltipItem.index];
                          let labelNote = datapoint.label || '';
                          let reading = datapoint.y;
                          let label = '';

                          if (reading) {
                              label = `Reading: ${reading}`
                          }
                          if (labelNote) {
                              label += `, Note: ${labelNote}`
                          }

                          return label;
                      }
                  }
              }
          },
          data: {
            // labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: 'Readings',
                yAxisID: 'readings',
                xAxisID: 'time',
                data: this.readingData,
                pointBackgroundColor: this.readingDataPointColors
            }]
            // datasets: [{
            //     label: "My First dataset",
            //     backgroundColor: 'rgb(255, 99, 132)',
            //     borderColor: 'rgb(255, 99, 132)',
            //     data: [0, 10, 5, 2, 20, 30, 45],
            // }]
        }


    });
    // this.charts.getChartData('chart-1');
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

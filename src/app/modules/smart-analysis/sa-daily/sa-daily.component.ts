import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import { TodoService } from '../../../services';

@Component({
  selector: 'app-sa-daily',
  template: `
  <div class="container-fluid todo-inbox">
    <div class="row">
      <div class="col-lg-6">
        <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div>
            <div>
              <div class="chart">
                <canvas baseChart
                  [data]="pieChartData"
                  [labels]="pieChartLabels"
                  [chartType]="pieChartType"
                  [options]="pieChartOptions"
                  [colors]="pieChartColors"
                  [legend]="pieChartLegend">
                </canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
  ]
})
export class SaDailyComponent implements OnInit {

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left'
    },
    plugins: {
      datalabels: {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        formatter: (_, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [{
    backgroundColor: []
  }
  ];
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.getTasksCount();
  }

  // public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //   console.log(event, active);
  // }

  private getTasksCount() {
    this.todoService.countByTodoType({
      filter: {
        isCompleted: true
      }
    })
      .subscribe((data)=>{
        delete data.completed;
        Object.keys(data).forEach(key=>{
          if(key === 'today') {
            this.pieChartColors[0].backgroundColor.push('#a09e9e');
          }else if(key === 'pending') {
            this.pieChartColors[0].backgroundColor.push('#fe517e');
          }else if(key === 'upcoming') {
            this.pieChartColors[0].backgroundColor.push('#65f9b3');
          }else if(key === 'inbox') {
            this.pieChartColors[0].backgroundColor.push('#ffbf43');
          }
          this.pieChartLabels.push(key);
          this.pieChartData.push(data[key]);
        });
      });
  }

}

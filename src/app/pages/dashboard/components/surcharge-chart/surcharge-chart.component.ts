import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-surcharge-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  template: `
    <div class="card bg-white p-4 rounded-lg shadow">
      <h5 class="text-lg font-bold mb-4">Surcharge Hospitalière par Heure</h5>
      <div style="height: 400px; width: 100%;">
        <ngx-charts-line-chart
          [view]="[1000, 350]"
          [scheme]="'cool'"
          [results]="data"
          [xAxis]="true"
          [yAxis]="true"
          [legend]="true"
          [showXAxisLabel]="true"
          [showYAxisLabel]="true"
          [xAxisLabel]="'Heure'"
          [yAxisLabel]="'Niveau de Surcharge'"
          [showGridLines]="true"
          [timeline]="false"
          [autoScale]="false"
          [yScaleMin]="0"
          [yScaleMax]="1">
        </ngx-charts-line-chart>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class SurchargeChartComponent {
  data = [
    {
      name: 'Niveau de surcharge',
      series: [
        { name: '0h', value: 0.2 },
        { name: '1h', value: 0.15 },
        { name: '2h', value: 0.2 },
        { name: '3h', value: 0.3 },
        { name: '4h', value: 0.2 },
        { name: '5h', value: 0.2 },
        { name: '6h', value: 0.4 },
        { name: '7h', value: 0.5 },
        { name: '8h', value: 0.6 },
        { name: '9h', value: 0.7 },
        { name: '10h', value: 0.8 },
        { name: '11h', value: 0.7 },
        { name: '12h', value: 0.6 },
        { name: '13h', value: 0.5 },
        { name: '14h', value: 0.4 },
        { name: '15h', value: 0.3 },
        { name: '16h', value: 0.5 },
        { name: '17h', value: 0.7 },
        { name: '18h', value: 0.8 },
        { name: '19h', value: 0.7 },
        { name: '20h', value: 0.5 },
        { name: '21h', value: 0.3 },
        { name: '22h', value: 0.2 },
        { name: '23h', value: 0.1 }
      ]
    }
  ];
}

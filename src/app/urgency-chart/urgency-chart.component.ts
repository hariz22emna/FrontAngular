import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-urgency-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './urgency-chart.component.html',
  styleUrls: ['./urgency-chart.component.scss']
})
export class UrgencyChartComponent {
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  public pieChartLabels = ['1', '2', '3', '4', '5'];
  public pieChartData = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [10, 20, 15, 15, 25], // <-- tes valeurs
        backgroundColor: ['#ECEFF1', '#BBDEFB', '#C8E6C9', '#FFE0B2', '#FFCDD2'], // ✅ correspondance exacte
        borderWidth: 1
      }
    ]
  };
}  

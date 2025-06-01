import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { PredictionService } from '../pages/service/prediction.service';
import { Prediction } from '../models/prediction';


@Component({
  selector: 'app-weekday-flow-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './weekday-flow-chart.component.html',
  styleUrls: ['./weekday-flow-chart.component.scss']
})
export class WeekdayFlowChartComponent implements OnInit {
  public barChartType: 'bar' = 'bar';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Nombre de prédictions',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#60A5FA',
        hoverBackgroundColor: '#3B82F6',
        borderRadius: 6,
        barPercentage: 0.6
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        ticks: { color: '#6B7280' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#6B7280' }
      }
    }
  };

  constructor(private predictionService: PredictionService) {}

  async ngOnInit() {
    const predictions = await this.predictionService.getPredictions();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const weekCounts: Record<string, number> = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    };

for (const p of predictions) {
  for (const day of days) {
    const field = `day_of_week_${day.toLowerCase()}` as keyof Prediction;

    if ((p as any)[field]) {
      weekCounts[day.toLowerCase()]++;
      break;
    }
  }
}


    this.barChartData = {
      ...this.barChartData,
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: days.map(day => weekCounts[day.toLowerCase()])
        }
      ]
    };

    console.log('✅ Répartition par jour :', weekCounts);
    console.log(`🎯 Total calculé : ${Object.values(weekCounts).reduce((a, b) => a + b, 0)} / ${predictions.length}`);
  }
}
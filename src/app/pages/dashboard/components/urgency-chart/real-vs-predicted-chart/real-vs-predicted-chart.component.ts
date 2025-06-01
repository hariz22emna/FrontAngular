import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { PredictionService } from '../../../../service/prediction.service';

Chart.register(zoomPlugin); // 🔥 enregistrer le plugin

@Component({
  selector: 'app-real-vs-predicted-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="card h-full p-4">
      <h3 class="text-xl font-bold text-center mb-4">Real vs Predicted Wait Time</h3>
      <canvas
        baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="'line'">
      </canvas>
    </div>
  `
})
export class RealVsPredictedChartComponent implements OnInit {
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x'
        },
        pan: {
          enabled: true,
          mode: 'x'
        },
        limits: {
          x: { min: 0 }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Patient ID'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temps (min)'
        }
      }
    }
  };

  constructor(private predictionService: PredictionService) {}

  async ngOnInit() {
    const predictions = await this.predictionService.getPredictions();
    const valid = predictions.filter(p =>
      p.real_wait_time !== null &&
      p.predicted_wait_time !== null &&
      !isNaN(p.real_wait_time) &&
      !isNaN(p.predicted_wait_time)
    );

    this.chartData = {
      labels: valid.map(p => `#${p.id}`),
      datasets: [
        {
          label: 'Real Wait Time',
          data: valid.map(p => p.real_wait_time),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Predicted Wait Time',
          data: valid.map(p => p.predicted_wait_time),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.4
        }
      ]
    };
  }
}

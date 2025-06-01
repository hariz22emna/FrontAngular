import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { PredictionService } from '../../../service/prediction.service';

@Component({
  selector: 'app-urgency-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './urgency-chart.component.html',
  styleUrls: ['./urgency-chart.component.scss']
})
export class UrgencyChartComponent implements OnInit {
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  public pieChartLabels = ['1', '2', '3', '4']; // ✅ Seulement les niveaux disponibles

  public pieChartData = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [0, 0, 0, 0], // ✅ correspond à 4 niveaux
        backgroundColor: ['#F8BBD0', '#BBDEFB', '#C8E6C9', '#FFE0B2'], // ✅ 4 couleurs
        borderWidth: 1
      }
    ]
  };

  constructor(private predictionService: PredictionService) {}

  async ngOnInit() {
    const predictions = await this.predictionService.getPredictions();
    const counts = [0, 0, 0, 0]; // ✅ pour niveaux 1 à 4

    predictions.forEach(p => {
      const level = Number(p.urgency_level);
      if (level >= 1 && level <= 4) {
        counts[level - 1]++;
      }
    });

this.pieChartData = {
  labels: this.pieChartLabels,
  datasets: [
    {
      data: counts,
      backgroundColor: ['#F8BBD0', '#BBDEFB', '#C8E6C9', '#FFE0B2'],
      borderWidth: 1
    }
  ]
};
  }
}

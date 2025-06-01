import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsWidget } from './components/statswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { NotificationsWidget } from './components/notificationswidget';
import { UrgencyChartComponent } from './components/urgency-chart/urgency-chart.component';
import { EmergencyFlowChartComponent } from './components/emergency-flow-chart/emergency-flow-chart.component';
import { WeekdayFlowChartComponent } from '../../charts/weekday-flow-chart.component';
import { RealVsPredictedChartComponent } from './components/urgency-chart/real-vs-predicted-chart/real-vs-predicted-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsWidget,
    UrgencyChartComponent,
    RealVsPredictedChartComponent,
    WeekdayFlowChartComponent // ✅ maintenant il est bien importé
  ],
  template: `
    <div class="grid grid-cols-12 gap-4">
      <!-- Statistiques principales -->
      <app-stats-widget class="col-span-12" />

      <!-- Contenu en deux colonnes -->
      <div class="col-span-12 xl:col-span-6">
        <app-urgency-chart />
      </div>

      <div class="col-span-12 xl:col-span-6">
        <app-weekday-flow-chart />
      </div>

      <div class="col-span-12">
        <app-real-vs-predicted-chart />
      </div>
    </div>
  `
})
export class Dashboard {}

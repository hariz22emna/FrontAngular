import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsWidget } from './components/statswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { NotificationsWidget } from './components/notificationswidget';
import { UrgencyChartComponent } from '../../urgency-chart/urgency-chart.component';
import { EmergencyFlowChartComponent } from './components/emergency-flow-chart/emergency-flow-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatsWidget,
    BestSellingWidget,
    NotificationsWidget,
    UrgencyChartComponent,
    EmergencyFlowChartComponent // 👈 importé ici
  ],
  template: `
    <div class="grid grid-cols-12 gap-4">
      <!-- Statistiques principales -->
      <app-stats-widget class="col-span-12" />

      <!-- Contenu en deux colonnes -->
      <div class="col-span-12 xl:col-span-6">
        <app-urgency-chart /> <!-- ✅ Pie chart : reste ici -->
        <app-best-selling-widget />
      </div>

      <div class="col-span-12 xl:col-span-6">
        <app-emergency-flow-chart /> <!-- ✅ Bar chart : à la place de Revenue Stream -->
        <app-notifications-widget />
      </div>
    </div>
  `
})
export class Dashboard {}

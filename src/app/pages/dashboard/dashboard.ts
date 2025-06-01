import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { StatsWidget } from './components/statswidget';
import { NotificationsWidget } from './components/notificationswidget';
import { UrgencyChartComponent } from './components/urgency-chart/urgency-chart.component';
import { WeekdayFlowChartComponent } from '../../charts/weekday-flow-chart.component';
import { RealVsPredictedChartComponent } from './components/urgency-chart/real-vs-predicted-chart/real-vs-predicted-chart.component';
import { SurchargeChartComponent } from './components/surcharge-chart/surcharge-chart.component';
import { AlertService } from '../service/alert.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NotificationsWidget,
    StatsWidget,
    UrgencyChartComponent,
    RealVsPredictedChartComponent,
    WeekdayFlowChartComponent,
    SurchargeChartComponent
  ],
  template: `
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <app-notifications-widget [messages]="messages"></app-notifications-widget>
      </div>

      <app-stats-widget class="col-span-12" />

      <div class="col-span-12 xl:col-span-6">
        <app-urgency-chart />
      </div>

      <div class="col-span-12 xl:col-span-6">
        <app-weekday-flow-chart />
      </div>

      <div class="col-span-12">
        <app-real-vs-predicted-chart />
      </div>

      <div class="col-span-12">
        <app-surcharge-chart />
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  private subscription?: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    // 🔔 Notifications WebSocket
    this.subscription = this.alertService.getAlerts().subscribe((msg) => {
      console.log('📥 Notification WebSocket reçue :', msg);
      this.messages.push(msg);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

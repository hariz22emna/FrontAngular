import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from './app/pages/service/alert.service';
import { NotificationPopupComponent } from './app/pages/notification-popup/notification-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, NotificationPopupComponent],
  template: `
    <app-notification-popup [messages]="messages"></app-notification-popup>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  private timeouts: any[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAlerts().subscribe(message => {
      this.messages.unshift(message);

      const timeout = setTimeout(() => {
        const index = this.messages.indexOf(message);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }, 8000);

      this.timeouts.push(timeout);
    });
  }

  ngOnDestroy() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }
}

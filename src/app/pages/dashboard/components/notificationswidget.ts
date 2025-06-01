import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

interface Notification {
  message: string;
  timestamp: Date;
  icon: string;
  iconColor: string;
  bgColor: string;
}

@Component({
  standalone: true,
  selector: 'app-notifications-widget',
  imports: [CommonModule, ButtonModule, MenuModule],
  template: `
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <div class="font-semibold text-xl">Notifications</div>
        <div>
          <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
          <p-menu #menu [popup]="true" [model]="items"></p-menu>
        </div>
      </div>

      <!-- Notifications dynamiques -->
      <div *ngIf="recentNotifications.length > 0">
        <span class="block text-muted-color font-medium mb-4">ALERTES EN DIRECT</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
          <li *ngFor="let notification of recentNotifications" class="flex items-center py-2 border-b border-surface">
            <div class="w-12 h-12 flex items-center justify-center rounded-full mr-4 shrink-0"
                 [ngClass]="notification.bgColor">
              <i class="!text-xl" [ngClass]="[notification.icon, notification.iconColor]"></i>
            </div>
            <div class="flex-1">
              <span class="text-surface-900 dark:text-surface-0 leading-normal block">
                {{ notification.message }}
              </span>
              <span class="text-xs text-surface-500 dark:text-surface-400">
                {{ notification.timestamp | date:'HH:mm:ss' }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class NotificationsWidget {
  @Input() messages: string[] = [];

  items = [
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
  ];

  get recentNotifications(): Notification[] {
    return this.messages.slice(-10).map((message, index) => ({
      message: message,
      timestamp: new Date(Date.now() - (this.messages.length - index - 1) * 1000),
      icon: this.getIconForMessage(message),
      iconColor: this.getIconColorForMessage(message),
      bgColor: this.getBgColorForMessage(message)
    })).reverse();
  }

  private getIconForMessage(message: string): string {
    if (message.toLowerCase().includes('surcharge') || message.toLowerCase().includes('urgent')) {
      return 'pi pi-exclamation-triangle';
    }
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('erreur')) {
      return 'pi pi-times-circle';
    }
    if (message.toLowerCase().includes('success') || message.toLowerCase().includes('succès')) {
      return 'pi pi-check-circle';
    }
    return 'pi pi-info-circle';
  }

  private getIconColorForMessage(message: string): string {
    if (message.toLowerCase().includes('surcharge') || message.toLowerCase().includes('urgent')) {
      return 'text-red-500';
    }
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('erreur')) {
      return 'text-red-500';
    }
    if (message.toLowerCase().includes('success') || message.toLowerCase().includes('succès')) {
      return 'text-green-500';
    }
    return 'text-blue-500';
  }

  private getBgColorForMessage(message: string): string {
    if (message.toLowerCase().includes('surcharge') || message.toLowerCase().includes('urgent')) {
      return 'bg-red-100 dark:bg-red-400/10';
    }
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('erreur')) {
      return 'bg-red-100 dark:bg-red-400/10';
    }
    if (message.toLowerCase().includes('success') || message.toLowerCase().includes('succès')) {
      return 'bg-green-100 dark:bg-green-400/10';
    }
    return 'bg-blue-100 dark:bg-blue-400/10';
  }
}

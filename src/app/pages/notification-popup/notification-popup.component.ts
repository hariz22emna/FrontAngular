import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    imports: [ButtonModule, MenuModule, CommonModule],
    template: `<div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">Notifications</div>
            <div>
                <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                <p-menu #menu [popup]="true" [model]="items"></p-menu>
            </div>
        </div>

        <!-- Notifications dynamiques (WebSocket) - Mêmes données que le popup -->
        <div *ngIf="recentNotifications.length > 0">
            <span class="block text-muted-color font-medium mb-4">RECENT ALERTS</span>
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

        <!-- Notifications statiques existantes -->
        <span class="block text-muted-color font-medium mb-4">TODAY</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-dollar !text-xl text-blue-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Richard Jones
                    <span class="text-surface-700 dark:text-surface-100">has purchased a blue t-shirt for <span class="text-primary font-bold">$79.00</span></span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-download !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-700 dark:text-surface-100 leading-normal">Your request for withdrawal of <span class="text-primary font-bold">$2500.00</span> has been initiated.</span>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-dollar !text-xl text-blue-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Keyser Wick
                    <span class="text-surface-700 dark:text-surface-100">has purchased a black jacket for <span class="text-primary font-bold">$59.00</span></span>
                </span>
            </li>
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-question !text-xl text-pink-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Jane Davis
                    <span class="text-surface-700 dark:text-surface-100">has posted a new questions about your product.</span>
                </span>
            </li>
        </ul>
        <span class="block text-muted-color font-medium mb-4">LAST WEEK</span>
        <ul class="p-0 m-0 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-arrow-up !text-xl text-green-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">Your revenue has increased by <span class="text-primary font-bold">%25</span>.</span>
            </li>
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-heart !text-xl text-purple-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"><span class="text-primary font-bold">12</span> users have added your products to their wishlist.</span>
            </li>
        </ul>
    </div>`
})
export class NotificationsWidget {
    @Input() messages: string[] = []; // Même input que NotificationPopupComponent
    
    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];

    get recentNotifications(): Notification[] {
        // Convertit les messages (comme dans le popup) en format pour l'affichage
        return this.messages.slice(-10).map((message, index) => ({
            message: message,
            timestamp: new Date(Date.now() - (this.messages.length - index - 1) * 1000), // Approximation du timestamp
            icon: this.getIconForMessage(message),
            iconColor: this.getIconColorForMessage(message),
            bgColor: this.getBgColorForMessage(message)
        })).reverse(); // Plus récent en premier
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
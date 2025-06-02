import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ChatbotComponent } from '../../pages/chatbot.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, ChatbotComponent],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>
    <div style="margin-top: 1.5rem; padding: 0 0.5rem;">
      <app-chatbot></app-chatbot>
    </div>`
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Chatbot IA',
                items: [{ label: 'Chatbot', icon: 'pi pi-comment', routerLink: ['/chatbot'] }]
            },
            {
                label: 'Hospital Management',
                items: [
                    { label: 'Patients', icon: 'pi pi-fw pi-users', routerLink: ['/patients'] },
                     { label: 'Nurses', icon: 'pi pi-fw pi-users', routerLink: ['/nurses'] },
                    { label: 'Doctors', icon: 'pi pi-fw pi-user-plus', routerLink: ['/doctors'] },
                    { label: 'Rooms', icon: 'pi pi-fw pi-building', routerLink: ['/rooms'] },
    
                  
                ]
            }
            
        ];
    }
}

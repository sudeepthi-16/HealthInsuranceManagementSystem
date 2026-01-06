import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.model';

@Component({
    standalone: true,
    selector: 'app-customer-notifications',
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        FormsModule
    ],
    templateUrl: './customer-notifications.html',
    styles: [`
    .notifications-container { padding: 20px; }
    .controls { margin-bottom: 20px; }
    .unread { background-color: #f0f7ff; }
    .no-notifications { padding: 20px; text-align: center; color: #666; }
  `]
})
export class CustomerNotificationsComponent implements OnInit {
    filter = signal<'all' | 'unread'>('unread');

    viewNotifications = computed(() => {
        const list = this.notificationService.notifications();
        if (this.filter() === 'unread') {
            return list.filter(n => !n.isRead);
        }
        return list;
    });

    constructor(public notificationService: NotificationService) { }

    ngOnInit() {
        this.notificationService.fetchNotifications();
    }

    setFilter(val: 'all' | 'unread') {
        this.filter.set(val);
    }

    markAsRead(id: number) {
        this.notificationService.markAsRead(id);
    }
}

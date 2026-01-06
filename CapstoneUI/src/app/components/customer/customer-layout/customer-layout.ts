import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';

import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../../services/notification.service';

@Component({
  standalone: true,
  selector: 'app-customer-layout',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    RouterLink,
    MatIconModule,
    CommonModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './customer-layout.html',
  styleUrls: ['./customer-layout.css']
})
export class CustomerLayoutComponent implements OnInit, OnDestroy {
  private pollingInterval: any;

  constructor(
    public auth: AuthService,
    private router: Router,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initialLoad();

    // Poll every 30 seconds for new notifications
    this.pollingInterval = setInterval(() => {
      if (this.auth.getUserRole() === 'Customer') {
        this.notificationService.fetchNotifications();
      }
    }, 20000);
  }

  initialLoad() {
    if (this.auth.getUserRole() === 'Customer') {
      this.notificationService.fetchNotifications();
    }
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  markAsRead(id: number, event: Event) {
    event.stopPropagation();
    this.notificationService.markAsRead(id);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

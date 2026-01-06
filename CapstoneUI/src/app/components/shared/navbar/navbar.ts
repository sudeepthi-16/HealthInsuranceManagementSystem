import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
      MatToolbar,
      NgIf
],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService, public notificationService: NotificationService) { } // Public so template can access signals

  ngOnInit() {
    if (this.auth.isLoggedIn() && this.role === 'Customer') {
      this.notificationService.fetchNotifications();
    }
  }

  get role(): string | null {
    return this.auth.getUserRole();
  }

  markAsRead(id: number, event: Event) {
    event.stopPropagation();
    this.notificationService.markAsRead(id);
  }
}

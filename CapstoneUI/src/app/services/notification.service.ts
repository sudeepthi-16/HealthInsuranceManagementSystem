import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Notification } from '../models/notification.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = `${environment.apiBaseUrl}/notifications`;

    // State
    private notificationsState = signal<Notification[]>([]);

    // Selectors
    readonly notifications = this.notificationsState.asReadonly();
    readonly unreadNotifications = computed(() => this.notificationsState().filter(n => !n.isRead));
    readonly unreadCount = computed(() => this.unreadNotifications().length);

    constructor(private http: HttpClient) { }

    fetchNotifications(unreadOnly: boolean = false) {
        let params = new HttpParams();

        if (unreadOnly) {
            params = params.set('unreadOnly', 'true');
        }

 

        this.http.get<Notification[]>(this.apiUrl).subscribe({
            next: (data) => this.notificationsState.set(data),
            error: (err) => console.error('Failed to load notifications', err)
        });
    }



    markAsRead(id: number) {
        // Optimistic update
        this.notificationsState.update(current =>
            current.map(n => n.notificationId === id ? { ...n, isRead: true } : n)
        );

        this.http.put(`${this.apiUrl}/${id}/read`, {}).subscribe({
            error: () => {

                this.fetchNotifications();
            }
        });
    }
}

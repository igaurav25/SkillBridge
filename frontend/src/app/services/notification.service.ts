import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { NotificationItem } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/notifications';

  unreadCount = signal<number>(0);
  notifications = signal<NotificationItem[]>([]);

  getMyNotifications(): Observable<ApiResponse<NotificationItem[]>> {
    return this.http.get<ApiResponse<NotificationItem[]>>(this.API_URL).pipe(
      tap((res) => {
        if (res.data) {
          this.notifications.set(res.data);
          this.unreadCount.set(res.unreadCount || 0);
        }
      })
    );
  }

  markAsRead(id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.update((list) =>
          list.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        this.unreadCount.update((c) => Math.max(0, c - 1));
      })
    );
  }

  markAllAsRead(): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/read-all`, {}).pipe(
      tap(() => {
        this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
        this.unreadCount.set(0);
      })
    );
  }

  deleteNotification(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        const item = this.notifications().find((n) => n._id === id);
        if (item && !item.read) {
          this.unreadCount.update((c) => Math.max(0, c - 1));
        }
        this.notifications.update((list) => list.filter((n) => n._id !== id));
      })
    );
  }
}

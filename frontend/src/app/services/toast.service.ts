import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(text: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, text, type };

    this.toasts.update((current) => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error');
  }

  info(text: string) {
    this.show(text, 'info');
  }

  warning(text: string) {
    this.show(text, 'warning');
  }

  remove(id: string) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}

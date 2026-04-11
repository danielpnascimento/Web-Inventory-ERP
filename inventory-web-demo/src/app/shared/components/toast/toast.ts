import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  progress: number
  timer?: any
  confirm?: boolean
  onConfirm?: () => void
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss']
})
export class Toast {

  toasts: ToastItem[] = [];
  private idCounter = 0;

  constructor(private toastService: ToastService) {

    this.toastService.toast$.subscribe(event => {

      const toast: ToastItem = {
        id: this.idCounter++,
        message: event.message,
        type: event.type,
        progress: 100,
        confirm: (event as any).confirm,
        onConfirm: (event as any).onConfirm
      };

      this.toasts = [...this.toasts, toast];

      if (!toast.confirm) {
        this.startTimer(toast);
      }

    });

  }

  startTimer(toast: ToastItem) {

    if (toast.confirm) return;

    const duration = 3000;
    const step = 50;
    const decrement = (100 / duration) * step;

    toast.timer = setInterval(() => {

      toast.progress -= decrement;

      if (toast.progress <= 0) {
        this.remove(toast.id);
      }

    }, step);

  }

  pause(toast: ToastItem) {
    clearInterval(toast.timer);
  }

  resume(toast: ToastItem) {
    this.startTimer(toast);
  }

  remove(id: number) {
    const toast = this.toasts.find(t => t.id === id);

    if (toast?.timer) {
      clearInterval(toast.timer);
    }
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

}



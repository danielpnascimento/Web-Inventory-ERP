import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private ngZone: NgZone) {}

  confirm(message: string, onConfirm: () => void) {
    this.toastSubject.next({
      message,
      type: 'warning',
      confirm: true,
      onConfirm: (function(this: ToastService) {
        this.ngZone.run(onConfirm);
      }).bind(this)
    } as any);
  }

  private toastSubject = new Subject<ToastMessage>();

  toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastMessage['type']) {
    this.toastSubject.next({ message, type });
  }

}

import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _messageService = inject(MessageService);

  /**
   * Show a toast message
   * @param key Toast reference key (e.g., 'authToast')
   * @param message Message/detail to display
   * @param severity Severity level: 'success', 'info', 'warn', 'error'
   * @param summary Optional summary/title
   */
  showToast(key: string, message: string, severity: string = 'info', summary?: string) {
    this._messageService.add({
      key: key,
      detail: message,
      severity: severity,
      summary: summary || severity.toUpperCase(),
      life: 3000
    });
  }
}

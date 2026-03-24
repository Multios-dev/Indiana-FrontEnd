import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

export type InvoiceStatus = 'paid' | 'lettered' | 'late' | 'open';

export interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  owner: 'me' | 'leo';
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    TranslatePipe],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {

  // TODO, Here we have to change so it's the api and not just the datas in this ts
  activeTab = 'me';

  tabs = [
    { id: 'me',  label: 'Mes factures' },
    { id: 'leo', label: 'Léo Martin'   },
  ];

  statusLabels: Record<InvoiceStatus, string> = {
    paid:     'Payé',
    lettered: 'Lettré',
    late:     'En retard',
    open:     'Ouvert',
  };

  invoices: Invoice[] = [
    { id: 1, number: 'F-2026-001', date: '2026-01-15', amount: 120, dueDate: '2026-02-15', status: 'paid',     owner: 'me' },
    { id: 2, number: 'F-2026-002', date: '2026-01-15', amount: 45,  dueDate: '2026-02-15', status: 'lettered', owner: 'me' },
    { id: 3, number: 'F-2025-048', date: '2025-11-01', amount: 120, dueDate: '2025-12-01', status: 'late',     owner: 'me' },
    { id: 4, number: 'F-2025-032', date: '2025-09-15', amount: 60,  dueDate: '2025-10-15', status: 'open',     owner: 'me' },
    { id: 5, number: 'F-2025-015', date: '2025-06-01', amount: 120, dueDate: '2025-07-01', status: 'paid',     owner: 'me' },
    { id: 6, number: 'F-2026-003', date: '2026-01-20', amount: 80,  dueDate: '2026-02-20', status: 'open',     owner: 'leo' },
  ];

  public get activeInvoices(): Invoice[] {
    return this.invoices.filter(i => i.owner === this.activeTab);
  }

  public get activeTabLabel(): string {
    return this.tabs.find(t => t.id === this.activeTab)?.label ?? '';
  }
}
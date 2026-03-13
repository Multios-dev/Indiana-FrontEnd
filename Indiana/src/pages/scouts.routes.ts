import { Routes } from '@angular/router';

export const SCOUTS_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () =>
        import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    },
    {
        path: 'events',
        loadComponent: () =>
        import('./events/events.component').then(m => m.EventsComponent),
    },
    {
        path: 'billing',
        loadComponent: () =>
        import('./billing/billing.component').then(m => m.BillingComponent),
    }
]
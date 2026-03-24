import { Routes } from '@angular/router';

//TODO vérifier ce que fait ce loadComponent comparé au component
export const SCOUTS_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () =>
        import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'events',
        loadComponent: () =>
        import('./events/events.component').then(m => m.EventsComponent)
    },
    {
        path: 'billing',
        loadComponent: () =>
        import('./billing/billing.component').then(m => m.BillingComponent)
    },
    {
        path: 'profile',
        loadComponent: () =>
        import('./profile/profile.component').then(m => m.ProfileComponent)
    },
]
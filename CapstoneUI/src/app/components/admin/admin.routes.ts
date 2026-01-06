import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { AdminDashboardComponent } from './dashboard/dashboard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },

      // placeholders (we’ll build these next)
      { path: 'users', loadComponent: () => import('./users/manage-users/manage-users').then(m => m.ManageUsersComponent) },
      { path: 'plans', loadComponent: () => import('./plans/manage-plans/manage-plans').then(m => m.ManagePlansComponent) },
      { path: 'hospitals', loadComponent: () => import('./hospitals/manage-hospitals/manage-hospitals').then(m => m.ManageHospitalsComponent) },

    ]
  }
];

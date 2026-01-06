import { Routes } from '@angular/router';

import { CustomerLayoutComponent } from './customer-layout/customer-layout';
import { CustomerDashboardComponent } from './dashboard/dashboard';
import { CustomerPoliciesComponent } from './policies/customer-policies/customer-policies';
import { PaymentsComponent } from './payments/manage-payments/payments';
import { CustomerClaimsComponent } from './claims/customer-claims/customer-claims';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: CustomerDashboardComponent
      },
      {
        path: 'policies',
        component: CustomerPoliciesComponent
      },
      {
        path: 'notifications',
        loadComponent: () => import('./notifications/customer-notifications').then(m => m.CustomerNotificationsComponent)
      },
      { path: 'claims', component: CustomerClaimsComponent },
      {
        path: 'payments',
        component: PaymentsComponent
      }
    ]
  }
];

import { Routes } from '@angular/router';
import { HospitalLayoutComponent } from './hospital-layout/hospital-layout';
import { ManageClaimsComponent } from './claims/manage-claims/manage-claims';
import { HospitalPaymentsComponent } from './payments/payments';

export const HOSPITAL_ROUTES: Routes = [
  {
    path: '',
    component: HospitalLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard')
            .then(m => m.HospitalDashboardComponent)
      },
      {
        path: 'claims',
        component: ManageClaimsComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'payments',
        component: HospitalPaymentsComponent
      },
    ]
  }
];

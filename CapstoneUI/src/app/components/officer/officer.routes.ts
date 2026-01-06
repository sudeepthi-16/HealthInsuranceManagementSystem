import { Routes } from '@angular/router';
import { OfficerLayoutComponent } from './officer-layout/officer-layout';
import { ManageClaimsComponent } from './claims/manage-claims/manage-claims';
import { PaymentsComponent } from './payments/payments';
import { OfficerDashboardComponent } from './dashboard/dashboard';

export const OFFICER_ROUTES: Routes = [
  {
    path: '',
    component: OfficerLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: OfficerDashboardComponent
      },
      {
        path: 'claims',
        component: ManageClaimsComponent
      },
      {
        path: 'payments',
        component: PaymentsComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

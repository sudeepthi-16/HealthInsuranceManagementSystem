import { Routes } from '@angular/router';
import { AgentDashboardComponent } from './dashboard/dashboard';
import { ManagePoliciesComponent } from '../agent/policies/manage-policies/manage-policies';
import { PaymentsComponent } from './payments/payments';
import { ViewPlansComponent } from './plans/view-plans/view-plans';

import { AgentLayoutComponent } from './agent-layout/agent-layout';


export const AGENT_ROUTES: Routes = [
  {
    path: '',
    component: AgentLayoutComponent,
    children: [
      {
        path: 'policies',
        component: ManagePoliciesComponent
      },
      {
        path: 'dashboard',
        component: AgentDashboardComponent
      },
      {
        path: 'payments',
        component: PaymentsComponent
      },
      {
        path: 'plans',
        component: ViewPlansComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

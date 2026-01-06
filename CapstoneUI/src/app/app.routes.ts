import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { roleGuard } from './guards/role.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/public/home/home')
        .then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/public/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/public/register/register')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/public/home/home')
        .then(m => m.HomeComponent)
  },
  {
  path: 'admin',
  canActivate: [authGuard,roleGuard(['Admin'])],
  loadChildren: () =>
    import('./components/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
},
{
  path: 'customer',
  canActivate: [authGuard, roleGuard(['Customer'])],
  loadChildren: () =>
    import('./components/customer/customer.routes')
      .then(m => m.CUSTOMER_ROUTES)
},

{
  path: 'agent',
  canActivate: [authGuard, roleGuard(['InsuranceAgent'])],
  loadChildren: () =>
    import('./components/agent/agent.routes')
      .then(m => m.AGENT_ROUTES)
},
{
  path: 'officer',
  canActivate: [authGuard, roleGuard(['ClaimsOfficer'])],
  loadChildren: () =>
    import('./components/officer/officer.routes')
      .then(m => m.OFFICER_ROUTES)
},
{
  path: 'hospital',
  canActivate: [authGuard, roleGuard(['Hospital'])],
  loadChildren: () =>
    import('./components/hospital-manager/hospital-manager.routes')
      .then(m => m.HOSPITAL_ROUTES)
}


];

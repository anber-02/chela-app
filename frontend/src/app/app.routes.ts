import { Routes } from '@angular/router';
import { AuthenticationGuard } from './common/services/authentication.guard';
import { AuthorizationGuard } from './common/services/authorization.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then(m => m.HomePage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'crud',
    loadComponent: () => import('./features/auth/crud/crud.page').then(m => m.CrudPage),
    canActivate: [AuthenticationGuard, AuthorizationGuard],
    data: {
      roles: ['admin']
    }
  },
  {
    path: 'admin/orders',
    loadComponent: () => import('./pages/admin/orders/orders.page').then( m => m.OrdersPage),
    canActivate: [AuthenticationGuard, AuthorizationGuard],
    data: {
      roles: ['admin']
    }
  },
];

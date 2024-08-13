import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthenticationGuard } from 'src/app/common/services/authentication.guard';
import { AuthorizationGuard } from 'src/app/common/services/authorization.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./menu/menu.page').then((m) => m.MenuPage),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./cart/cart.page').then((m) => m.CartPage),
      },
      {
        path: '',
        redirectTo: '/profile',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full',
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.page').then( m => m.OrdersPage),
    canActivate: [AuthenticationGuard, AuthorizationGuard],
    data: {
      roles: ['user']
    }
  }



];

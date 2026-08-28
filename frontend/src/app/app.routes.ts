import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
 {
  path: '',
  loadComponent: () =>
    import('./features/home/home').then(m => m.Home)
},
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'items',
    loadComponent: () =>
      import('./features/catalog/item-list/item-list').then(m => m.ItemList),
    canActivate: [authGuard]
  },
  {
    path: 'reservations',
    loadComponent: () =>
      import('./features/reservations/reservation-list/reservation-list').then(m => m.ReservationList),
    canActivate: [authGuard]
  },
  {
    path: 'fines',
    loadComponent: () =>
      import('./features/fines/fine-list/fine-list').then(m => m.FineList),
    canActivate: [authGuard]
  },
  {
    path: 'staff/checkout',
    loadComponent: () =>
      import('./features/staff/checkout/checkout').then(m => m.Checkout),
    canActivate: [authGuard]
  },
  {
    path: 'admin/catalog',
    loadComponent: () =>
      import('./features/admin/manage-catalog/manage-catalog').then(m => m.ManageCatalog),
    canActivate: [authGuard]
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register)
  }
];
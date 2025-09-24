import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'insert-biblio',
    loadComponent: () => import('./features/collection-insert-biblio/collection-insert-biblio.page').then( m => m.CollectionInsertBiblioPage)
  },
  {
    path: 'collection/:id',
    loadComponent: () => import('./features/collection-detail/collection-detail.page').then( m => m.CollectionDetailPage)
  },
];

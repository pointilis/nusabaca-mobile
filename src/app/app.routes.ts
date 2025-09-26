import { Routes } from '@angular/router';
import { unAuthorizedGuard } from './utils/guards/un-authorized-guard';
import { authorizedGuard } from './utils/guards/authorized-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome/welcome.page').then( m => m.WelcomePage),
    canActivate: [unAuthorizedGuard],
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authorizedGuard],
  },
  {
    path: 'collection-editor',
    canActivate: [authorizedGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/collection-editor/collection-editor.page').then( m => m.CollectionEditorPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./features/collection-editor/collection-editor.page').then( m => m.CollectionEditorPage),
      }
    ]
  },
  {
    path: 'collection/:id',
    loadComponent: () => import('./features/collection-detail/collection-detail.page').then( m => m.CollectionDetailPage),
    canActivate: [authorizedGuard],
  },
];

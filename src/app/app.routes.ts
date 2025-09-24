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
    path: 'collection-editor',
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
    loadComponent: () => import('./features/collection-detail/collection-detail.page').then( m => m.CollectionDetailPage)
  },
];

import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';


export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/pages/pages.routes'),
  },
  {
    path: '**',
    component: NotFound,
  },
];

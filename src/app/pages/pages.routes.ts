import { Routes } from "@angular/router";
import { Layout } from "../layout/layout";
import { Component } from "@angular/core";
import { ModalDetail } from "../components/modal-detail/modal-detail";

const pagesRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home),
        title: 'Pokedex - Inicio',
        children: [
          {
            path: ':id',
            component: ModalDetail,
          }
        ],
      },
      {
        path: '404',
        loadComponent: () => import('./not-found/not-found').then(m => m.NotFound),
        title: 'Pokedex - Página no encontrada'
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  },
];

export default pagesRoutes;
import { ErrorHttpComponent } from './opus/commons/error-http/error-http.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { Page404Component } from './extrapages/page404/page404.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'home',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'gral',
    component: LayoutComponent,
    loadChildren: () =>
      import('./opus/opus-components/general.module').then((m) => m.GeneralModule),
  },
  {
    path: 'user',
    component: LayoutComponent,
    loadChildren: () =>
      import('./opus/opus-users/opus-users.module').then((m) => m.OpusUsersModule),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./extrapages/extrapages.module').then((m) => m.ExtrapagesModule),
  },
  //manage error within response http
  {path:'error-http/:id', component: ErrorHttpComponent},
  //manage page not found 
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

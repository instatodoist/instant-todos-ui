import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './shared/layout/admin/admin.component';
import { CanActivateAuthenticateGuard } from './shared/guards/can-activate-authenticate.guard';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [CanActivateAuthenticateGuard],
    children: [
      {
        path: 'application',
        loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule),
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

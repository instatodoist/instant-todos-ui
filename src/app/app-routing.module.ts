import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InnerLayoutComponent } from './layouts/inner-layout/inner-layout.component';
import { CanActivateAuthenticateGuard } from './guards/can-activate-authenticate.guard';
import { PageNotFoundComponent } from './modules/shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateAuthenticateGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        component: InnerLayoutComponent,
        path: 'pomodoro/clock',
        loadChildren: () => import('./modules/pomodoro/pomodoro.module').then(m => m.PomodoroModule)
      },
      {
        component: InnerLayoutComponent,
        path: 'smart-analysis',
        loadChildren: () => import('./modules/smart-analysis/smart-analysis.module').then(m => m.SmartAnalysisModule)
      },
      {
        component: InnerLayoutComponent,
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        component: InnerLayoutComponent,
        path: 'tasks',
        loadChildren: () => import('./modules/todo/todo.module').then(m => m.TodoModule)
      },
      {
        component: InnerLayoutComponent,
        path: 'notes',
        loadChildren: () => import('./modules/goal/goal.module').then(m => m.GoalModule)
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

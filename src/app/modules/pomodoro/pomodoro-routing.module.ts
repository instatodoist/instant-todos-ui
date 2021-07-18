import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PomodoroComponent } from './pomodoro/pomodoro.component';

const routes: Routes = [
  {
    path: '',
    component: PomodoroComponent,
    data: {
      header_title: 'pomodoro_clock'
    }
  }
];

@NgModule({
  declarations: [
    PomodoroComponent
  ],
  imports: [
      RouterModule.forChild(routes)
  ]
})
export class PomodoroRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalArchieveComponent } from './goal-archieve/goal-archieve.component';
import { GoalComponent } from './goal/goal.component';

const routes: Routes = [
  {
    path: '',
    component: GoalComponent,
    children: [
      {
        path: '',
        component: GoalListComponent,
        data: {
          header_title: 'notes'
        }
      },
      {
        path: 'archieved',
        component: GoalArchieveComponent,
        data: {
          header_title: 'notes-archieved'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GoalRoutingModule { }

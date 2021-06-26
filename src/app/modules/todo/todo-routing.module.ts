import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';
import { TodoLabelListComponent } from './todo-label-list/todo-label-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inbox',
        component: TodoInboxComponent,
        data: {
          header_title: 'inbox'
        }
      },
      {
        path: 'upcoming',
        component: TodoInboxComponent,
        data: {
          header_title: 'upcoming'
        }
      },
      {
        path: 'today',
        component: TodoInboxComponent,
        data: {
          header_title: 'today'
        }
      },
      {
        path: 'completed',
        component: TodoInboxComponent,
        data: {
          header_title: 'completed'
        }
      },
      {
        path: 'pending',
        component: TodoInboxComponent,
        data: {
          header_title: 'pending'
        }
      },
      {
        path: 'lists/:label',
        component: TodoInboxComponent,
        data: {
          header_title: 'lists'
        }
      },
      {
        path: 'tags',
        component: TodoLabelListComponent,
        data: {
          header_title: 'tags'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TodoRoutingModule { }

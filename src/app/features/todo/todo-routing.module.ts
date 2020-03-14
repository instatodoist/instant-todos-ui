import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoInboxComponent } from './todo-inbox/todo-inbox.component';
import { TodoTodayComponent } from './todo-today/todo-today.component';


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
        path: 'today',
        component: TodoTodayComponent,
        data: {
          header_title: 'today'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [TodoInboxComponent, TodoTodayComponent]
})
export class TodoRoutingModule { }

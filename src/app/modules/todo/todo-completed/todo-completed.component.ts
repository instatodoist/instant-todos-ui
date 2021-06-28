import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../services';
import { TodoConditions, TodoCompletedListType } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-completed',
  templateUrl: './todo-completed.component.html',
  styleUrls: ['./todo-completed.component.scss']
})
export class TodoCompletedComponent implements OnInit {

  todos: TodoCompletedListType = {
    totalCount: 0,
    data: []
  };
  conditions = this.todoService.getConditions('completed');
  isLoading = false;

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.getCompletedTodos(this.conditions);
  }

  loadMore(): void {
    this.conditions = {
      ...this.conditions,
      offset: (this.conditions.offset + 1)
    };
    this.getCompletedTodos(this.conditions);
  }

  private getCompletedTodos(conditions: TodoConditions): void {
    this.isLoading = true;
    this.todoService.fetchCompleted(conditions)
      .subscribe(({ data, totalCount }) => {
        this.isLoading = false;
        this.todos = {
          ...this.todos,
          totalCount,
          data: [
            ...this.todos.data,
            ...data
          ]
        };
      });
  }

}

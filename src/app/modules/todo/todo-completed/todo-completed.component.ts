import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService, TodoService } from '../../../services';
import { TodoConditions, TodoCompletedListType, ITodoTypeCount, ISubscription } from '../../../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-completed',
  templateUrl: './todo-completed.component.html',
  styleUrls: ['./todo-completed.component.scss']
})
export class TodoCompletedComponent implements OnInit, OnDestroy {

  todos: TodoCompletedListType = {
    totalCount: 0,
    data: []
  };
  conditions = this.todoService.getConditions('completed');
  isLoading = false;
  count: ITodoTypeCount;
  private subscriptions: ISubscription = {
    count: null,
    list: null
  };

  constructor(
    private todoService: TodoService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getCompletedTodos(this.conditions);
    this.subscribeToCount();
  }

  ngOnDestroy(): void{
    this.appService.unsubscribe(this.subscriptions);
  }

  loadMore(): void {
    this.conditions = {
      ...this.conditions,
      offset: (this.conditions.offset + 1)
    };
    this.getCompletedTodos(this.conditions);
  }

  private subscribeToCount(){
    this.subscriptions.count = this.appService.countDataSource$
      .subscribe(response=>{
        const { today, pending, inbox, completed, upcoming } = response;
        this.count = {
          ...this.count,
          pending,
          today,
          inbox,
          completed,
          upcoming
        };
      });
  }

  private getCompletedTodos(conditions: TodoConditions): void {
    this.isLoading = true;
    this.subscriptions.list = this.todoService.fetchCompleted(conditions)
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

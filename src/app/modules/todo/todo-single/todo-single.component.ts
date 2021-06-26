import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoType } from 'src/app/models';
import * as moment from 'moment';

@Component({
  selector: 'app-todo-single',
  templateUrl: './todo-single.component.html',
  styleUrls: ['./todo-single.component.scss']
})
export class TodoSingleComponent implements OnInit {

  @Input() todo: TodoType;
  @Input() index: number;
  @Input() todoCurrentType: string;
  @Input() TODOTYPES: any;
  @Input() isSubTask = false;
  @Output() openPopUpCb: EventEmitter<TodoType> = new EventEmitter<TodoType>();
  @Output() updateTodoCb: EventEmitter<TodoType> = new EventEmitter<TodoType>();
  @Output() deleteTodoCb: EventEmitter<TodoType> = new EventEmitter<TodoType>();
  isExpand = false; // Default collapse true

  constructor() { }

  ngOnInit(): void { }

  expandSubTasks(): void {
    this.isExpand = !this.isExpand;
  }

  openPopUp(todo: TodoType): void {
    this.openPopUpCb.next(todo);
  }

  updateTodo(todo: TodoType): void {
    this.updateTodoCb.next(todo);
  }

  deleteTodo(todo: TodoType): void {
    this.deleteTodoCb.next(todo);
  }

  deleteRequest(): void {
    this.todo = {
      ...this.todo, deleteRequest: true
    };
    setTimeout(() => {
      this.todo = {
        ...this.todo, deleteRequest: false
      };
    }, 3000);
  }

  checkScheduledDate(todo: TodoType): boolean {
    const date = todo.scheduledDate;
    const diff = moment(new Date(date)).diff((moment(new Date()).format('YYYY-MM-DD')));
    return diff === 0 || diff > 1;
  }

  displayDate(todo: TodoType): string {
    const date = todo.scheduledDate;
    if (!date) {
      return '';
    }
    if (moment(date).isSame(moment(), 'day')) {
      return 'Today';
    }
    return moment(date).endOf('day').fromNow();
  }

}

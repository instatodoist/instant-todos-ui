import { Component, OnInit, Input } from '@angular/core';
import { TodoListType } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-completed',
  templateUrl: './todo-completed.component.html',
  styleUrls: ['./todo-completed.component.scss']
})
export class TodoCompletedComponent implements OnInit {
  loader = false;
  @Input()
  todos: TodoListType;

  constructor() { }

  ngOnInit(): void {
  }

}

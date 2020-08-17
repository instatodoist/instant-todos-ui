import { Component, OnInit } from '@angular/core';
import { TodoService, AppService } from '../../../service';
import { TodoLabelType } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-project-list',
  templateUrl: './todo-project-list.component.html',
  styles: [`
    .child-labels{
      background: var(--iq-light-primary) !important;
    }
  `]
})
export class TodoProjectListComponent implements OnInit {

  labels: TodoLabelType[];
  currentUrl = '';

  constructor(
    private appService: AppService,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.getLabels();
    this.appService.currentUrlObservable.subscribe( url => {
      this.currentUrl = url;
    });
  }

  getLabels(): void {
    this.todoService
      .listTodoProjects()
      .subscribe(response => {
        this.labels = response;
      });
  }
}

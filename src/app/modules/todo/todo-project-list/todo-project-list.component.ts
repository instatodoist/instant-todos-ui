import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppService, ProjectService } from '../../../services';
import { TodoLabelType, ISubscription } from '../../../models';

@Component({
  selector: 'app-todo-project-list',
  templateUrl: './todo-project-list.component.html',
  styles: [`
    .child-labels{
      background: var(--iq-light-primary) !important;
    }
  `]
})
export class TodoProjectListComponent implements OnInit, OnDestroy {

  @Input()
  isSidebarCollapse = false;
  labels: TodoLabelType[];
  currentUrl = '';
  private subscriptions: ISubscription = {
    url: null,
    list: null
  };

  constructor(
    private appService: AppService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.getLabels();
    this.subscriptions.url = this.appService.currentUrlDataSource$.subscribe( url => {
      this.currentUrl = url;
    });
  }

  ngOnDestroy(): void {
    this.appService.unsubscribe(this.subscriptions);
  }

  getLabels(): void {
    this.subscriptions.list = this.projectService
      .fetchAll()
      .subscribe(response => {
        this.labels = response;
      });
  }
}

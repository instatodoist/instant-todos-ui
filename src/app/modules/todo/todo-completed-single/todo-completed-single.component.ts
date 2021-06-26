import { Component, OnInit, Input } from '@angular/core';
import { TodoType } from '../../../models';

@Component({
  selector: 'app-todo-completed-single',
  template: `
    <ng-container>

      <li class="d-flex mb-4 tr-{{ index + 1}} cursor" style="border-bottom: 1px solid #cccc;
padding-bottom: 10px;" [ngClass]="{'i-am-subtask': isSubTask }">
        <!-- Expand button if exist-->
        <div class="user-img img-fluid">
          <span style="font-size: 1em;">
            {{index + 1 + ". "}}
          </span>
          <span *ngIf="todo?.subTasks?.length" (click)="$event.stopPropagation(); expandSubTasks()">
            <i class="fas fa-angle-down" [ngClass]="{ 'fa-angle-down' : isExpand, 'fa-angle-right': !isExpand}"></i>
          </span>
        </div>

        <!-- Title & labels-->
        <div class="media-support-info ml-3">
          <h6>
            <span class="mr-2">{{todo?.title}}</span>
          </h6>
          <p class="mb-0 font-size-12">
            <span *ngFor="let label of todo?.labels" class="badge border mt-2 mr-2"
              [ngStyle]="{ 'color': label?.color, 'border-color': '#ccc !important' }">
              #{{label?.name}}
            </span>
          </p>
        </div>

        <!-- Project name -->
        <div class="iq-card-header-toolbar d-flex align-items-right">
          <span class="text-primary">
            <ng-container>
              <div class=" ml-auto ml-4">
                <span class="badge badge-primary ml-2 mr-2 cursor">{{todo?.project?.name}}</span>
                <span class=" ml-auto ml-4 text-primary" [ngStyle]="{'float': 'right'}">
                {{todo?.createdAt | date: 'medium'}}
                </span>
              </div>
            </ng-container>
          </span>
        </div>

      </li>

      <!-- Subtasks-->
      <ng-container *ngIf="todo?.subTasks?.length && isExpand">
        <app-todo-completed-single
        *ngFor="let subtask of todo?.subTasks; let i = index"
        [todo]= "subtask"
        [index]="i"
        [isSubTask]="true"
        ></app-todo-completed-single>
      </ng-container>

  </ng-container>
  `,
  styles: [`
    .i-am-subtask div.user-img {
      margin-left: 40px;
    }
  `]
})
export class TodoCompletedSingleComponent implements OnInit {
  @Input() todo: TodoType = null;
  @Input() index: number = null;
  @Input() isSubTask = false;
  isExpand = false; // Default collapse true

  constructor() { }

  ngOnInit(): void {}

  expandSubTasks(): void {
    this.isExpand = !this.isExpand;
  }

}

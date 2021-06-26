import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TodoProjectType } from '../../../models';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-todo-projects',
  templateUrl: './todo-projects-dialog.component.html',
  styleUrls: ['./todo-projects-dialog.component.scss']
})
export class TodoProjectListDialogComponent implements OnInit {
  @Input() projectId = '';
  @Input() projects: TodoProjectType[] = [];
  @Output() callback: EventEmitter<string> = new EventEmitter<string>();
  formObj: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<TodoProjectListDialogComponent>
  ) {}

  ngOnInit(): void {}

  checkProject(project: TodoProjectType) {
    // eslint-disable-next-line no-underscore-dangle
    this.projectId = project._id;
    this.callback.next(this.projectId);
    this.dialogRef.close(this.projectId);
  }

}

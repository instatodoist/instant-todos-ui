import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { NgModule, Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { UtilityService, ProjectService } from '../../../service';
import { TodoProjectType, TodoConditions, IOperationEnumType } from '../../../models';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-todo-project',
  templateUrl: './todo-project-dialog.component.html',
  styles: []
})
export class TodoProjectDialogComponent implements OnInit, AfterViewInit {

  @Input()
  conditions: TodoConditions = null;

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  formObj: FormGroup;
  labels: TodoProjectType[];
  // dialog: MDCDialog;
  operationType: IOperationEnumType = 'ADD';
  loader = false;

  constructor(
    private fb: FormBuilder,
    private toast: UtilityService,
    public activeModal: MatDialogRef<TodoProjectDialogComponent>,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group(
      {
        name: ['', [Validators.required]],
        _id: [''],
        operationType: [this.operationType]
      }
    );
    this.getProjects();
  }

  ngAfterViewInit() {}

  getProjects() {
    this.projectService
      .fetchAll()
      .subscribe(response => {
        this.labels = response;
      });
  }

  editLabel(project: TodoProjectType) {
    this.operationType = 'UPDATE';
    this.formObj.patchValue({
      _id: project._id,
      name: project.name,
      operationType: 'UPDATE'
    });
  }

  deleteLabel(project: TodoProjectType) {
    this.operationType = 'DELETE';
    this.todoOperationExec({
      _id: project._id,
      operationType: 'DELETE'
    });
  }

  submit() {
    if (this.formObj.valid) {
      this.loader = true;
      const postBody = this.formObj.value;
      this.todoOperationExec(postBody);
    }
  }

  todoOperationExec(postBody: TodoProjectType) {
    let project$ = null;
    switch (this.operationType) {
      case 'ADD':
        project$ = this.projectService.create(postBody);
        break;
      case 'UPDATE':
        project$ = this.projectService.update(postBody);
        break;
      case 'DELETE':
        project$ = this.projectService.delete(postBody);
        break;
      }
      project$
      .subscribe(
        () => {
        this.loader = false;
        this.formObj.reset();
        switch (this.operationType) {
        case 'ADD':
          this.toast.toastrSuccess('List has been added');
          break;
        case 'UPDATE':
          this.toast.toastrSuccess('List has been updated');
          break;
        case 'DELETE':
          this.toast.toastrWarning('List has been deleted');
          break;
        }
        this.operationType = 'ADD';
      }, ()=>{
        this.loader = false;
      });
  }

}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    TodoProjectDialogComponent
  ]
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TodoProjectDialogModule{}

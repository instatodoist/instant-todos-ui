/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { TodoService, UtilityService } from '../../../service';
import { TodoType, TodoLabelType, TodoConditions, IOperationEnumType, TodoProjectType } from '../../../models';
import {  SharedModule } from '../../shared/shared.module';
import { DialogTodoTagsComponent } from '../todo-tag-dialog/dialog-todo-tags.component';
import { TodoProjectListDialogComponent } from '../todo-project-list-dialog/todo-projects-dialog.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateModalComponent } from '../../shared/custom-date-modal/custom-date-modal.component';

/**
 * Date Types Options
 * on choosing Date
 */
type TScheduledString = 'NO_DUE_DATE' | 'TODAY' | 'TOMORROW' | 'NEXT_WEEK' | 'CUSTOM';

/**
 * Scheduled Object Values
 */
interface Ischeduled {
  name: string;
  value: string;
  slug: string;
}

/**
 * Hash map for date types
 * for popups
 */
type TscheduledObj = { [ key in TScheduledString ]: Ischeduled };

/**
 * Task Form Interface
 */
interface ITodoFormModel extends TodoType {
  scheduledType?: TScheduledString;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, OnDestroy {
  @Input() modelId = 'todo-dialog';
  @Input() todo: TodoType = null; // todo object if update
  @Input() conditions: TodoConditions = null; // conditions object
  nestedModalId = '';
  title = 'Add Task'; // default title if use same component for ADD/EDIT
  operationType: IOperationEnumType = 'ADD'; // default operationType if use same component for ADD/EDIT
  todoCurrentType: string; // current route
  currentProject = ''; // Default List name
  labelIdVal: string[] = []; // Tags Array
  isSubmit = false; // submit button flag
  today = moment(new Date()).startOf('day');
  labels: TodoLabelType[]; // labels array
  projects: TodoProjectType[] = [];
  formObj: FormGroup;
  scheduledObj = this.initscheduledObj();
  scheduledObjKeys = Object.keys(this.scheduledObj);
  subTasksFormArray: FormArray;
  private routeSubscription: Subscription;
  private todoSubscription: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private todoService: TodoService,
    private toastr: UtilityService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) { }

  /**
   * Lifecycle Method
   */
  ngOnInit(): void {
    this.formObj = this.createForm({
      _id: '',
      title: '',
      scheduling: false,
      scheduledDate: new Date(this.scheduledObj.TODAY.value),
      labelIds: [],
      projectId: '',
      operationType: 'ADD',
      isCompleted: false,
      scheduledType: 'TODAY',
      notes: '',
      noteId: '',
      subTasks: this.createFormArray()
    });
    this.populateTodoModal(); // Listen to subscription to choose if popup called
    this.fetchData();
  }

  get formValue(): ITodoFormModel {
    return this.formObj.value as ITodoFormModel;
  }

  /**
   * Create type safe form group object
   */
  private createForm(model: ITodoFormModel): FormGroup {
    return this.fb.group(model);
  }

  /**
   * Create type safe form group object
   */
  private createFormArray()  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fb.array([ this.initSubTasks() ]) as any;
  }

  /**
   * Initiate subTask form group
   */
  private initSubTasks() {
    return this.createForm({
      title: '',
      isCompleted: false
    });
  }

  /**
   * Add subask onject
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  addSubTask(): void {
    const subTasksEmpty = this.formObj.value.subTasks.filter((item: TodoType) => !item.isCompleted && !item.title);
    if (subTasksEmpty.length < 2) {
      this.subTasksFormArray = this.formObj.get('subTasks') as FormArray;
      this.subTasksFormArray.push(this.initSubTasks());
    }
  }

  /**
   * Remove subtask
   *
   * @param itemIndex - index for subtask object
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  removeSubTask(itemIndex: number): void {
    this.subTasksFormArray = this.formObj.get('subTasks') as FormArray;
    if (itemIndex > -1) {
      this.subTasksFormArray.removeAt(itemIndex);
    }
  }

  /**
   * Get all subtasks as form array
   */
  get subTasks(): FormArray {
    return this.formObj.get('subTasks') as FormArray;
  }

  /**
   * Creating scheduled hashmap
   * for date option
   */
  private initscheduledObj(): TscheduledObj {
    return {
      NO_DUE_DATE: {
        name: 'No Due Date',
        slug: 'NO_DUE_DATE',
        value: null
      },
      TODAY: {
        name: 'Later Today',
        slug: 'TODAY',
        value: moment().format('YYYY-MM-DD')
      },
      TOMORROW: {
        name: 'Tomorrow',
        slug: 'TOMORROW',
        value: moment().add(1, 'days').format('YYYY-MM-DD')
      },
      NEXT_WEEK: {
        name: 'Next week',
        slug: 'NEXT_WEEK',
        value: moment().add(7, 'days').format('YYYY-MM-DD')
      },
      CUSTOM: {
        name: 'Custom',
        slug: 'CUSTOM',
        value: null
      }
    };
  }

  /**
   * load initial Data
   */
  private fetchData() {
    this.routeSubscription = combineLatest([ // fetching Tags & Projects/List in the system
      this.todoService.listTodoLabels(),
      this.todoService.listTodoProjects()
    ])
      .pipe(
        map(data => ({
          // params: data[0],
          labels: data[0],
          projects: data[1]
        }))
      )
      .subscribe(data => {
        const url = this.router.url;
        let project = null;
        if (url.match('lists')) {
          const splitArr = url.split('/');
          project = splitArr[splitArr.length - 1] || null;
        }
        const { labels = [], projects = [] } = data;
        this.labels = labels;
        this.projects = projects;
        if (!project) {
          let projectFilteredArr = null;
          if (this.formObj.value.projectId) {
            projectFilteredArr = projects.filter(obj => (obj._id) === this.formObj.value.projectId);
          }
          if (projectFilteredArr && projectFilteredArr.length) {
            this.formObj.patchValue({
              projectId: projectFilteredArr[0]._id
            });
            this.currentProject = projectFilteredArr[0].name;
          }
          this.todoCurrentType = this.todoService.getCurentRoute();
          this.conditions = this.todoService.getConditions(this.todoCurrentType);
        } else {
          const projectId = projects.filter(obj => (obj.name).toLowerCase() === project.toLowerCase())[0]._id;
          this.formObj.patchValue({
            projectId
          });
          this.conditions = this.todoService.getConditions(projectId, 'labels');
        }
        // populate project if any
        const filteredProject: TodoLabelType[] = this.projects.filter(item => item._id === this.formObj.value.projectId);
        if (filteredProject.length) {
          this.currentProject = filteredProject[0].name;
        }
        if (this.todoCurrentType === 'today') { // set scheduled date Today
          this.formObj.patchValue({
            scheduling: true
          });
        }
      });
  }

  /**
   * On UPDATE: populate form
   */
  private populateTodoModal() {
    if(this.todo) {
      this.title = 'Update Task';
      this.labelIdVal = this.todo && this.todo.labels ? (this.todo.labels.map(label => label._id)) : [];
      this.formObj.patchValue({
        _id: this.todo && this.todo._id || '',
        title: this.todo && this.todo.title || '',
        projectId: this.todo && this.todo.projectId || '',
        scheduledDate: this.todo && this.todo.scheduledDate ? this.todo.scheduledDate : '',
        scheduledType: this.initialiseDate(this.todo.scheduledDate),
        labelIds: this.labelIdVal,
        operationType: this.todo._id ? 'UPDATE' : 'ADD',
        isCompleted: this.todo && this.todo.isCompleted ? true : false,
        notes: this.todo && this.todo.comments.length ? this.todo.comments[0].description: '',
        noteId: this.todo && this.todo.comments.length ? this.todo.comments[0]._id: ''
      });
      if (this.todo?.subTasks?.length) {
        const subTasksControl = this.subTasks;
        (this.formObj.get('subTasks') as FormArray).clear();
        // Sort subtasks by title
        const subTasks = this.todo.subTasks
          .sort((a, b) => a.title.localeCompare(b.title));
        subTasks.forEach((element: TodoType) => {
          subTasksControl.push(this.fb.group(element));
        });
        this.addSubTask();
      }
    }
  }

  /**
   * auto checked the labels if exist
   *
   * @param label - label Object
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  isChecked(label: TodoLabelType): boolean {
    return this.formObj.value.labelIds && this.formObj.value.labelIds.indexOf(label._id) !== -1 ? true : false;
  }

  /**
   * check & uncheck labels
   *
   * @param label - label object
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  checkLabels(label: TodoLabelType): void {
    const labelId = label._id;
    const index = this.formObj.value.labelIds.indexOf(labelId);
    if (index === -1) {
      this.formObj.value.labelIds.push(labelId);
    } else {
      this.formObj.value.labelIds.splice(index, 1);
    }
  }

  /**
   * Check scheduledDate
   *
   * @param scheduledDate - Date
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  initialiseDate(scheduledDate: Date): string {
    if (scheduledDate) {
      if (moment(scheduledDate).isSame(moment(), 'day')) {
        return 'TODAY';
      }
      return 'CUSTOM';
    }
    return 'NO_DUE_DATE';
  }

  /**
   * open nested popups for project, tag & date
   *
   * @param nestedModalId - modelId
   * @param type - model type - PROJECT, TAG, DATE
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  openListPopup(popupType: string, scheduledType?: TScheduledString): void {
    if(popupType === 'PROJECT'){
      const modalRef = this.modalService.open(TodoProjectListDialogComponent, {size: 'lg', scrollable: true});
      modalRef.componentInstance.projects = this.projects;
      modalRef.componentInstance.projectId = this.formObj.value.projectId;
      modalRef.componentInstance.callback.subscribe((projectId: string) => {
        this.callbackProject(projectId);
      });
    } else if(popupType === 'TAG'){
      const modalRef = this.modalService.open(DialogTodoTagsComponent, {size: 'lg', scrollable: true});
      modalRef.componentInstance.labels = this.labels;
      modalRef.componentInstance.labelIds = this.formObj.value.labelIds;
      modalRef.componentInstance.callback.subscribe((tagIds: string[]) => {
        this.callbackLabel(tagIds);
      });
    } else if(popupType === 'DATE'){
      if (scheduledType === 'CUSTOM') {
        this.formObj.patchValue({
          scheduledType
        });
        const modalRef = this.modalService.open(CustomDateModalComponent, {centered: true});
        modalRef.componentInstance.operationType = this.formObj.value.operationType;
        modalRef.componentInstance.scheduledAt = this.formObj.value.scheduledDate;
        modalRef.componentInstance.callback.subscribe((date: any) => {
          this.callbackDate(date);
        });
      } else {
        this.formObj.patchValue({
          scheduledType,
          scheduledDate: this.scheduledObj[scheduledType].value
        });
      }
    }
  }

  /**
   * get projectId from child component vai Output
   *
   * @param data - projectId
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  callbackProject(data: string): void {
    const projectName = this.projects.filter(obj => (obj._id) === data)[0].name;
    this.currentProject = projectName;
    this.formObj.patchValue({
      projectId: data
    });
  }

  /**
   * get labels from child component vai Output
   *
   * @param data - labels/Tags Arrray
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  callbackLabel(data: string[]): void {
    this.formObj.patchValue({
      labelIds: data
    });
  }

  /**
   * get date from child component vai Output
   *
   * @param data - Date
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  callbackDate(data: string): void {
    this.formObj.patchValue({
      scheduledDate: data
    });
  }

  /**
   * add/update the task
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  submit(): void {
    if (this.formObj.valid) {
      let $todo = null;
      const postBody = this.formValue;
      const { subTasks } = postBody;
      let filteredSubTasks = subTasks.filter((item: TodoType) => item.title);
      filteredSubTasks = filteredSubTasks.map((item: TodoType) => {
        const { isCompleted, title } = item;
        return {
          isCompleted,
          title
        };
      });
      if(!postBody.noteId){
        delete postBody.noteId;
      }
      if (postBody._id) {
        postBody.subTasks = filteredSubTasks;
        $todo =  this.todoService
          .updateTodo(postBody, this.conditions);
      } else {
        delete postBody.subTasks;
        $todo =  this.todoService
          .createTodo(postBody, this.conditions);
      }
      this.isSubmit = true;
      $todo.subscribe(
        () => {
          this.isSubmit = false;
          // this.isOpen.emit(false);
          this.activeModal.dismiss();
          let message = 'Task created';
          if (this.formObj.value._id) {
            message = 'Task updated';
          }
          this.toastr.toastrSuccess(message);
        },
        () => {
          this.isSubmit = false;
        });
    }
  }

  /**
   * Lifecycle Method
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  ngOnDestroy(): void {
    if(this.routeSubscription){
      this.routeSubscription.unsubscribe();
    }
  }

}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  declarations:[
    TodoDialogComponent,
    DialogTodoTagsComponent,
    TodoProjectListDialogComponent,
    CustomDateModalComponent
  ]
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TodoDialogModule{}

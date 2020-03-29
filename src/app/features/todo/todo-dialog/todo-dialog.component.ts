import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MDCDialog } from '@material/dialog';
import {MDCSwitch} from '@material/switch';
import { TodoService } from '../../../service/todo/todo.service';
import { SharedService } from '../../../service/shared/shared.service';
import { TodoType, TodoLabelType, TodoConditions } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent implements OnInit, AfterViewInit {

  @Input()
  todo: TodoType;
  @Input()
  conditions: TodoConditions = null;
  @Input()
  origin = null;

  @Output()
  isOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  formObj: FormGroup;
  labels: TodoLabelType[];
  dialog: MDCDialog;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    const labelIdVal = this.todo.label.length ? (this.todo.label.map(label  => {
      return label._id;
    })) : [];
    console.log(labelIdVal);
    this.formObj = this.fb.group(
      {
        _id: [this.todo._id],
        title: [this.todo.title, [Validators.required]],
        scheduling: [this.todo.scheduledDate ? true : false],
        scheduledDate: [this.todo.scheduledDate ? this.todo.scheduledDate : this.sharedService.todayDisplayDate()],
        labelId: [labelIdVal]
      }
    );
    this.getLabels();
  }

  isChecked(labelId: string) {
    return this.formObj.value.labelId.indexOf(labelId) !== -1 ? true : false;
  }

  checkLabels($event, labelId: string) {
    const index = this.formObj.value.labelId.indexOf(labelId);
    if (index === -1) {
      this.formObj.value.labelId.push(labelId);
    } else {
      this.formObj.value.labelId.splice(index, 1);
    }
  }

  ngAfterViewInit() {
    if (this.todo._id) {
      this.dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
      const switchControl = new MDCSwitch(document.querySelector('.mdc-switch'));
      this.dialog.open();
      // dialog.listen('MDCDialog:opened', () => {
      //   // Assuming contentElement references a common parent element with the rest of the page's content
      //   // contentElement.setAttribute('aria-hidden', 'true');
      // });
      this.dialog.listen('MDCDialog:closing', () =>  {
        this.isOpen.emit(false);
      });
    }
  }

  getLabels() {
    this.todoService
      .listTodoLabels()
      .subscribe(response => {
        this.labels = response;
      });
  }

  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      this.todoService
        .updateTodo(postBody, this.conditions)
        .subscribe(() => {
          this.dialog.close();
        });
    }
  }
}

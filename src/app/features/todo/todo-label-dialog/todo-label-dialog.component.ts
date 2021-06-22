import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TodoLabelType } from 'src/app/models';
import { TagService } from 'src/app/service';

@Component({
  selector: 'app-todo-label-dialog',
  templateUrl: './todo-label-dialog.component.html',
  styleUrls: ['./todo-label-dialog.component.scss']
})
export class TodoLabelDialogComponent implements OnInit {

  @Input() label: TodoLabelType;
  @Output() callback: EventEmitter<boolean> = new EventEmitter(false);
  formObj: FormGroup;
  private tagSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    public activeModal: MatDialogRef<TodoLabelDialogComponent>
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      _id: [''],
      name: ['', [Validators.required]],
      description: [''],
      color: [this.generateColor(), [Validators.required]],
      operationType: ['ADD']
    });
    // populate form
    this.populateForm(this.label);
  }

  populateForm(label: TodoLabelType) {
    if (label) {
      this.formObj.patchValue({
        // eslint-disable-next-line no-underscore-dangle
        _id: label._id,
        name: label.name || '',
        description: label.description || '',
        color: label.color || '',
        operationType: 'UPDATE'
      });
    }
  }

  generateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  submit() {
    if (this.formObj.valid) {
      const postBody = this.formObj.value;
      this.todoOperationExec(postBody);
    }
  }

  todoOperationExec(postBody: TodoLabelType) {
    let tag$ = null;
    // eslint-disable-next-line no-underscore-dangle
    if(this.label?._id){
      tag$ = this.tagService.update(postBody);
    } else {
      tag$ = this.tagService.create(postBody);
    }
    this.tagSubscription = tag$.subscribe(() => {
      this.activeModal.close();
      this.callback.next(true);
    });
  }

}

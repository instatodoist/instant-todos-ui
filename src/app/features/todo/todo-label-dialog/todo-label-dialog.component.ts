import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoLabelType } from 'src/app/models';
import { TodoService } from 'src/app/service';

@Component({
  selector: 'app-todo-label-dialog',
  templateUrl: './todo-label-dialog.component.html',
  styleUrls: ['./todo-label-dialog.component.scss']
})
export class TodoLabelDialogComponent implements OnInit {

  @Input() label: TodoLabelType;
  @Input() modelId = 'tagLabelDialog';
  @Output() done: EventEmitter<boolean> = new EventEmitter(false);
  formObj: FormGroup;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
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
    this.todoService
      .todoLabelOperation(postBody)
      .subscribe(() => {
        this.done.next(true);
      });
  }

}

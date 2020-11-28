import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TodoLabelType } from '../../../models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

@Component({
  selector: 'app-dialog-todo-tags',
  templateUrl: './dialog-todo-tags.component.html',
  styleUrls: ['./dialog-todo-tags.component.scss']
})
export class DialogTodoTagsComponent implements OnInit {

  @Input() labelIds: string[] = [];
  @Input() labels: TodoLabelType[] = [];
  @Input() modelId = 'tagsModal';
  @Output() data: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void { }

  // auto checked the labels if exist
  isChecked(label: TodoLabelType): boolean {
    this.labelIds = this.labelIds || [];
    return this.labelIds.indexOf(label._id) !== -1 ? true : false;
  }

  // check & uncheck labels
  checkLabels(label: TodoLabelType): void {
    this.labelIds = this.labelIds || [];
    const labelId = label._id;
    const index = this.labelIds.indexOf(labelId);
    if (index === -1) {
      this.labelIds.push(labelId);
    } else {
      this.labelIds.splice(index, 1);
    }
    this.data.next(this.labelIds);
  }

  redirectToTagsUi(): void {
    $('.modal').modal('hide'); // closes all active pop ups.
    $('.modal-backdrop').remove();
    this.router.navigate(['/tasks/tags']);
  }

}

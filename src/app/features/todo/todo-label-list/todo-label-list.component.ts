import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from '../../../service';
import { TodoLabelType } from '../../../models';
import { UtilityService  } from '../../../service';
import { TodoLabelDialogComponent } from '../todo-label-dialog/todo-label-dialog.component';

@Component({
  selector: 'app-todo-tags-list',
  templateUrl: './todo-label-list.component.html',
  styleUrls: ['./todo-label-list.component.scss']
})
export class TodoLabelListComponent implements OnInit {

  label: TodoLabelType = null;
  isOpen = false;
  modelIdPopUp = '';
  defaultLabelColor = '#1e3d73'; // default color
  labels: TodoLabelType[] = [];

  constructor(
    private todoService: TodoService,
    private toast: UtilityService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.todoService.listTodoLabels().subscribe( data => {
      this.labels = data;
    });
  }

  openPopup(label: TodoLabelType = null) {
    const modelRef = this.modalService.open(TodoLabelDialogComponent, {size: 'small'});
    modelRef.componentInstance.label = label;
    modelRef.componentInstance.callback.subscribe(()=>{
      if (this.label) {
        this.toast.toastrSuccess('Tag has been updated');
      } else {
        this.toast.toastrSuccess('Tag has been added');
      }
    });
    this.label = label;
  }

  deleteLabel(label: TodoLabelType) {
    this.todoOperationExec({
      // eslint-disable-next-line no-underscore-dangle
      _id: label._id,
      operationType: 'DELETE'
    });
  }

  todoOperationExec(postBody) {
    this.todoService
      .todoLabelOperation(postBody)
      .subscribe(() => {
        if (postBody.operationType === 'DELETE') {
          this.toast.toastrSuccess('Tag has been deleted');
        }
      });
  }

}

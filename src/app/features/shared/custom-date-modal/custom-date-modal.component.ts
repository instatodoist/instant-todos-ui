import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
type Operation = 'ADD' | 'UPDATE';
@Component({
  selector: 'app-custom-date-modal',
  templateUrl: './custom-date-modal.component.html',
  styleUrls: ['./custom-date-modal.component.scss']
})
export class CustomDateModalComponent implements OnInit, AfterViewInit {
  @Input() operationType: Operation;
  @Input() scheduledAt = null;
  @Output() callback: EventEmitter<Date> = new EventEmitter<Date>();
  model: Date | null;;

  constructor(
    public dialogRef: MatDialogRef<CustomDateModalComponent>
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  isDisabled() {

  }

  onEvent(model: any) {
    this.callback.next(model);
    this.dialogRef.close();
  }

}

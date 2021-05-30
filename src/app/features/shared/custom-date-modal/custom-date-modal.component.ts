import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import {NgbDateStruct, NgbActiveModal, NgbDate} from '@ng-bootstrap/ng-bootstrap';
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
  model: Date;
  date: {year: number; month: number; day: number};

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    console.log(this.scheduledAt, 'ssssss ');
  }

  ngAfterViewInit() {}

  isDisabled = (date: NgbDate, current: {month: number; year: number; day: number}) => date.month < current.month ||
    (date.month === current.month && date.day < current.day) || date.year < current.year;

  onEvent(model: any) {
    this.callback.next(model);
    this.activeModal.dismiss();
  }

}

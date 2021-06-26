import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  todayDate() {
    return moment().format('YYYY-MM-DD');
  }

  yesterdayDate() {
    return moment().subtract(1, 'day').format('YYYY-MM-DD');
  }
}

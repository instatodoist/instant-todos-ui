import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilityService } from '../../service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  jQuery = this.utilityService.JQuery;

  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
  }

}

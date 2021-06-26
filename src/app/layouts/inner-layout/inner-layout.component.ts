import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilityService } from '../../service';

@Component({
  selector: 'app-inner-layout',
  templateUrl: './inner-layout.component.html',
  styleUrls: ['./inner-layout.component.scss']
})
export class InnerLayoutComponent implements OnInit {

  jQuery = this.utilityService.JQuery;

  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
  }

}

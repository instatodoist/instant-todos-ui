import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { SmartAnalysisRoutingModule } from './smart-analysis-routing.module';
import { SaDailyComponent } from './sa-daily/sa-daily.component';

@NgModule({
  declarations: [SaDailyComponent],
  imports: [
    CommonModule,
    ChartsModule,
    SmartAnalysisRoutingModule
  ]
})
export class SmartAnalysisModule { }

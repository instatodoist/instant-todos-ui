import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaDailyComponent } from './sa-daily/sa-daily.component';

const routes: Routes = [{
  path: '',
  component: SaDailyComponent,
  data: {
    header_title: 'smart-analysis'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartAnalysisRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule
  ],
  exports: [
    FlexLayoutModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule
  ]
})
export class MaterialModule { }

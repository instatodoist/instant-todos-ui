import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule,
    MatRadioModule,
  ],
  exports: [
    FlexLayoutModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule,
    MatRadioModule,
  ]
})
export class MaterialModule { }

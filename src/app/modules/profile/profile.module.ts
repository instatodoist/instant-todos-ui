import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';
import { AccountUpdateComponent } from './account-update/account-update.component';

@NgModule({
  declarations: [
    ProfileUpdateComponent,
    PasswordUpdateComponent,
    AccountUpdateComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }

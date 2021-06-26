import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';
import { AccountUpdateComponent } from './account-update/account-update.component';


const routes: Routes = [
  {
    path: '',
    component: ProfileUpdateComponent,
    children: [
      {
        path: 'password',
        component: PasswordUpdateComponent,
        data: {
          header_title: 'account_password'
        }
      },
      {
        path: 'update',
        component: AccountUpdateComponent,
        data: {
          header_title: 'account_update'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

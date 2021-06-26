import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FrontRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { environment } from '../../../environments/environment';
// Components
import { HomeLayoutComponent } from '../../layouts/home-layout/home-layout.component';
import { AuthComponent } from './auth-login/auth.component';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthVerifyComponent } from './auth-verify/auth-verify.component';
import { AuthForgotComponent } from './auth-forgot/auth-forgot.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';

@NgModule({
  declarations: [
    HomeLayoutComponent,
    AuthLayoutComponent,
    AuthComponent,
    AuthRegisterComponent,
    AuthVerifyComponent,
    AuthForgotComponent,
    AuthResetPasswordComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FrontRoutingModule,
    SharedModule
  ],
  exports: [
    SharedModule
  ]
})

export class AuthModule { }

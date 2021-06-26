/* eslint-disable @typescript-eslint/naming-convention */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth-login/auth.component';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';
import { CanActivateAuthenticateGuard } from '../../guards/can-activate-authenticate.guard';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthVerifyComponent } from './auth-verify/auth-verify.component';
import { AuthForgotComponent } from './auth-forgot/auth-forgot.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component';

const authRoutes: Routes = [
  {
    canActivate: [CanActivateAuthenticateGuard],
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: AuthComponent,
        data: {
          header_title: 'login'
        }
      },
      {
        path: 'forgot-password',
        component: AuthForgotComponent,
        data: {
          header_title: 'forgot-password'
        }
      },
      {
        path: 'forgot-password/confirmation/:hash',
        component: AuthVerifyComponent,
        data: {
          header_title: 'forgot-password-confirmation'
        }
      },
      {
        path: 'reset-password/:hash',
        component: AuthResetPasswordComponent,
        data: {
          header_title: 'reset-password'
        }
      },
      {
        path: 'register',
        component: AuthRegisterComponent,
        data: {
          header_title: 'register'
        }
      },
      {
        path: 'verification/:hash',
        component: AuthVerifyComponent,
        data: {
          header_title: 'verification'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(authRoutes, { enableTracing: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class FrontRoutingModule { }

/* eslint-disable @typescript-eslint/naming-convention */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from '../../layouts/home-layout/home-layout.component';

import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          header_title: 'enhance_productivity'
        }
      }
    ]
  },
  {
    path: 'pages',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: {
          header_title: 'privacy-policy'
        }
      },
      {
        path: 'terms',
        component: TermsConditionsComponent,
        data: {
          header_title: 'terms'
        }
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
        data: {
          header_title: 'contact-us'
        }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

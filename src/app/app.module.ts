/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { AuthModule } from './modules/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './modules/shared/shared.module';
import { GraphqlModule } from './graphql/graphql.module';
import { GoogleAnalyticService } from './service/analytics/google-analytic.service';

import { CanActivateAuthenticateGuard } from './guards/can-activate-authenticate.guard';

import { AppComponent } from './app.component';
import { InnerLayoutComponent } from './layouts/inner-layout/inner-layout.component';
import { HeaderComponent } from './modules/shared/section/header/header.component';
import { ThemeComponent } from './modules/shared/section/theme/theme.component';
import { SidebarComponent } from './modules/shared/section/sidebar/sidebar.component';
import { PageNotFoundComponent } from './modules/shared/page-not-found/page-not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    InnerLayoutComponent,
    HeaderComponent,
    ThemeComponent,
    SidebarComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphqlModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SocialLoginModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
  ],
  providers: [
    CanActivateAuthenticateGuard,
    GoogleAnalyticService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GID)
          }        ]
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
// eslint-disable-next-line @typescript-eslint/naming-convention
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader  {
  return new TranslateHttpLoader(http);
}

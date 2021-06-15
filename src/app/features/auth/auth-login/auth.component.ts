import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import {  GoogleLoginProvider } from 'angularx-social-login';
import { LsService, AuthService, AppService, SettingService } from '../../../service';
import { IUserProfile } from '../../../models';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isGoogleLogin = false;
  loader: boolean;
  isSubmit = false;
  signinForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private lsService: LsService,
    private appService: AppService,
    private socialService: SocialAuthService,
    private settingService: SettingService
  ) { }

  ngOnInit(): void {}

  // auth check after submit
  signIn(): void {
    this.loader = true;
    this.isSubmit = true;
    this.authService.signIn(this.signinForm.value)
      .pipe(
        switchMap((response: any)=>{
          const data = response.login;
          this.lsService.setValue('isLoggedIn', true);
          this.lsService.setValue('__token', data.token);
          return combineLatest([this.settingService.fetch(), this.appService.languages()]);
        })
      )
      .subscribe(([setting, languages])=>{
        const lang = setting?.lang || 'en';
        // set default theme
        this.lsService.setValue('defaultTheme', setting.theme);
        // set default language
        this.lsService.setValue('lng', lang);
        const selectedLang = this.appService.selectedLanguage(lang, languages);
        // set lang object
        this.lsService.setValue('lang', JSON.stringify(selectedLang));
        this.isSubmit = false;
        this.loader = false;
        // reload window
        window.location.reload();
      },
      (err) => {
        console.log(err);
        this.isSubmit = false;
        this.loader = false;
      }
    );
  }

  signInWithGoogle(): void {
    try {
      this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID);
      this.socialService.authState
        .subscribe((user) => {
          this.isGoogleLogin = true;
          const postBody: IUserProfile  = {
            firstname: user.firstName,
            lastname: user.lastName || '',
            email: user.email,
            gID: user.id,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            profile_image: user.photoUrl
          };
          this.authService.googleLogin(postBody)
            .subscribe(
              data=>{
                this.lsService.setValue('isLoggedIn', true);
                this.lsService.setValue('__token', data.token);
                window.location.reload();
              },
              ()=>{
                this.isGoogleLogin = false;
              }
            );
        });
    } catch(err) {
      console.log(err);
    }
  }
}

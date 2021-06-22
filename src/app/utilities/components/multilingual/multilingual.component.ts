import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AppService, UtilityService, SettingService } from '../../../service';
import { ILanguage } from '../../../models';

@Component({
  selector: 'app-multilingual',
  template: `
    <li class="nav-item">
      <a [matMenuTriggerFor]="menu" class="search-toggle iq-waves-effect language-title active cursor">
      <img src="{{defaultLang?.logo}}" alt="img-flaf" class="img-fluid mr-1" style="height: 16px; width: 16px;">
          {{defaultLang?.value | uppercase}}
          <i class="ri-arrow-down-s-line"></i>
      </a>
      <mat-menu #menu="matMenu" [ngStyle]=" hasChild && {'display' :  'block' }">
        <button mat-menu-item *ngFor="let lang of languages" (click)="hasChild = !hasChild; onChangeLanguage(lang)">
          <img src="{{lang?.logo}}" alt="img-flaf" class="img-fluid mr-2">{{lang?.name}}
        </button>
      </mat-menu>
    </li>
  `,
  styles: [
  ]
})
export class MultilingualComponent implements OnInit {

  hasChild = false;
  languages$: Subscription;
  languages: ILanguage[] = [];
  defaultLang: ILanguage = null;
  jQuery = this.utilityService.JQuery;

  constructor(
    private translate: TranslateService,
    private appService: AppService,
    private utilityService: UtilityService,
    private settingService: SettingService
  ) { }

  ngOnInit(): void {
    this.getLanguages();
  }

  // change language
  useLanguage(language: string): void {
    this.translate.use(language);
  }

  /**
   * set the current language for the app
   *
   * @param lang - language
   */
  onChangeLanguage(lang: ILanguage): void {
    this.translate.use(lang.value);
    this.defaultLang = lang;
    // update root state
    this.appService.setLanguage(lang);
    this.settingService.update({
      lang: lang.value
    }).subscribe();
  }

  /**
   * fetch all the languages for internationalization
   */
  getLanguages(): void {
    this.languages$ = this.appService.languages()
      .subscribe((response) => {
        const languages = response;
        if (localStorage.getItem('lng')) {
          const selectedLang = this.appService.selectedLanguage(localStorage.getItem('lng'), languages);
          this.defaultLang = selectedLang;
        } else {
          this.defaultLang = this.appService.selectedLanguage('en', languages);
        }
        this.translate.use(this.defaultLang?.value || 'en');
        this.languages = languages;
        // update root state
        this.appService.setLanguage(this.defaultLang);
      });
  }

}

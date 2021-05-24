import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AppService, UtilityService } from '../../../service';
import { ILanguage } from '../../../models';

@Component({
  selector: 'app-multilingual',
  template: `
    <li class="nav-item">
      <a  (click)="hasChild = !hasChild" class="search-toggle iq-waves-effect language-title active" href="javascript:void(0)">
        <span class="ripple rippleEffect">
        </span>
        <img src="{{defaultLang?.logo}}" alt="img-flaf" class="img-fluid mr-1" style="height: 16px; width: 16px;">
        {{defaultLang?.value | uppercase}}
        <i class="ri-arrow-down-s-line"></i>
      </a>
      <div class="iq-sub-dropdown" [ngStyle]=" hasChild && {'display' :  'block' }">
        <a class="iq-sub-card cursor" *ngFor="let lang of languages" (click)="hasChild = !hasChild; onChangeLanguage(lang)">
          <img src="{{lang?.logo}}" alt="img-flaf" class="img-fluid mr-2">{{lang?.name}}
        </a>
      </div>
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
    private utilityService: UtilityService
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
    localStorage.setItem('lang', JSON.stringify(lang));
    this.appService. updateCoreAppData({ ...this.appService.APP_DATA, lang });
    // this.languages = this.languages.filter(item => item.value !== lang.value);
  }

  /**
   * fetch all the languages for internationalization
   */
  getLanguages(): void {
    this.languages$ = this.appService.languages().subscribe((response) => {
      const languages = response;
      if (localStorage.getItem('lang')) {
        const language: ILanguage = JSON.parse(localStorage.getItem('lang'));
        this.defaultLang = languages.filter(item => item.value === language.value)[0];
      } else {
        this.defaultLang = languages.filter(item => item.value === 'en')[0];
      }
      this.translate.use(this.defaultLang.value);
      this.languages = languages;
      // this.languages = languages.filter(item => item.value !== this.defaultLang.value);
    });
  }

}

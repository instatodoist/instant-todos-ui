/* eslint-disable @typescript-eslint/naming-convention */
import { Title, Meta } from '@angular/platform-browser';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, of, Observable } from 'rxjs';
import { IAppData, ILanguage, IMetaTag } from './../models';
import { LsService } from '../service/ls.service';

@Injectable({
  providedIn: 'root'
})

export class AppService implements OnDestroy {
  APP_DATA: IAppData = {
    config: {
      theme: localStorage.getItem('defaultTheme') || 'rgb(255, 0, 0)',
      tClass: localStorage.getItem('defaultThemeClass') || 'color-9'
    },
    isLoggedIn: Boolean(this.lsService.getValue('isLoggedIn')) || false,
    token: this.lsService.getValue('__token') || null,
    session: null,
    lang: null
  };
  APP_LEVEL: BehaviorSubject<IAppData> = new BehaviorSubject(this.APP_DATA);
  appSubscription: Subscription;
  private currentUrlDataSource = new BehaviorSubject<string>('');

  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentUrlObservable = this.currentUrlDataSource.asObservable();

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private lsService: LsService
  ) {
    // initialize the modal config
    this.subscribeToAppData();
  }

  ngOnDestroy(): void {
    this.appSubscription.unsubscribe();
  }

  get loaderImage(): string {
    return '/assets/facelift/images/page-img/page-load-loader.gif';
  }

  get defautProfileImage(): string {
    return '/assets/facelift/images/defafault_user.png';
  }

  updateCurentUrl(data: string): void {
    this.currentUrlDataSource.next(data);
  }

   updateCoreAppData(data: IAppData): void {
    this.APP_LEVEL.next(data);
  }

  changeTheme(iqColor: string): void {
    localStorage.setItem('defaultTheme', iqColor);
    const str = iqColor;
    const res = str.replace('rgb(', '');
    const res1 = res.replace(')', '');
    const iqColor2 = 'rgba(' + res1.concat(',', '0.1') + ')';
    const iqColor3 = 'rgba(' + res1.concat(',', '0.8') + ')';
    document.documentElement.style.setProperty('--iq-primary', iqColor);
    document.documentElement.style.setProperty('--iq-light-primary', iqColor2);
    document.documentElement.style.setProperty('--iq-primary-hover', iqColor3);
    this.APP_DATA = {
      ...this.APP_DATA, config: {
        ...this.APP_DATA.config, theme: iqColor
      }
    };
  }

  languages(): Observable<ILanguage[]> {
    const lang = [
      {
        name: 'English',
        value: 'en',
        logo: '/assets/facelift/images/small/flag-01.png'
      },
      {
        name: 'French',
        value: 'fr',
        logo: '/assets/facelift/images/small/flag-02.png'
      },
      {
        name: 'Spanish',
        value: 'es',
        logo: '/assets/facelift/images/small/flag-03.png'
      },
      {
        name: 'Hindi',
        value: 'hi',
        logo: '/assets/facelift/images/small/flag-04.png'
      }
    ];
    return of(lang);
  }

  selectedLanguage(lang: string, languages: ILanguage[]): ILanguage {
    return languages.find(item=>item.value === lang);
  };

  configureSeo(title: string, metaTags: IMetaTag[] = null): void {
    this.titleService.setTitle(`${title} | InstaTodos`);
    if (metaTags && metaTags.length) {
      this.metaService.addTags(metaTags);
    }
  }

  // subscribe & update any app level data
  private subscribeToAppData() {
    this.APP_LEVEL.subscribe((data: IAppData) => {
      this.APP_DATA = {...this.APP_DATA, ...data};
    });
  }
}

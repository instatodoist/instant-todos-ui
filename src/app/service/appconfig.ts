import { Title, Meta } from '@angular/platform-browser';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, of, Observable } from 'rxjs';
import { IExternalModal, IAppData, ILanguage, IMetaTag } from './../models';
import { LsService } from '../service/ls.service';

// TODO: Add Angular decorator.
// TODO: Add Angular decorator.
@Injectable({
  providedIn: 'root',
})

export class AppService implements OnDestroy {
  APP_LEVEL: BehaviorSubject<IAppData>;
  externalModal: BehaviorSubject<IExternalModal>;
  ExternalModelConfig: IExternalModal = {
    TODO_ADD: false,
    TODO_UPDATE: false,
    GOAL_UPDATE: false,
    GOAL_ADD: false,
    data: {
      todo: null,
      goal: null,
      conditions: null
    }
  };
  APP_DATA: IAppData = {
    config: {
      theme: localStorage.getItem('defaultTheme') || 'rgb(243, 95, 59)',
      tClass: localStorage.getItem('defaultThemeClass') || 'color-1'
    },
    isLoggedIn: Boolean(this.lsService.getValue('isLoggedIn')) || false,
    token: this.lsService.getValue('__token') || null,
    session: null,
    lang: null
  };
  appSubscription: Subscription;

  private currentUrlDataSource = new BehaviorSubject<string>('');

  currentUrlObservable = this.currentUrlDataSource.asObservable();

  updateCurentUrl(data: string) {
    this.currentUrlDataSource.next(data);
  }

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private lsService: LsService
  ) {
    // initialize app level data
    this.APP_LEVEL = new BehaviorSubject(this.APP_DATA);
    // initialize the modal config
    this.externalModal = new BehaviorSubject(this.ExternalModelConfig);
    this.subscribeToAppData();
  }

  updateExternalModal(obj: IExternalModal) {
    this.externalModal.next(obj);
  }

  __updateCoreAppData(data: IAppData) {
    this.APP_LEVEL.next(data);
  }

  changeTheme(iqColor: any) {
    localStorage.setItem('defaultTheme', iqColor);
    const str = iqColor;
    const res = str.replace('rgb(', '');
    const res1 = res.replace(')', '');
    const iqColor2 = 'rgba(' + res1.concat(',', 0.1) + ')';
    const iqColor3 = 'rgba(' + res1.concat(',', 0.8) + ')';
    document.documentElement.style.setProperty('--iq-primary', iqColor);
    document.documentElement.style.setProperty('--iq-light-primary', iqColor2);
    document.documentElement.style.setProperty('--iq-primary-hover', iqColor3);
  }

  get loaderImage() {
    return '/assets/facelift/images/page-img/page-load-loader.gif';
  }

  get defautProfileImage() {
    return '/assets/facelift/images/defafault_user.png';
  }

  // subscribe & update any app level data
  private subscribeToAppData() {
    this.APP_LEVEL.subscribe((data: IAppData) => {
      this.APP_DATA = {...this.APP_DATA, ...data};
    });
    this.externalModal.subscribe((data: IExternalModal) => {
      this.ExternalModelConfig = {...this.ExternalModelConfig, ...data};
    });
  }

  ngOnDestroy() {
    this.appSubscription.unsubscribe();
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
      },
    ];
    return of(lang);
  }

  configureSeo(title: string, metaTags?: IMetaTag[]) {
    this.titleService.setTitle(`InstaTodo: ${title}`);
    if (metaTags.length) {
      this.metaService.addTags(metaTags);
    }
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
import { Title, Meta } from '@angular/platform-browser';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, of, Observable, combineLatest } from 'rxjs';
import { IAppData, ILanguage, IMetaTag, ILoginResponse } from '../../models';
import { LsService } from '../ls/ls.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AppService implements OnDestroy {
  // root state
  ROOT_STATE: IAppData = {
    config: {
      theme: localStorage.getItem('defaultTheme') || 'rgb(255, 0, 0)',
      lng: 'en',
      lang: null,
      currentUrl: null
    },
    isLoggedIn: Boolean(this.lsService.getValue('isLoggedIn')) || false,
    token: this.lsService.getValue('__token') || null,
    session: null
  };

  // subject
  ROOT_STATE$$: BehaviorSubject<IAppData> = new BehaviorSubject(this.ROOT_STATE);
  ROOT_STATE$ = this.ROOT_STATE$$.asObservable();

  // use to get current url
  countDataSource$$ = new BehaviorSubject<any>({
    pending: 0,
    today: 0,
    inbox: 0,
    completed: 0,
    upcoming: 0
  });

  // use to get current url
  private currentUrlDataSource$$ = new BehaviorSubject<string>('');
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentUrlDataSource$ = this.currentUrlDataSource$$.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  countDataSource$ = this.countDataSource$$.asObservable();

  private params$ = combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams]);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private lsService: LsService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {}

  get loaderImage(): string {
    return '/assets/facelift/images/page-img/page-load-loader.gif';
  }

  get defautProfileImage(): string {
    return '/assets/facelift/images/defafault_user.png';
  }

  setAppCurrentUrl(data: string): void {
    this.currentUrlDataSource$$.next(data);
  }

  setRootState(data: IAppData): void {
    this.ROOT_STATE$$.next(data);
  }

  // set session
  setSession(user: ILoginResponse): void {
    this.lsService.setValue('isLoggedIn', true);
    this.lsService.setValue('__token', user.token);
  }

  // set app theme
  setTheme(iqColor: string): void {
    localStorage.setItem('defaultTheme', iqColor);
    const str = iqColor;
    const res = str.replace('rgb(', '');
    const res1 = res.replace(')', '');
    const iqColor2 = 'rgba(' + res1.concat(',', '0.1') + ')';
    const iqColor3 = 'rgba(' + res1.concat(',', '0.8') + ')';
    document.documentElement.style.setProperty('--iq-primary', iqColor);
    document.documentElement.style.setProperty('--iq-light-primary', iqColor2);
    document.documentElement.style.setProperty('--iq-primary-hover', iqColor3);
    this.ROOT_STATE = {
      ...this.ROOT_STATE, config: {
        ...this.ROOT_STATE.config, theme: iqColor
      }
    };
  }

  // set multilanguage flag
  setLanguage(lang: ILanguage): void {
    localStorage.setItem('lang', JSON.stringify(lang));
    localStorage.setItem('lng', lang.value);
    this.setRootState({
       ...this.ROOT_STATE,
       config: {
         ...this.ROOT_STATE.config,
         lang,
         lng: lang.value
       }
    });
  }

  // grab available languages
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

  // get default language
  selectedLanguage(lang: string = 'en', languages: ILanguage[]): ILanguage {
    return languages.find(item=>item.value === lang);
  };

  configureSeo(title: string, metaTags: IMetaTag[] = null): void {
    this.titleService.setTitle(`${title} | InstaTodos`);
    if (metaTags && metaTags.length) {
      this.metaService.addTags(metaTags);
    }
  }

  fetchParams() {
    return this.params$.pipe(
      switchMap((response) => {
        const [p, query] = response;
        const { label = null } = p;
        const { q = '' } = query;
        return of({ label, q });
      })
    );
  }
}

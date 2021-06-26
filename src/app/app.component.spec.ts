import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import {delay} from 'rxjs/operators';
import { AppModule } from './app.module';
import { AppService } from './services';
import { AppComponent } from './app.component';
import { IExternalModal } from './models';

fdescribe('AppComponent', () => {
  let appService: AppService;
  let modalDefaultCOnfig: IExternalModal;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AppService
      ]
    }).compileComponents();
    appService = TestBed.inject(AppService);
    modalDefaultCOnfig = {
      TODO_ADD: false,
      TODO_UPDATE: false,
      GOAL_UPDATE: false,
      GOAL_ADD: false,
      data: {
        todo: null,
        goal: null
      }
    };
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'InstaTodo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('InstaTodo');
  });

  it(`should return the global modals config for the application`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // spyOnProperty(appService.externalModal, 'value', 'get').and.returnValue(of(modalDefaultCOnfig).pipe(delay(1)));
    // Trigger ngOnInit()
    expect(component.extModalConfig).toBeUndefined();
    // fixture.detectChanges();
    // tick(1);
    // expect(component.extModalConfig).toEqual(modalDefaultCOnfig);
  });

  // fit('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('admin-webapp app is running!');
  // });

  // it(`should return the global modals config for the application`, fakeAsync(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const component = fixture.componentInstance;
  //   spyOnProperty(appService.externalModal, 'value', 'get').and.returnValue(of(modalDefaultCOnfig).pipe(delay(1)));
  //   // Trigger ngOnInit()
  //   expect(component.extModalConfig).toBeUndefined();
  //   // fixture.detectChanges();
  //   // tick(1);
  //   // expect(component.extModalConfig).toEqual(modalDefaultCOnfig);
  // }));

  // fit('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('admin-webapp app is running!');
  // });
});

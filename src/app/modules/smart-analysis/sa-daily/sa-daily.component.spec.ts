import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaDailyComponent } from './sa-daily.component';

describe('SaDailyComponent', () => {
  let component: SaDailyComponent;
  let fixture: ComponentFixture<SaDailyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaDailyComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

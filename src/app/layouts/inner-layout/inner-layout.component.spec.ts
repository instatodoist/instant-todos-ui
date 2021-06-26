import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InnerLayoutComponent } from './inner-layout.component';

describe('AdminComponent', () => {
  let component: InnerLayoutComponent;
  let fixture: ComponentFixture<InnerLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerLayoutComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

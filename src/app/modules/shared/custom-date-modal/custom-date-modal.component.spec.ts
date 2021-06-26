import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomDateModalComponent } from './custom-date-modal.component';

describe('CustomDateModalComponent', () => {
  let component: CustomDateModalComponent;
  let fixture: ComponentFixture<CustomDateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDateModalComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

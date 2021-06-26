import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultilingualComponent } from './multilingual.component';

describe('MultilingualComponent', () => {
  let component: MultilingualComponent;
  let fixture: ComponentFixture<MultilingualComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilingualComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilingualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

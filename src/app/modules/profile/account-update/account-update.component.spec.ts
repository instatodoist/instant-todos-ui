import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountUpdateComponent } from './account-update.component';

describe('AccountUpdateComponent', () => {
  let component: AccountUpdateComponent;
  let fixture: ComponentFixture<AccountUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountUpdateComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoalDialogComponent } from './goal-dialog.component';

describe('GoalDialogComponent', () => {
  let component: GoalDialogComponent;
  let fixture: ComponentFixture<GoalDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

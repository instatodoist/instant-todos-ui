import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoLabelDialogComponent } from './todo-label-dialog.component';

describe('TodoLabelDialogComponent', () => {
  let component: TodoLabelDialogComponent;
  let fixture: ComponentFixture<TodoLabelDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoLabelDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoLabelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
